import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/order';
import { reviewAPI } from '../services/api.service';
import ProfileSidebar from '../components/ProfileSidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/App.css';

const MyPurchasesPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewStatuses, setReviewStatuses] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await orderAPI.getUserOrders();
      const ordersData = response.data || [];
      setOrders(ordersData);
      
      // Check review status for each order
      const statuses: {[key: string]: boolean} = {};
      for (const order of ordersData) {
        try {
          const reviewResponse = await reviewAPI.checkReviewExists(order._id);
          statuses[order._id] = reviewResponse.exists;
        } catch (err) {
          statuses[order._id] = false;
        }
      }
      setReviewStatuses(statuses);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError('Failed to load your purchases. Please try again.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReviewModal = async (order: any) => {
    // Check if review already exists before opening modal
    if (reviewStatuses[order._id]) {
      setError('You have already reviewed this purchase.');
      return;
    }
    
    try {
      const reviewCheck = await reviewAPI.checkReviewExists(order._id);
      if (reviewCheck.exists) {
        setReviewStatuses({ ...reviewStatuses, [order._id]: true });
        setError('You have already reviewed this purchase.');
        return;
      }
    } catch (err) {
      // If check fails, still allow opening the modal
      console.error('Error checking review:', err);
    }
    
    setSelectedOrder(order);
    setReviewData({ rating: 0, comment: '' });
    setError('');
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedOrder) return;
    if (reviewData.rating === 0) {
      setError('Please select a rating');
      return;
    }
    
    setSubmittingReview(true);
    setError('');
    try {
      await reviewAPI.createReview({
        orderId: selectedOrder._id,
        rating: reviewData.rating,
        comment: reviewData.comment || undefined
      });
      setReviewStatuses({ ...reviewStatuses, [selectedOrder._id]: true });
      setShowReviewModal(false);
      setSelectedOrder(null);
      setReviewData({ rating: 0, comment: '' });
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to submit review. Please try again.';
      setError(errorMessage);
      
      // If review already exists, update status and close modal after a short delay
      if (errorMessage.toLowerCase().includes('already exists')) {
        setReviewStatuses({ ...reviewStatuses, [selectedOrder._id]: true });
        setTimeout(() => {
          setShowReviewModal(false);
          setSelectedOrder(null);
          setReviewData({ rating: 0, comment: '' });
          setError('');
        }, 2000);
      }
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: 'bg-warning',
      confirmed: 'bg-info',
      shipped: 'bg-primary',
      delivered: 'bg-success',
      cancelled: 'bg-danger'
    };
    return statusMap[status] || 'bg-secondary';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getArtworkImage = (artwork: any) => {
    if (artwork && artwork.images && artwork.images.length > 0) {
      // Handle both object structure with url field or array of images
      const firstImage = artwork.images[0];
      return typeof firstImage === 'string' ? firstImage : firstImage.url;
    }
    return 'https://via.placeholder.com/150x150?text=No+Image';
  };

  if (loading) {
    return (
      <div className="container-fluid py-5">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-3 mb-4">
              <ProfileSidebar />
            </div>
            <div className="col-12 col-lg-9">
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-12 col-lg-3 mb-4">
            <ProfileSidebar />
          </div>

          {/* Main Content */}
          <div className="col-12 col-lg-9">
            <div className="bg-white rounded-4 shadow-sm p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h2 className="mb-1">My Purchases</h2>
                  <p className="text-muted mb-0">View your order history</p>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center gap-2">
                  <i className="bi bi-exclamation-triangle"></i>
                  <span>{error}</span>
                  <button type="button" className="btn-close ms-auto" onClick={() => setError('')} aria-label="Close"></button>
                </div>
              )}

              {orders.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-bag-x display-1 text-muted opacity-50"></i>
                  <h4 className="mt-3 mb-2">No Purchases Yet</h4>
                  <p className="text-muted">You haven't made any purchases yet.</p>
                  <button className="btn btn-primary mt-3" onClick={() => navigate('/search')}>
                    <i className="bi bi-search me-2"></i>Browse Artworks
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th scope="col">Order</th>
                        <th scope="col">Artwork</th>
                        <th scope="col">Artist</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Status</th>
                        <th scope="col">Date</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id}>
                          <td>
                            <div className="fw-semibold">#{order._id.slice(-8)}</div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <img
                                src={getArtworkImage(order.artworkId || order.artwork)}
                                alt={(order.artworkId || order.artwork)?.title}
                                className="rounded"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />
                              <div>
                                <div className="fw-semibold">{(order.artworkId || order.artwork)?.title}</div>
                                <div className="text-muted small">{(order.artworkId || order.artwork)?.medium}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>
                              {(order.artworkId && order.artworkId.artistId && order.artworkId.artistId.name) ||
                               (order.artwork && order.artwork.artistId && order.artwork.artistId.name) ||
                               (order.artistId && order.artistId.name) ||
                               'Unknown Artist'}
                            </div>
                          </td>
                          <td>
                            <div className="fw-bold text-primary">${order.totalAmount?.toFixed(2) || order.price?.toFixed(2)}</div>
                          </td>
                          <td>
                            <span className={`badge ${getStatusBadgeClass(order.status || order.orderStatus)} text-white`}>
                              {order.status || order.orderStatus}
                            </span>
                          </td>
                          <td>
                            <div className="small">{formatDate(order.createdAt)}</div>
                          </td>
                          <td>
                            <div className="d-flex gap-1">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => navigate(`/orders/${order._id}`)}
                                title="View Order"
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                              {reviewStatuses[order._id] ? (
                                <button
                                  className="btn btn-sm btn-outline-success"
                                  disabled
                                  title="Review Submitted"
                                >
                                  <i className="bi bi-check-circle-fill"></i>
                                </button>
                              ) : (
                                <button
                                  className="btn btn-sm btn-outline-warning"
                                  onClick={() => handleOpenReviewModal(order)}
                                  title="Add Review"
                                >
                                  <i className="bi bi-star"></i>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <div className={`modal fade ${showReviewModal ? 'show' : ''}`} style={{ display: showReviewModal ? 'block' : 'none' }} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold">Add Review</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedOrder(null);
                  setReviewData({ rating: 0, comment: '' });
                  setError('');
                }}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Close"></button>
                </div>
              )}
              
              {selectedOrder && (
                <div className="mb-4">
                  <div className="d-flex gap-3 mb-3">
                    <img 
                      src={getArtworkImage(selectedOrder.artworkId || selectedOrder.artwork)}
                      alt={(selectedOrder.artworkId || selectedOrder.artwork)?.title}
                      className="rounded"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                    <div>
                      <h6 className="fw-bold mb-1">{(selectedOrder.artworkId || selectedOrder.artwork)?.title}</h6>
                      <p className="text-muted small mb-0">
                        by {
                          ((selectedOrder.artworkId && selectedOrder.artworkId.artistId && selectedOrder.artworkId.artistId.name) ||
                           (selectedOrder.artwork && selectedOrder.artwork.artistId && selectedOrder.artwork.artistId.name) ||
                           (selectedOrder.artistId && selectedOrder.artistId.name) ||
                           'Unknown Artist')
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Rating <span className="text-danger">*</span></label>
                    <div className="d-flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="btn btn-link p-0"
                          onClick={() => setReviewData({ ...reviewData, rating: star })}
                          style={{ fontSize: '2rem', lineHeight: '1' }}
                        >
                          <i className={`bi ${star <= reviewData.rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'}`}></i>
                        </button>
                      ))}
                    </div>
                    {reviewData.rating === 0 && (
                      <small className="text-danger d-block mt-1">Please select a rating</small>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="reviewComment" className="form-label fw-semibold">Your Review</label>
                    <textarea
                      id="reviewComment"
                      className="form-control"
                      rows={4}
                      placeholder="Share your experience with this artwork..."
                      value={reviewData.comment}
                      onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                      maxLength={1000}
                    />
                    <small className="text-muted">{reviewData.comment.length}/1000 characters</small>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedOrder(null);
                  setReviewData({ rating: 0, comment: '' });
                  setError('');
                }}
                disabled={submittingReview}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleSubmitReview}
                disabled={submittingReview || reviewData.rating === 0}
              >
                {submittingReview ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Submitting...
                  </>
                ) : (
                  'Submit Review'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {showReviewModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default MyPurchasesPage;


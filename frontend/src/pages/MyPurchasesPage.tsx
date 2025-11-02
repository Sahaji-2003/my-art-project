import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/order';
import ProfileSidebar from '../components/ProfileSidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/App.css';

const MyPurchasesPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await orderAPI.getUserOrders();
      setOrders(response.data || []);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError('Failed to load your purchases. Please try again.');
      setOrders([]);
    } finally {
      setLoading(false);
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
                <div className="alert alert-danger d-flex align-items-center gap-2">
                  <i className="bi bi-exclamation-triangle"></i>
                  {error}
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
                            <div>{(order.artworkId || order.artwork)?.artistId?.name || order.artistId?.name}</div>
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
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => navigate(`/orders/${order._id}`)}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
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
    </div>
  );
};

export default MyPurchasesPage;


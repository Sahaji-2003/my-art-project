// ============================================
// src/pages/PurchasePage.tsx
// ============================================
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { artworkAPI, type Artwork } from '../services/artwork';
import { orderAPI } from '../services/order';
import { reviewAPI } from '../services/api.service';
import { getUser } from '../services/api.service';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/App.css';

interface Review {
  _id: string;
  rating: number;
  comment: string;
  user: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  createdAt: string;
}

const PurchasePage: React.FC = () => {
  const { artworkId } = useParams<{ artworkId: string }>();
  const navigate = useNavigate();
  const currentUser = getUser();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [orderData, setOrderData] = useState({
    fullName: currentUser?.name || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    email: currentUser?.email || '',
    phone: ''
  });
  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'credit_card',
    cardNumber: '',
    expirationDate: '',
    cvc: '',
    savePayment: false
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (artworkId) {
      fetchArtwork();
      fetchReviews();
    }
  }, [artworkId]);

  const fetchArtwork = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await artworkAPI.getArtwork(artworkId!);
      setArtwork(response.data);
    } catch (err: any) {
      console.error('Error fetching artwork:', err);
      setError('Failed to load artwork details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      if (artworkId) {
        const response = await reviewAPI.getArtworkReviews(artworkId);
        setReviews(response.data || []);
      }
    } catch (err: any) {
      console.error('Error fetching reviews:', err);
      // Don't show error for reviews, just set empty array
      setReviews([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'radio') {
      setPaymentData(prev => ({
        ...prev,
        paymentMethod: value
      }));
    } else {
    setPaymentData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    }
  };

  const handlePlaceOrder = async () => {
    if (!artwork || !artworkId) return;

    // Validate required fields
    if (!orderData.fullName || !orderData.address || !orderData.city || !orderData.state || !orderData.zipCode) {
      setError('Please fill in all required shipping information.');
      return;
    }

    if (!paymentData.paymentMethod) {
      setError('Please select a payment method.');
      return;
    }

    setSubmitting(true);
    setError('');
    
    try {
      const orderPayload = {
        artworkId: artworkId,
        shippingAddress: {
          street: orderData.address,
          city: orderData.city,
          state: orderData.state,
          zipCode: orderData.zipCode,
          country: 'USA' // Default or make it a field
        },
        paymentMethod: paymentData.paymentMethod,
        notes: `Phone: ${orderData.phone || 'N/A'}`
      };

      const response = await orderAPI.createOrder(orderPayload);
      
      if (response.success) {
      alert('Order placed successfully! You will receive a confirmation email shortly.');
      navigate('/dashboard');
      } else {
        setError('Failed to place order. Please try again.');
      }
    } catch (err: any) {
      console.error('Error placing order:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="purchase-page">
        <div className="purchase-container">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading artwork details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="purchase-page">
        <div className="purchase-container">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>Artwork Not Found</h3>
            <p>{error || 'The artwork you are looking for does not exist.'}</p>
            <button 
              className="btn-primary" 
              onClick={() => navigate('/search')}
            >
              Browse Artworks
            </button>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = artwork.price;
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  return (
    <div className="purchase-page bg-light min-vh-100 py-4">
      <div className="purchase-container container">
        <h1 className="page-title display-4 fw-bold mb-4 text-center">Purchase Artwork</h1>
        
        {error && (
          <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Close"></button>
          </div>
        )}
        
        <div className="purchase-content row g-4">
          {/* Left Column - Order Summary & Shipping */}
          <div className="left-column col-lg-6">
            {/* Order Summary */}
            <div className="order-summary bg-white rounded-4 shadow-sm p-4 mb-4">
              <h2 className="fw-bold mb-3 pb-2 border-bottom">Order Summary</h2>
              <div className="artwork-item d-flex gap-3 p-3 bg-light rounded mb-3">
                <img 
                  src={artwork.images?.[0]?.url || 'https://via.placeholder.com/100x100/CCCCCC/FFFFFF?text=No+Image'} 
                  alt={artwork.title}
                  className="artwork-thumbnail rounded"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
                <div className="artwork-details flex-grow-1">
                  <h3 className="fw-semibold mb-1">{artwork.title}</h3>
                  <p className="artist-name text-muted small mb-2">{artwork.artist?.name || 'Unknown Artist'}</p>
                  <p className="artwork-price text-primary fw-bold fs-5 mb-0">${artwork.price?.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="pricing-breakdown">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span className="fw-semibold">${subtotal.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Shipping</span>
                  <span className="fw-semibold">${shipping.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <span className="fw-bold">Total</span>
                  <span className="fw-bold text-primary fs-5">${total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="shipping-info bg-white rounded-4 shadow-sm p-4">
              <h2 className="fw-bold mb-3 pb-2 border-bottom">Shipping Information</h2>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label fw-semibold">Full Name <span className="text-danger">*</span></label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="form-control"
                  value={orderData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={orderData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="form-label fw-semibold">Street Address <span className="text-danger">*</span></label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className="form-control"
                  value={orderData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="city" className="form-label fw-semibold">City <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className="form-control"
                    value={orderData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="state" className="form-label fw-semibold">State <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    className="form-control"
                    value={orderData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor="zipCode" className="form-label fw-semibold">Zip Code <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    className="form-control"
                    value={orderData.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-3 mt-3">
                <label htmlFor="phone" className="form-label fw-semibold">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-control"
                  value={orderData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Artwork Display & Reviews */}
          <div className="right-column col-lg-6">
            {/* Artwork Display */}
            <div className="artwork-display bg-white rounded-4 shadow-sm p-4 mb-4">
              <img 
                src={artwork.images?.[0]?.url || 'https://via.placeholder.com/400x400/CCCCCC/FFFFFF?text=No+Image'} 
                alt={artwork.title}
                className="artwork-image img-fluid rounded-3 mb-3 shadow-sm"
                style={{ maxHeight: '400px', width: '100%', objectFit: 'contain' }}
              />
              <h2 className="artwork-title fw-bold mb-2">{artwork.title}</h2>
              <p className="artist-name text-muted mb-3">
                <i className="bi bi-person-circle me-2"></i>
                by {artwork.artist?.name || 'Unknown Artist'}
              </p>
              <div className="artwork-description mb-3">
                <p className="text-muted">{artwork.description}</p>
                <div className="artwork-meta d-flex gap-2 flex-wrap mt-3">
                  <span className="badge bg-primary">{artwork.medium}</span>
                  <span className="badge bg-secondary">{artwork.style}</span>
                  {artwork.tags && artwork.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="badge bg-info">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="customer-reviews bg-white rounded-4 shadow-sm p-4">
              <h2 className="fw-bold mb-3 pb-2 border-bottom">Customer Reviews</h2>
              {reviews.length > 0 ? (
              <div className="reviews-list">
                  {reviews.map((review) => (
                    <div key={review._id} className="review-item mb-3 p-3 bg-light rounded shadow-sm">
                      <div className="review-rating mb-2">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                  <div className="review-content">
                        <div className="reviewer-info d-flex align-items-center gap-2 mb-2">
                          <img 
                            src={review.user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user.name)}&background=4A90E2&color=fff`}
                            alt={review.user.name}
                            className="reviewer-avatar rounded-circle"
                            style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                          />
                          <span className="reviewer-name fw-semibold">{review.user.name}</span>
                          <span className="text-muted small ms-auto">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                    </div>
                        {review.comment && (
                          <p className="review-text mb-0 text-muted">{review.comment}</p>
                        )}
                </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="alert alert-info text-center py-4">
                  <i className="bi bi-info-circle me-2"></i>
                  No reviews yet. Be the first to review this artwork!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Method & Place Order */}
        <div className="payment-section row g-4 mt-2">
          <div className="payment-method col-lg-8 bg-white rounded-4 shadow-sm p-4">
            <h2 className="fw-bold mb-3 pb-2 border-bottom">Payment Method</h2>
            <div className="payment-options mb-3">
              <div className="form-check mb-2">
                <input 
                  className="form-check-input" 
                  type="radio" 
                  name="paymentMethod" 
                  id="creditCard"
                  value="credit_card" 
                  checked={paymentData.paymentMethod === 'credit_card'}
                  onChange={handlePaymentChange}
                />
                <label className="form-check-label d-flex align-items-center gap-2" htmlFor="creditCard">
                  <i className="bi bi-credit-card-2-front"></i>
                <span>Credit Card</span>
              </label>
              </div>
              <div className="form-check mb-2">
                <input 
                  className="form-check-input" 
                  type="radio" 
                  name="paymentMethod" 
                  id="paypal"
                  value="paypal"
                  checked={paymentData.paymentMethod === 'paypal'}
                  onChange={handlePaymentChange}
                />
                <label className="form-check-label d-flex align-items-center gap-2" htmlFor="paypal">
                  <i className="bi bi-paypal"></i>
                  <span>PayPal</span>
                </label>
              </div>
              <div className="form-check mb-2">
                <input 
                  className="form-check-input" 
                  type="radio" 
                  name="paymentMethod" 
                  id="bankTransfer"
                  value="bank_transfer"
                  checked={paymentData.paymentMethod === 'bank_transfer'}
                  onChange={handlePaymentChange}
                />
                <label className="form-check-label d-flex align-items-center gap-2" htmlFor="bankTransfer">
                  <i className="bi bi-bank"></i>
                  <span>Bank Transfer</span>
                </label>
              </div>
            </div>
            
            {paymentData.paymentMethod === 'credit_card' && (
            <div className="card-details">
                <div className="mb-3">
                  <label htmlFor="cardNumber" className="form-label fw-semibold">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                    className="form-control"
                  value={paymentData.cardNumber}
                  onChange={handlePaymentChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                />
              </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="expirationDate" className="form-label fw-semibold">Expiration Date</label>
                  <input
                    type="text"
                    id="expirationDate"
                    name="expirationDate"
                      className="form-control"
                    value={paymentData.expirationDate}
                    onChange={handlePaymentChange}
                    placeholder="MM/YY"
                      maxLength={5}
                  />
                </div>
                  <div className="col-md-6">
                    <label htmlFor="cvc" className="form-label fw-semibold">CVC</label>
                  <input
                    type="text"
                    id="cvc"
                    name="cvc"
                      className="form-control"
                    value={paymentData.cvc}
                    onChange={handlePaymentChange}
                      placeholder="123"
                      maxLength={4}
                  />
                </div>
              </div>
                <div className="form-check mt-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="savePayment"
                    name="savePayment"
                    checked={paymentData.savePayment}
                    onChange={handlePaymentChange}
                  />
                  <label className="form-check-label" htmlFor="savePayment">
                  Save payment information for future purchases
                </label>
              </div>
            </div>
            )}
          </div>

          <div className="order-total col-lg-4 bg-white rounded-4 shadow-sm p-4">
            <h3 className="fw-bold mb-3 pb-2 border-bottom">Order Total</h3>
            <div className="total-breakdown mb-3">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span className="fw-semibold">${subtotal.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Shipping</span>
                <span className="fw-semibold">${shipping.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <span className="fw-bold fs-5">Total</span>
                <span className="fw-bold fs-5 text-primary">${total.toLocaleString()}</span>
              </div>
            </div>
            <button 
              className="btn btn-primary btn-lg w-100 rounded-pill shadow-sm fw-semibold"
              onClick={handlePlaceOrder}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : (
                <>
                  <i className="bi bi-cart-check me-2"></i>
                  Place Order
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasePage;

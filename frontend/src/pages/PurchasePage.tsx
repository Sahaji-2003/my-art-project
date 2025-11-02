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
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'radio') {
      setPaymentData(prev => ({
        ...prev,
        paymentMethod: value
      }));
    } else {
      let formattedValue = value;
      
      // Format card number with dashes
      if (name === 'cardNumber') {
        const cleaned = value.replace(/\D/g, ''); // Remove non-digits
        formattedValue = cleaned.match(/.{1,4}/g)?.join('-') || cleaned;
      }
      
      // Format expiration date with slash
      if (name === 'expirationDate') {
        const cleaned = value.replace(/\D/g, ''); // Remove non-digits
        if (cleaned.length >= 2) {
          formattedValue = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
        } else {
          formattedValue = cleaned;
        }
      }
      
      setPaymentData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : formattedValue
      }));
    }
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePlaceOrder = async () => {
    if (!artwork || !artworkId) return;

    // Clear previous errors
    setValidationErrors({});
    setError('');

    // Validate required fields
    const errors: {[key: string]: string} = {};

    if (!orderData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    if (!orderData.address.trim()) {
      errors.address = 'Address is required';
    }
    if (!orderData.city.trim()) {
      errors.city = 'City is required';
    }
    if (!orderData.state.trim()) {
      errors.state = 'State is required';
    }
    if (!orderData.zipCode.trim()) {
      errors.zipCode = 'Zip code is required';
    }

    // Validate card details if credit card is selected
    if (paymentData.paymentMethod === 'credit_card') {
      const cardNumberDigits = paymentData.cardNumber.replace(/[^0-9]/g, '');
      if (!cardNumberDigits || cardNumberDigits.length < 13) {
        errors.cardNumber = 'Please enter a valid card number';
      }
      if (!paymentData.expirationDate || paymentData.expirationDate.length < 5) {
        errors.expirationDate = 'Expiration date is required';
      }
      if (!paymentData.cvc || paymentData.cvc.length < 3) {
        errors.cvc = 'Please enter a valid CVC';
      }
    }

    // If there are validation errors, set them and return
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setSubmitting(true);
    
    try {
      const orderPayload = {
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

      const response = await orderAPI.createOrder(artworkId!, orderPayload);
      
      if (response.success) {
        setShowSuccessModal(true);
      } else {
        setError('Failed to place order. Please try again.');
      }
    } catch (err: any) {
      console.error('Error placing order:', err);
      setError(err.response?.data?.message || err.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-light min-vh-100 py-4">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading artwork details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!artwork && !loading) {
    return (
      <div className="bg-light min-vh-100 py-4">
        <div className="container">
          <div className="text-center py-5">
            <div className="mb-4">
              <i className="bi bi-exclamation-triangle display-1 text-warning"></i>
            </div>
            <h3 className="fw-bold mb-3">Artwork Not Found</h3>
            <p className="text-muted mb-4">The artwork you are looking for does not exist.</p>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/search')}
            >
              Browse Artworks
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return null;
  }

  const subtotal = artwork.price;
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  return (
    <div className="bg-light min-vh-100 py-4">
      <div className="container">
        {error && (
          <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Close"></button>
          </div>
        )}
        
        <div className="row g-4">
          {/* Left Column - Order Summary, Shipping, Payment, Review */}
          <div className="col-lg-6">
            {/* Order Summary */}
            <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
              <h2 className="fw-bold mb-3 pb-2 border-bottom">Order Summary</h2>
              <div className="d-flex gap-3 p-3 bg-light rounded mb-3">
                <img 
                  src={artwork.images?.[0]?.url || 'https://via.placeholder.com/100x100/CCCCCC/FFFFFF?text=No+Image'} 
                  alt={artwork.title}
                  className="rounded"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
                <div className="flex-grow-1">
                  <h3 className="fw-semibold mb-1">{artwork.title}</h3>
                  <p className="text-muted small mb-2">
                    {artwork.artist?._id ? (
                      <a 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/artist/${artwork.artist._id}`);
                        }}
                        className="text-decoration-none"
                      >
                        {artwork.artist.name}
                      </a>
                    ) : (
                      <span>{artwork.artist?.name || 'Unknown Artist'}</span>
                    )}
                  </p>
                  <p className="text-primary fw-bold fs-5 mb-0">${artwork.price?.toLocaleString()}</p>
                </div>
              </div>
              
              <div>
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
              <div className="mt-3">
                <a href="#" className="text-primary text-decoration-none" onClick={(e) => e.preventDefault()}>
                  Edit Order
                </a>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
              <h2 className="fw-bold mb-3 pb-2 border-bottom">Shipping Information</h2>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label fw-semibold">Full Name <span className="text-danger">*</span></label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className={`form-control ${validationErrors.fullName ? 'is-invalid' : ''}`}
                  value={orderData.fullName}
                  onChange={handleInputChange}
                  required
                />
                {validationErrors.fullName && <div className="invalid-feedback">{validationErrors.fullName}</div>}
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
                <label htmlFor="address" className="form-label fw-semibold">Address <span className="text-danger">*</span></label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className={`form-control ${validationErrors.address ? 'is-invalid' : ''}`}
                  value={orderData.address}
                  onChange={handleInputChange}
                  required
                />
                {validationErrors.address && <div className="invalid-feedback">{validationErrors.address}</div>}
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="city" className="form-label fw-semibold">City <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className={`form-control ${validationErrors.city ? 'is-invalid' : ''}`}
                    value={orderData.city}
                    onChange={handleInputChange}
                    required
                  />
                  {validationErrors.city && <div className="invalid-feedback">{validationErrors.city}</div>}
                </div>
                <div className="col-md-3">
                  <label htmlFor="state" className="form-label fw-semibold">State <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    className={`form-control ${validationErrors.state ? 'is-invalid' : ''}`}
                    value={orderData.state}
                    onChange={handleInputChange}
                    required
                  />
                  {validationErrors.state && <div className="invalid-feedback">{validationErrors.state}</div>}
                </div>
                <div className="col-md-3">
                  <label htmlFor="zipCode" className="form-label fw-semibold">Zip Code <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    className={`form-control ${validationErrors.zipCode ? 'is-invalid' : ''}`}
                    value={orderData.zipCode}
                    onChange={handleInputChange}
                    required
                  />
                  {validationErrors.zipCode && <div className="invalid-feedback">{validationErrors.zipCode}</div>}
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

            {/* Payment Method */}
            <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
              <h2 className="fw-bold mb-3 pb-2 border-bottom">Payment Method</h2>
              <div className="mb-3">
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="paymentMethod" 
                    id="creditCard"
                    value="credit_card" 
                    checked={paymentData.paymentMethod === 'credit_card'}
                    onChange={handlePaymentChange}
                  />
                  <label className="form-check-label" htmlFor="creditCard">
                    <i className="bi bi-credit-card-2-front me-2"></i>
                    Credit Card
                  </label>
                </div>
              </div>
              
              {paymentData.paymentMethod === 'credit_card' && (
                <div>
                  <div className="mb-3">
                    <label htmlFor="cardNumber" className="form-label fw-semibold">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      className={`form-control ${validationErrors.cardNumber ? 'is-invalid' : ''}`}
                      value={paymentData.cardNumber}
                      onChange={handlePaymentChange}
                      placeholder="**** **** **** 1234"
                    />
                    {validationErrors.cardNumber && <div className="invalid-feedback">{validationErrors.cardNumber}</div>}
                  </div>
                  <div className="row g-3">
                    <div className="col-6">
                      <label htmlFor="expirationDate" className="form-label fw-semibold">Expiration Date</label>
                      <input
                        type="text"
                        id="expirationDate"
                        name="expirationDate"
                        className={`form-control ${validationErrors.expirationDate ? 'is-invalid' : ''}`}
                        value={paymentData.expirationDate}
                        onChange={handlePaymentChange}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                      {validationErrors.expirationDate && <div className="invalid-feedback">{validationErrors.expirationDate}</div>}
                    </div>
                    <div className="col-6">
                      <label htmlFor="cvc" className="form-label fw-semibold">CVC</label>
                      <input
                        type="text"
                        id="cvc"
                        name="cvc"
                        className={`form-control ${validationErrors.cvc ? 'is-invalid' : ''}`}
                        value={paymentData.cvc}
                        onChange={handlePaymentChange}
                        placeholder="***"
                        maxLength={4}
                      />
                      {validationErrors.cvc && <div className="invalid-feedback">{validationErrors.cvc}</div>}
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

            {/* Review Your Order */}
            <div className="bg-white rounded-4 shadow-sm p-4">
              <h2 className="fw-bold mb-3 pb-2 border-bottom">Review Your Order</h2>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span className="fw-semibold">${subtotal.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span className="fw-semibold">${shipping.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <span className="fw-bold">Order Total</span>
                  <span className="fw-bold text-primary fs-5">${total.toLocaleString()}</span>
                </div>
              </div>
              <button 
                className="btn btn-primary w-100 fw-semibold"
                onClick={handlePlaceOrder}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Artwork Display & Reviews */}
          <div className="col-lg-6">
            {/* Artwork Display */}
            <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
              <img 
                src={artwork.images?.[0]?.url || 'https://via.placeholder.com/400x400/CCCCCC/FFFFFF?text=No+Image'} 
                alt={artwork.title}
                className="img-fluid rounded-3 mb-3 w-100"
              />
              <h2 className="fw-bold mb-2">{artwork.title}</h2>
              <p className="text-muted mb-3">
                <i className="bi bi-person-circle me-2"></i>
                by{' '}
                {artwork.artist?._id ? (
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/artist/${artwork.artist._id}`);
                    }}
                    className="text-decoration-none fw-semibold"
                  >
                    {artwork.artist.name}
                  </a>
                ) : (
                  <span className="fw-semibold">{artwork.artist?.name || 'Unknown Artist'}</span>
                )}
              </p>
              <div className="mb-3">
                <p className="text-muted">{artwork.description}</p>
                <div className="d-flex gap-2 flex-wrap mt-3">
                  <span className="badge bg-primary">{artwork.medium}</span>
                  <span className="badge bg-secondary">{artwork.style}</span>
                  {artwork.tags && artwork.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="badge bg-info">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="bg-white rounded-4 shadow-sm p-4">
              <h2 className="fw-bold mb-3 pb-2 border-bottom">Customer Reviews</h2>
              {reviews.length > 0 ? (
                <div>
                  {reviews.map((review) => (
                    <div key={review._id} className="mb-4">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <img 
                          src={review.user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user.name)}&background=4A90E2&color=fff`}
                          alt={review.user.name}
                          className="rounded-circle"
                          style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                        />
                        <div className="flex-grow-1">
                          <div className="text-warning mb-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <i key={i} className={`bi ${i < review.rating ? 'bi-star-fill' : 'bi-star'}`}></i>
                            ))}
                          </div>
                          <span className="fw-semibold">{review.user.name}</span>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-muted mb-0">{review.comment}</p>
                      )}
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
      </div>

      {/* Success Modal */}
      <div className={`modal fade ${showSuccessModal ? 'show' : ''}`} style={{ display: showSuccessModal ? 'block' : 'none' }} tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center py-5">
              <div className="mb-3">
                <i className="bi bi-check-circle-fill text-success display-2"></i>
              </div>
              <h3 className="fw-bold mb-3">Order Placed Successfully!</h3>
              <p className="text-muted mb-4">You will receive a confirmation email shortly.</p>
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/my-purchases')}
              >
                View My Orders
              </button>
            </div>
          </div>
        </div>
      </div>
      {showSuccessModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default PurchasePage;

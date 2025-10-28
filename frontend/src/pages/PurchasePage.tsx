// ============================================
// src/pages/PurchasePage.tsx
// ============================================
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { artworkAPI, type Artwork } from '../services/artwork';
import '../styles/App.css';

const PurchasePage: React.FC = () => {
  const { artworkId } = useParams<{ artworkId: string }>();
  const navigate = useNavigate();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [orderData, setOrderData] = useState({
    fullName: 'John Doe',
    address: '123 Art St',
    city: 'Artville',
    state: 'CA',
    zipCode: '90210',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567'
  });
  const [paymentData, setPaymentData] = useState({
    cardNumber: '**** **** **** 1234',
    expirationDate: '12/26',
    cvc: '***',
    savePayment: false
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (artworkId) {
      fetchArtwork();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePlaceOrder = async () => {
    if (!artwork) return;

    setSubmitting(true);
    try {
      // Here you would integrate with your order service
      // For now, we'll simulate the order process
      console.log('Placing order for artwork:', artwork._id);
      console.log('Order data:', orderData);
      console.log('Payment data:', paymentData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Order placed successfully! You will receive a confirmation email shortly.');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Error placing order:', err);
      alert('Failed to place order. Please try again.');
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
    <div className="purchase-page">
      <div className="purchase-container">
        <h1 className="page-title">Purchase Artwork</h1>
        
        <div className="purchase-content">
          {/* Left Column - Order Summary & Shipping */}
          <div className="left-column">
            {/* Order Summary */}
            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="artwork-item">
                <img 
                  src={artwork.images?.[0]?.url || 'https://via.placeholder.com/100x100/CCCCCC/FFFFFF?text=No+Image'} 
                  alt={artwork.title}
                  className="artwork-thumbnail"
                />
                <div className="artwork-details">
                  <h3>{artwork.title}</h3>
                  <p className="artist-name">{artwork.artist?.name || 'Unknown Artist'}</p>
                  <p className="artwork-price">${artwork.price?.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="pricing-breakdown">
                <div className="price-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="price-row">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="price-row total">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>
              
              <a href="#" className="edit-order-link">Edit Order</a>
            </div>

            {/* Shipping Information */}
            <div className="shipping-info">
              <h2>Shipping Information</h2>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={orderData.fullName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={orderData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={orderData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={orderData.state}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="zipCode">Zip Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={orderData.zipCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Artwork Display & Reviews */}
          <div className="right-column">
            {/* Artwork Display */}
            <div className="artwork-display">
              <img 
                src={artwork.images?.[0]?.url || 'https://via.placeholder.com/400x400/CCCCCC/FFFFFF?text=No+Image'} 
                alt={artwork.title}
                className="artwork-image"
              />
              <h2 className="artwork-title">{artwork.title}</h2>
              <p className="artist-name">{artwork.artist?.name || 'Unknown Artist'}</p>
              <div className="artwork-description">
                <p>{artwork.description}</p>
                <div className="artwork-meta">
                  <span className="medium-tag">{artwork.medium}</span>
                  <span className="style-tag">{artwork.style}</span>
                </div>
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="customer-reviews">
              <h2>Customer Reviews</h2>
              <div className="reviews-list">
                <div className="review-item">
                  <div className="review-rating">★★★★★</div>
                  <div className="review-content">
                    <div className="reviewer-info">
                      <img 
                        src="https://via.placeholder.com/32x32/4A90E2/FFFFFF?text=GE" 
                        alt="Gallery Enthusiast"
                        className="reviewer-avatar"
                      />
                      <span className="reviewer-name">Gallery Enthusiast</span>
                    </div>
                    <p className="review-text">
                      Absolutely stunning in person! The colors are even more vibrant than online. 
                      A true centerpiece for my living room.
                    </p>
                  </div>
                </div>

                <div className="review-item">
                  <div className="review-rating">★★★★☆</div>
                  <div className="review-content">
                    <div className="reviewer-info">
                      <img 
                        src="https://via.placeholder.com/32x32/4A90E2/FFFFFF?text=AC" 
                        alt="Art Collector Jane"
                        className="reviewer-avatar"
                      />
                      <span className="reviewer-name">Art Collector Jane</span>
                    </div>
                    <p className="review-text">
                      A beautiful abstract piece. It arrived well-packaged and earlier than expected. 
                      Minor detail: wished the frame was slightly different, but the art itself is fantastic.
                    </p>
                  </div>
                </div>

                <div className="review-item">
                  <div className="review-rating">★★★★★</div>
                  <div className="review-content">
                    <div className="reviewer-info">
                      <img 
                        src="https://via.placeholder.com/32x32/4A90E2/FFFFFF?text=NB" 
                        alt="New Buyer Mark"
                        className="reviewer-avatar"
                      />
                      <span className="reviewer-name">New Buyer Mark</span>
                    </div>
                    <p className="review-text">
                      First purchase from Arthub and I'm thrilled! 'Ocean's Embrace' transformed my space. 
                      The quality is exceptional.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method & Place Order */}
        <div className="payment-section">
          <div className="payment-method">
            <h2>Payment Method</h2>
            <div className="payment-options">
              <label className="payment-option">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="creditCard" 
                  defaultChecked 
                />
                <span className="payment-icon">💳</span>
                <span>Credit Card</span>
              </label>
            </div>
            
            <div className="card-details">
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={paymentData.cardNumber}
                  onChange={handlePaymentChange}
                  placeholder="**** **** **** 1234"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expirationDate">Expiration Date</label>
                  <input
                    type="text"
                    id="expirationDate"
                    name="expirationDate"
                    value={paymentData.expirationDate}
                    onChange={handlePaymentChange}
                    placeholder="MM/YY"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cvc">CVC</label>
                  <input
                    type="text"
                    id="cvc"
                    name="cvc"
                    value={paymentData.cvc}
                    onChange={handlePaymentChange}
                    placeholder="***"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="savePayment"
                    checked={paymentData.savePayment}
                    onChange={handlePaymentChange}
                  />
                  Save payment information for future purchases
                </label>
              </div>
            </div>
          </div>

          <div className="order-total">
            <div className="total-breakdown">
              <div className="price-row">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="price-row">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="price-row total">
                <span>Order Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>
            <button 
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={submitting}
            >
              {submitting ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasePage;

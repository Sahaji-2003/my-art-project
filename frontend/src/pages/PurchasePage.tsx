// ============================================
// src/pages/PurchasePage.tsx
// ============================================
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { artworkAPI, type Artwork } from '../services/artwork';
import 'bootstrap/dist/css/bootstrap.min.css';
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
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-12 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading artwork details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="container-fluid py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="fs-1 mb-3">⚠️</div>
            <h3 className="h4 text-muted">Artwork Not Found</h3>
            <p className="text-muted mb-4">{error || 'The artwork you are looking for does not exist.'}</p>
            <button 
              className="btn btn-primary" 
              onClick={() => navigate('/search')}
            >
              <i className="bi bi-search me-1"></i>
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
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          <h1 className="display-4 text-primary mb-4">Purchase Artwork</h1>
        </div>
      </div>
      
      <div className="row">
        {/* Left Column - Order Summary & Shipping */}
        <div className="col-lg-4 mb-4">
          {/* Order Summary */}
          <div className="card mb-4">
            <div className="card-header">
              <h2 className="h5 mb-0 text-primary">Order Summary</h2>
            </div>
            <div className="card-body">
              <div className="d-flex mb-3">
                <img 
                  src={artwork.images?.[0]?.url || 'https://via.placeholder.com/100x100/CCCCCC/FFFFFF?text=No+Image'} 
                  alt={artwork.title}
                  className="img-thumbnail me-3"
                  style={{width: '80px', height: '80px', objectFit: 'cover'}}
                />
                <div className="flex-grow-1">
                  <h5 className="mb-1">{artwork.title}</h5>
                  <p className="text-muted small mb-1">{artwork.artist?.name || 'Unknown Artist'}</p>
                  <p className="h6 text-primary mb-0">${artwork.price?.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="border-top pt-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold border-top pt-2">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>
              
              <a href="#" className="btn btn-outline-primary btn-sm mt-3 w-100">Edit Order</a>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="card">
            <div className="card-header">
              <h2 className="h5 mb-0 text-primary">Shipping Information</h2>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="fullName"
                  name="fullName"
                  value={orderData.fullName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="address" className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  name="address"
                  value={orderData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="row g-3">
                <div className="col-md-4">
                  <label htmlFor="city" className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    name="city"
                    value={orderData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="state" className="form-label">State</label>
                  <input
                    type="text"
                    className="form-control"
                    id="state"
                    name="state"
                    value={orderData.state}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="zipCode" className="form-label">Zip Code</label>
                  <input
                    type="text"
                    className="form-control"
                    id="zipCode"
                    name="zipCode"
                    value={orderData.zipCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Artwork Display & Reviews */}
        <div className="col-lg-8">
          {/* Artwork Display */}
          <div className="card mb-4">
            <div className="card-body">
              <img 
                src={artwork.images?.[0]?.url || 'https://via.placeholder.com/400x400/CCCCCC/FFFFFF?text=No+Image'} 
                alt={artwork.title}
                className="img-fluid rounded mb-3"
                style={{width: '100%', height: '400px', objectFit: 'cover'}}
              />
              <h2 className="h4 mb-2">{artwork.title}</h2>
              <p className="text-muted mb-3">{artwork.artist?.name || 'Unknown Artist'}</p>
              <div className="mb-3">
                <p className="text-muted">{artwork.description}</p>
                <div className="d-flex gap-2">
                  <span className="badge bg-primary">{artwork.medium}</span>
                  <span className="badge bg-secondary">{artwork.style}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Reviews */}
          <div className="card">
            <div className="card-header">
              <h2 className="h5 mb-0 text-primary">Customer Reviews</h2>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12">
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <div className="text-warning mb-2">★★★★★</div>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-2">
                        <img 
                          src="https://via.placeholder.com/32x32/4A90E2/FFFFFF?text=GE" 
                          alt="Gallery Enthusiast"
                          className="rounded-circle me-2"
                          style={{width: '32px', height: '32px'}}
                        />
                        <span className="fw-medium">Gallery Enthusiast</span>
                      </div>
                      <p className="text-muted mb-0">
                        Absolutely stunning in person! The colors are even more vibrant than online. 
                        A true centerpiece for my living room.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <div className="text-warning mb-2">★★★★☆</div>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-2">
                        <img 
                          src="https://via.placeholder.com/32x32/4A90E2/FFFFFF?text=AC" 
                          alt="Art Collector Jane"
                          className="rounded-circle me-2"
                          style={{width: '32px', height: '32px'}}
                        />
                        <span className="fw-medium">Art Collector Jane</span>
                      </div>
                      <p className="text-muted mb-0">
                        A beautiful abstract piece. It arrived well-packaged and earlier than expected. 
                        Minor detail: wished the frame was slightly different, but the art itself is fantastic.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <div className="text-warning mb-2">★★★★★</div>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center mb-2">
                        <img 
                          src="https://via.placeholder.com/32x32/4A90E2/FFFFFF?text=NB" 
                          alt="New Buyer Mark"
                          className="rounded-circle me-2"
                          style={{width: '32px', height: '32px'}}
                        />
                        <span className="fw-medium">New Buyer Mark</span>
                      </div>
                      <p className="text-muted mb-0">
                        First purchase from Arthub and I'm thrilled! 'Ocean's Embrace' transformed my space. 
                        The quality is exceptional.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method & Place Order */}
      <div className="row mt-4">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header">
              <h2 className="h5 mb-0 text-primary">Payment Method</h2>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="form-check">
                  <input 
                    className="form-check-input" 
                    type="radio" 
                    name="paymentMethod" 
                    id="creditCard"
                    value="creditCard" 
                    defaultChecked 
                  />
                  <label className="form-check-label d-flex align-items-center" htmlFor="creditCard">
                    <span className="fs-4 me-2">💳</span>
                    <span>Credit Card</span>
                  </label>
                </div>
              </div>
              
              <div className="row g-3">
                <div className="col-12">
                  <label htmlFor="cardNumber" className="form-label">Card Number</label>
                  <input
                    type="text"
                    className="form-control"
                    id="cardNumber"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handlePaymentChange}
                    placeholder="**** **** **** 1234"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="expirationDate" className="form-label">Expiration Date</label>
                  <input
                    type="text"
                    className="form-control"
                    id="expirationDate"
                    name="expirationDate"
                    value={paymentData.expirationDate}
                    onChange={handlePaymentChange}
                    placeholder="MM/YY"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="cvc" className="form-label">CVC</label>
                  <input
                    type="text"
                    className="form-control"
                    id="cvc"
                    name="cvc"
                    value={paymentData.cvc}
                    onChange={handlePaymentChange}
                    placeholder="***"
                  />
                </div>
                <div className="col-12">
                  <div className="form-check">
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
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header">
              <h3 className="h5 mb-0 text-primary">Order Total</h3>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between fw-bold border-top pt-2 mb-3">
                <span>Order Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <button 
                className="btn btn-primary w-100"
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
                    <i className="bi bi-credit-card me-1"></i>
                    Place Order
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasePage;

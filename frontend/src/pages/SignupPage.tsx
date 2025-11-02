import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api.service';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/App.css';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'signup' | 'otp'>('signup');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [otp, setOtp] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; otp?: string; general?: string }>({});

  const validateSignup = () => {
    const newErrors: any = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateSignup();
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Generate OTP (dummy implementation - in production, this would come from backend)
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOTP(otpCode);
      
      // In production, you would call an API to send OTP to email
      // For now, just proceed to OTP step
      setStep('otp');
    } catch (err: any) {
      setErrors({
        general: err.message || 'Registration failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      setErrors({ otp: 'OTP is required' });
      return;
    }

    if (otp !== generatedOTP) {
      setErrors({ otp: 'Invalid OTP' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Now actually sign up the user
      await authAPI.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      // Navigate to login page after successful signup
      navigate('/login');
    } catch (err: any) {
      setErrors({
        general: err.message || 'Registration failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyOTP = () => {
    navigator.clipboard.writeText(generatedOTP);
    alert('OTP copied to clipboard!');
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-7 col-lg-6">
            <div className="bg-white rounded-4 shadow-sm p-4 p-md-5">
              <div className="text-center mb-4">
                <h1 className="h2 fw-bold mb-2">Create Your Account</h1>
                <p className="text-muted">Join our community of artists and art lovers</p>
              </div>

              {errors.general && (
                <div className="alert alert-danger alert-dismissible fade show">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {errors.general}
                  <button type="button" className="btn-close" onClick={() => setErrors({})}></button>
                </div>
              )}

              {/* Step 1: Signup Form */}
              {step === 'signup' && (
                <>
                  <form onSubmit={handleSignupSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label fw-semibold">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={loading}
                        autoComplete="name"
                        placeholder="John Doe"
                      />
                      {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-semibold">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                        autoComplete="email"
                        placeholder="name@example.com"
                      />
                      {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label fw-semibold">Password</label>
                      <div className="position-relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          disabled={loading}
                          autoComplete="new-password"
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted"
                          style={{ transform: 'translateY(-50%)', marginRight: '10px' }}
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loading}
                        >
                          <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                      </div>
                      {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                      <div className="form-text">Must be at least 8 characters long</div>
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-primary w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-plus-fill me-2"></i>
                          Continue
                        </>
                      )}
                    </button>
                  </form>

                  <div className="text-center my-4 position-relative">
                    <hr />
                    <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">or</span>
                  </div>

                  <div className="row g-2">
                    <div className="col-6">
                      <button 
                        type="button" 
                        className="btn btn-outline-dark w-100"
                        onClick={() => alert('Google login - Coming soon!')}
                      >
                        <i className="bi bi-google me-2"></i>
                        Google
                      </button>
                    </div>
                    <div className="col-6">
                      <button 
                        type="button" 
                        className="btn btn-outline-primary w-100"
                        onClick={() => alert('Facebook login - Coming soon!')}
                      >
                        <i className="bi bi-facebook me-2"></i>
                        Facebook
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: OTP Verification */}
              {step === 'otp' && (
                <form onSubmit={handleOTPSubmit}>
                  <div className="alert alert-info">
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <i className="bi bi-info-circle-fill me-2"></i>
                        <strong>Your OTP:</strong> <span className="font-monospace fs-5 fw-bold">{generatedOTP}</span>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={copyOTP}
                      >
                        <i className="bi bi-clipboard me-1"></i>
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="otp" className="form-label fw-semibold">Enter OTP</label>
                    <input
                      type="text"
                      className="form-control text-center font-monospace"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      maxLength={6}
                      disabled={loading}
                    />
                    {errors.otp && <div className="invalid-feedback d-block">{errors.otp}</div>}
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary flex-grow-1"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Verifying...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Verify & Sign Up
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setStep('signup')}
                    >
                      <i className="bi bi-arrow-left"></i>
                    </button>
                  </div>
                </form>
              )}

              <div className="text-center mt-4">
                <span className="text-muted">Already have an account? </span>
                <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                  Log In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

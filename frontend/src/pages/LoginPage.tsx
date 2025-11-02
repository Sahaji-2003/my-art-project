import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginAPI, formValidation } from '../services/login';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/App.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear specific field error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validation = formValidation.validateLoginForm(formData.email, formData.password);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await loginAPI.login(formData);
      
      // Save authentication data
      loginAPI.saveAuthData(response.data.token, response.data.user);

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      setErrors({
        general: err.message || 'Invalid credentials. Please check your email and password.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="bg-white rounded-4 shadow-sm p-4 p-md-5">
              <div className="text-center mb-4">
                <h1 className="h2 fw-bold mb-2">Welcome Back</h1>
                <p className="text-muted">Sign in to your Arthub account</p>
              </div>

              {errors.general && (
                <div className="alert alert-danger alert-dismissible fade show">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {errors.general}
                  <button type="button" className="btn-close" onClick={() => setErrors({})}></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
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
                      autoComplete="current-password"
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
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Sign In
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <span className="text-muted">Don't have an account? </span>
                <Link to="/signup" className="text-primary fw-semibold text-decoration-none">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

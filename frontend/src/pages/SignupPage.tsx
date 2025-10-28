// ============================================
// src/pages/SignupPage.tsx
// ============================================
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginAPI, formValidation } from '../services/login';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.css';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'you@example.com',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; general?: string }>({});

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
    const validation = formValidation.validateSignupForm(formData.name, formData.email, formData.password);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await loginAPI.signup(formData);
      
      // Save authentication data
      loginAPI.saveAuthData(response.data.token, response.data.user);

      // Navigate to dashboard
      navigate('/login');
    } catch (err: any) {
      setErrors({
        general: err.message || 'Registration failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = (provider: string) => {
    // Placeholder for social signup functionality
    console.log(`Sign up with ${provider}`);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <div className="fs-1">🎨</div>
                  </div>
                  <h2 className="fw-bold text-primary">Create Your Arthub Account</h2>
                  <p className="text-muted">Join our community of artists and art lovers</p>
                </div>

                {errors.general && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {errors.general}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={loading}
                      autoComplete="name"
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                      autoComplete="email"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                      autoComplete="new-password"
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing up...
                      </>
                    ) : (
                      'Sign Up'
                    )}
                  </button>
                </form>

                <div className="text-center mb-3">
                  <hr className="my-3" />
                  <span className="text-muted small">OR</span>
                  <hr className="my-3" />
                </div>

                <div className="d-flex justify-content-center gap-3 mb-3">
                  <button 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => handleSocialSignup('Google')}
                    type="button"
                    title="Sign up with Google"
                  >
                    <i className="bi bi-google me-1"></i>
                    Google
                  </button>
                  <button 
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleSocialSignup('Facebook')}
                    type="button"
                    title="Sign up with Facebook"
                  >
                    <i className="bi bi-facebook me-1"></i>
                    Facebook
                  </button>
                  <button 
                    className="btn btn-outline-dark btn-sm"
                    onClick={() => handleSocialSignup('GitHub')}
                    type="button"
                    title="Sign up with GitHub"
                  >
                    <i className="bi bi-github me-1"></i>
                    GitHub
                  </button>
                </div>

                <div className="text-center">
                  <span className="text-muted">Already have an account? </span>
                  <Link to="/login" className="text-primary text-decoration-none fw-medium">Log In</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
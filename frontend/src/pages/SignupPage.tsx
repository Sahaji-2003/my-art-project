// ============================================
// src/pages/SignupPage.tsx
// ============================================
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginAPI, formValidation } from '../services/login';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/App.css';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'you@example.com',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      await loginAPI.signup(formData);
      
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

  const handleSocialSignup = (provider: string) => {
    // Placeholder for social signup functionality
    console.log(`Sign up with ${provider}`);
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <h1>Create Your Arthub Account</h1>
          <p>Join our community of artists and art lovers</p>
        </div>

        {errors.general && (
          <div className="error-message">
            <span>⚠️</span>
            {errors.general}
          </div>
        )}

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              autoComplete="name"
            />
            {errors.name && (
              <div className="field-error">{errors.name}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              autoComplete="email"
            />
            {errors.email && (
              <div className="field-error">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                tabIndex={-1}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
            {errors.password && (
              <div className="field-error">{errors.password}</div>
            )}
          </div>
          <button 
            type="submit" 
            className="btn-signup"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing up...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="social-signup">
          <button 
            className="social-btn"
            onClick={() => handleSocialSignup('Google')}
            type="button"
          >
            <div className="social-icon google-icon">⚙</div>
          </button>
          <button 
            className="social-btn"
            onClick={() => handleSocialSignup('Facebook')}
            type="button"
          >
            <div className="social-icon facebook-icon">f</div>
          </button>
          <button 
            className="social-btn"
            onClick={() => handleSocialSignup('GitHub')}
            type="button"
          >
            <div className="social-icon github-icon">🐙</div>
          </button>
        </div>

        <div className="signup-footer">
          Already have an account?{' '}
          <Link to="/login" className="login-link">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
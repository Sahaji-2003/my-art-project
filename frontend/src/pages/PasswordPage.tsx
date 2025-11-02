import React, { useState } from 'react';
import ProfileSidebar from '../components/ProfileSidebar';
import { authAPI } from '../services/api.service';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/App.css';

const PasswordPage: React.FC = () => {
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.requestPasswordReset(email);
      if (response.success) {
        setGeneratedOTP(response.data.otp);
        setStep('otp');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp.trim()) {
      setError('OTP is required');
      return;
    }

    setStep('password');
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newPassword.trim()) {
      setError('New password is required');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.resetPassword(email, otp, newPassword);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setStep('email');
          setEmail('');
          setOtp('');
          setNewPassword('');
          setConfirmPassword('');
          setGeneratedOTP('');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyOTP = () => {
    navigator.clipboard.writeText(generatedOTP);
    alert('OTP copied to clipboard!');
  };

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
              <div className="mb-4">
                <h2 className="mb-1">Change Password</h2>
                <p className="text-muted mb-0">Reset your account password</p>
              </div>

              {error && (
                <div className="alert alert-danger alert-dismissible fade show mb-3">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
              )}

              {success && (
                <div className="alert alert-success alert-dismissible fade show mb-3">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Password reset successfully!
                  <button type="button" className="btn-close" onClick={() => setSuccess(false)}></button>
                </div>
              )}

              {/* Step 1: Email */}
              {step === 'email' && (
                <form onSubmit={handleEmailSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Enter Your Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      required
                      disabled={loading}
                    />
                    <div className="form-text">
                      We'll send you an OTP to verify your identity
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-envelope-fill me-2"></i>
                        Send OTP
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Step 2: OTP */}
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
                    <label htmlFor="otp" className="form-label fw-semibold">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      className="form-control text-center font-monospace"
                      id="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      maxLength={6}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      Verify OTP
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setStep('email')}
                    >
                      <i className="bi bi-arrow-left me-1"></i>
                      Back
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: New Password */}
              {step === 'password' && (
                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label fw-semibold">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <div className="form-text">Must be at least 8 characters long</div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label fw-semibold">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Resetting...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-shield-check me-2"></i>
                          Reset Password
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setStep('otp')}
                    >
                      <i className="bi bi-arrow-left me-1"></i>
                      Back
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordPage;

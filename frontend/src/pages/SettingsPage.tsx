import React, { useState, useEffect } from 'react';
import ProfileSidebar from '../components/ProfileSidebar';
import { getUser } from '../services/api.service';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/App.css';

const SettingsPage: React.FC = () => {
  const currentUser = getUser();
  const [formData, setFormData] = useState({
    email: currentUser?.email || '',
    notifications: {
      emailNotifications: true,
      orderUpdates: true,
      marketingEmails: false,
      communityUpdates: true
    },
    preferences: {
      currency: 'USD',
      language: 'en',
      theme: 'light'
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setFormData({
      email: currentUser?.email || '',
      notifications: {
        emailNotifications: true,
        orderUpdates: true,
        marketingEmails: false,
        communityUpdates: true
      },
      preferences: {
        currency: 'USD',
        language: 'en',
        theme: 'light'
      }
    });
  }, [currentUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.name.startsWith('notifications.')) {
      const key = e.target.name.split('.')[1];
      setFormData({
        ...formData,
        notifications: {
          ...formData.notifications,
          [key]: (e.target as HTMLInputElement).checked
        }
      });
    } else if (e.target.name.startsWith('preferences.')) {
      const key = e.target.name.split('.')[1];
      setFormData({
        ...formData,
        preferences: {
          ...formData.preferences,
          [key]: e.target.value
        }
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      // Note: You may need to add a settings update endpoint
      // For now, this is a placeholder
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
        setTimeout(() => setSuccess(false), 3000);
      }, 1000);
    } catch (err: any) {
      console.error('Error updating settings:', err);
      setError(err.response?.data?.message || 'Failed to update settings. Please try again.');
      setLoading(false);
    }
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
                <h2 className="mb-1">Settings</h2>
                <p className="text-muted mb-0">Customize your preferences</p>
              </div>

              {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
                  <i className="bi bi-exclamation-triangle"></i>
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
                  <i className="bi bi-check-circle"></i>
                  Settings updated successfully!
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Email Settings */}
                <div className="card mb-4">
                  <div className="card-header bg-white border-bottom">
                    <h5 className="mb-0 d-flex align-items-center gap-2">
                      <i className="bi bi-envelope"></i>
                      Email Notifications
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="emailNotifications"
                        name="notifications.emailNotifications"
                        checked={formData.notifications.emailNotifications}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="emailNotifications">
                        <strong>Enable Email Notifications</strong>
                        <p className="text-muted small mb-0">Receive important updates via email</p>
                      </label>
                    </div>

                    {formData.notifications.emailNotifications && (
                      <div className="ms-4">
                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="orderUpdates"
                            name="notifications.orderUpdates"
                            checked={formData.notifications.orderUpdates}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="orderUpdates">
                            Order Updates
                          </label>
                        </div>

                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="marketingEmails"
                            name="notifications.marketingEmails"
                            checked={formData.notifications.marketingEmails}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="marketingEmails">
                            Marketing Emails
                          </label>
                        </div>

                        <div className="form-check mb-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="communityUpdates"
                            name="notifications.communityUpdates"
                            checked={formData.notifications.communityUpdates}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="communityUpdates">
                            Community Updates
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Preferences */}
                <div className="card mb-4">
                  <div className="card-header bg-white border-bottom">
                    <h5 className="mb-0 d-flex align-items-center gap-2">
                      <i className="bi bi-gear"></i>
                      Preferences
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <label htmlFor="currency" className="form-label fw-semibold">
                          Currency
                        </label>
                        <select
                          className="form-select"
                          id="currency"
                          name="preferences.currency"
                          value={formData.preferences.currency}
                          onChange={handleChange}
                        >
                          <option value="USD">USD ($)</option>
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="INR">INR (₹)</option>
                        </select>
                      </div>

                      <div className="col-md-6">
                        <label htmlFor="language" className="form-label fw-semibold">
                          Language
                        </label>
                        <select
                          className="form-select"
                          id="language"
                          name="preferences.language"
                          value={formData.preferences.language}
                          onChange={handleChange}
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <label htmlFor="theme" className="form-label fw-semibold">
                          Theme
                        </label>
                        <select
                          className="form-select"
                          id="theme"
                          name="preferences.theme"
                          value={formData.preferences.theme}
                          onChange={handleChange}
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="auto">Auto</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
                        Save Settings
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;


// ============================================
// src/pages/ArtistProfilePage.tsx
// ============================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { artistAPI, getUser } from '../services/api.service';
import '../styles/App.css';

const ArtistProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = getUser();

  const [formData, setFormData] = useState({
    artistName: currentUser?.name || '',
    email: currentUser?.email || '',
    bio: '',
    portfolio: '',
    instagram: '',
    twitter: '',
    website: '',
  });

  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [instagramError, setInstagramError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate Instagram URL
    if (name === 'instagram') {
      if (value && !value.includes('instagram.com')) {
        setInstagramError('Please enter a valid Instagram URL.');
      } else {
        setInstagramError('');
      }
    }
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Profile picture must be less than 5MB');
        return;
      }
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError('');
    }
  };

  const handlePortfolioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      if (portfolioFiles.length + fileArray.length > 10) {
        setError('Maximum 10 portfolio images allowed');
        return;
      }
      setPortfolioFiles([...portfolioFiles, ...fileArray]);
      setError('');
    }
  };

  const removePortfolioFile = (index: number) => {
    setPortfolioFiles(portfolioFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.artistName || !formData.email) {
      setError('Artist name and email are required');
      return;
    }

    if (instagramError) {
      setError('Please fix the Instagram URL error');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // In a real app, you'd upload images first and get URLs
      const profileData = {
        bio: formData.bio,
        portfolio: formData.portfolio,
        socialMediaLinks: {
          instagram: formData.instagram,
          twitter: formData.twitter,
          website: formData.website,
        },
        profilePicture: previewUrl, // This would be the uploaded image URL
      };

      await artistAPI.createProfile(profileData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(
        err.response?.data?.error || 
        'Failed to create profile. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <>
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-header-section">
            <h1>Create Your Artist Profile</h1>
            <p>Build your public presence on Arthub. Share your unique story and art with the world.</p>
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <form className="profile-form" onSubmit={handleSubmit}>
            {/* Basic Information */}
            <section className="form-section">
              <h2>Basic Information</h2>
              <p className="section-subtitle">Tell us about yourself.</p>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="artistName">Artist Name</label>
                  <input
                    type="text"
                    id="artistName"
                    name="artistName"
                    placeholder="Your full name"
                    value={formData.artistName}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="artist@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
            </section>

            {/* Profile Picture */}
            <section className="form-section">
              <h2>Profile Picture</h2>
              <p className="section-subtitle">Upload a clear, professional image.</p>
              
              <div className="profile-picture-upload">
                <div className="picture-preview">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Profile preview" />
                  ) : (
                    <div className="placeholder-avatar">
                      <span>👤</span>
                    </div>
                  )}
                </div>
                <div className="upload-info">
                  <label htmlFor="profilePicture" className="btn-upload">
                    Upload New Picture
                  </label>
                  <input
                    type="file"
                    id="profilePicture"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    style={{ display: 'none' }}
                  />
                  <p className="upload-hint">PNG, JPG up to 5MB</p>
                </div>
              </div>
            </section>

            {/* Biography */}
            <section className="form-section">
              <h2>Biography</h2>
              <p className="section-subtitle">Share your artistic journey and inspiration.</p>
              
              <div className="form-group">
                <label htmlFor="bio">Artist Biography</label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={6}
                  placeholder="Describe your artistic style, inspirations, and journey, keeping it engaging for potential buyers and collaborators."
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={loading}
                />
                <p className="field-hint">A detailed bio helps buyers connect with your art and understand your unique perspective.</p>
              </div>
            </section>

            {/* Portfolio Upload */}
            <section className="form-section">
              <h2>Portfolio Upload</h2>
              <p className="section-subtitle">Showcase your best artworks (up to 10 images).</p>
              
              {portfolioFiles.length > 0 && (
                <div className="current-uploads">
                  <h4>Current Uploads</h4>
                  <div className="file-list">
                    {portfolioFiles.map((file, index) => (
                      <div key={index} className="file-item">
                        <span className="file-icon">🖼️</span>
                        <span className="file-name">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removePortfolioFile(index)}
                          className="btn-remove"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="upload-section">
                <h4>Upload New Artwork</h4>
                <label htmlFor="portfolioUpload" className="btn-add-file">
                  <span>📎</span>
                  Add File
                </label>
                <input
                  type="file"
                  id="portfolioUpload"
                  accept="image/*"
                  multiple
                  onChange={handlePortfolioUpload}
                  style={{ display: 'none' }}
                />
              </div>
            </section>

            {/* Social Media & Website */}
            <section className="form-section">
              <h2>Social Media & Website</h2>
              <p className="section-subtitle">Connect your online presence to reach more fans.</p>
              
              <div className="form-group">
                <label htmlFor="instagram">Instagram Profile</label>
                <div className="input-with-icon">
                  <span className="input-icon">📷</span>
                  <input
                    type="text"
                    id="instagram"
                    name="instagram"
                    placeholder="https://instagram.com/yourhandle"
                    value={formData.instagram}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                {instagramError && <p className="field-error">{instagramError}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="twitter">Twitter Profile</label>
                <div className="input-with-icon">
                  <span className="input-icon">🐦</span>
                  <input
                    type="text"
                    id="twitter"
                    name="twitter"
                    placeholder="https://twitter.com/yourhandle"
                    value={formData.twitter}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="website">Personal Website</label>
                <div className="input-with-icon">
                  <span className="input-icon">🌐</span>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    placeholder="https://yourwebsite.com"
                    value={formData.website}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
            </section>

            {/* Form Actions */}
            <div className="form-actions">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Saving...
                  </>
                ) : (
                  'Save Profile'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ArtistProfilePage;
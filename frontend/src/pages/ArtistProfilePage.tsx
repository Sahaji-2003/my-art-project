// ============================================
// src/pages/ArtistProfilePage.tsx
// ============================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { artistAPI, getUser } from '../services/api.service';
import 'bootstrap/dist/css/bootstrap.min.css';
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
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-4">
            <h1 className="display-4 text-primary mb-3">Create Your Artist Profile</h1>
            <p className="lead text-muted">Build your public presence on Arthub. Share your unique story and art with the world.</p>
          </div>

          {error && (
            <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="card mb-4">
              <div className="card-header">
                <h2 className="h5 mb-1 text-primary">Basic Information</h2>
                <p className="text-muted mb-0">Tell us about yourself.</p>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label htmlFor="artistName" className="form-label">Artist Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="artistName"
                      name="artistName"
                      placeholder="Your full name"
                      value={formData.artistName}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="artist@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Picture */}
            <div className="card mb-4">
              <div className="card-header">
                <h2 className="h5 mb-1 text-primary">Profile Picture</h2>
                <p className="text-muted mb-0">Upload a clear, professional image.</p>
              </div>
              <div className="card-body">
                <div className="d-flex align-items-center gap-4">
                  <div className="flex-shrink-0">
                    {previewUrl ? (
                      <img 
                        src={previewUrl} 
                        alt="Profile preview" 
                        className="rounded-circle"
                        style={{width: '100px', height: '100px', objectFit: 'cover'}}
                      />
                    ) : (
                      <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{width: '100px', height: '100px'}}>
                        <span className="fs-1">👤</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-grow-1">
                    <label htmlFor="profilePicture" className="btn btn-outline-primary">
                      <i className="bi bi-upload me-2"></i>
                      Upload New Picture
                    </label>
                    <input
                      type="file"
                      id="profilePicture"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      style={{ display: 'none' }}
                    />
                    <p className="text-muted small mt-2 mb-0">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Biography */}
            <div className="card mb-4">
              <div className="card-header">
                <h2 className="h5 mb-1 text-primary">Biography</h2>
                <p className="text-muted mb-0">Share your artistic journey and inspiration.</p>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="bio" className="form-label">Artist Biography</label>
                  <textarea
                    className="form-control"
                    id="bio"
                    name="bio"
                    rows={6}
                    placeholder="Describe your artistic style, inspirations, and journey, keeping it engaging for potential buyers and collaborators."
                    value={formData.bio}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <p className="form-text">A detailed bio helps buyers connect with your art and understand your unique perspective.</p>
                </div>
              </div>
            </div>

            {/* Portfolio Upload */}
            <div className="card mb-4">
              <div className="card-header">
                <h2 className="h5 mb-1 text-primary">Portfolio Upload</h2>
                <p className="text-muted mb-0">Showcase your best artworks (up to 10 images).</p>
              </div>
              <div className="card-body">
                {portfolioFiles.length > 0 && (
                  <div className="mb-4">
                    <h5 className="h6 mb-3">Current Uploads</h5>
                    <div className="list-group">
                      {portfolioFiles.map((file, index) => (
                        <div key={index} className="list-group-item d-flex align-items-center">
                          <i className="bi bi-image me-3 text-primary"></i>
                          <span className="flex-grow-1">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removePortfolioFile(index)}
                            className="btn btn-outline-danger btn-sm"
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h5 className="h6 mb-3">Upload New Artwork</h5>
                  <label htmlFor="portfolioUpload" className="btn btn-outline-primary">
                    <i className="bi bi-paperclip me-2"></i>
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
              </div>
            </div>

            {/* Social Media & Website */}
            <div className="card mb-4">
              <div className="card-header">
                <h2 className="h5 mb-1 text-primary">Social Media & Website</h2>
                <p className="text-muted mb-0">Connect your online presence to reach more fans.</p>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="instagram" className="form-label">Instagram Profile</label>
                  <div className="input-group">
                    <span className="input-group-text">📷</span>
                    <input
                      type="text"
                      className={`form-control ${instagramError ? 'is-invalid' : ''}`}
                      id="instagram"
                      name="instagram"
                      placeholder="https://instagram.com/yourhandle"
                      value={formData.instagram}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                  {instagramError && <div className="invalid-feedback">{instagramError}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="twitter" className="form-label">Twitter Profile</label>
                  <div className="input-group">
                    <span className="input-group-text">🐦</span>
                    <input
                      type="text"
                      className="form-control"
                      id="twitter"
                      name="twitter"
                      placeholder="https://twitter.com/yourhandle"
                      value={formData.twitter}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="website" className="form-label">Personal Website</label>
                  <div className="input-group">
                    <span className="input-group-text">🌐</span>
                    <input
                      type="text"
                      className="form-control"
                      id="website"
                      name="website"
                      placeholder="https://yourwebsite.com"
                      value={formData.website}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="d-flex gap-3 justify-content-end">
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                <i className="bi bi-x-circle me-1"></i>
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-1"></i>
                    Save Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfilePage;
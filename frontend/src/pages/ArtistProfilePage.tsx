import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { artistAPI, getUser } from '../services/api.service';
import ProfileSidebar from '../components/ProfileSidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

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
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProfileExisting, setIsProfileExisting] = useState(false);

  // Fetch existing profile on load
  useEffect(() => {
    fetchExistingProfile();
  }, []);

  const fetchExistingProfile = async () => {
    try {
      const response = await artistAPI.getProfile();
      if (response.data) {
        setIsProfileExisting(true);
        setFormData({
          artistName: currentUser?.name || '',
          email: currentUser?.email || '',
          bio: response.data.bio || '',
          portfolio: response.data.portfolio || '',
          instagram: response.data.socialMediaLinks?.instagram || '',
          twitter: response.data.socialMediaLinks?.twitter || '',
          website: response.data.socialMediaLinks?.website || '',
        });
        if (response.data.profilePicture) {
          setPreviewUrl(response.data.profilePicture);
        }
      }
    } catch (error: any) {
      // Profile doesn't exist yet, which is fine
      setIsProfileExisting(false);
    }
  };

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

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      
      // Upload immediately to backend
      try {
        const response = await artistAPI.uploadProfilePicture(file);
        if (response.success) {
          setPreviewUrl(response.data.url);
        }
      } catch (err: any) {
        console.error('Error uploading profile picture:', err);
        setError('Failed to upload profile picture');
      }
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
      const profileData = {
        bio: formData.bio,
        portfolio: formData.portfolio,
        socialMediaLinks: {
          instagram: formData.instagram,
          twitter: formData.twitter,
          website: formData.website,
        },
        profilePicture: previewUrl,
      };

      const response = await artistAPI.createProfile(profileData);
      
      setSuccessMessage(response.message || 'Profile saved successfully!');
      setShowSuccessModal(true);
      
      // Auto-close modal and redirect after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Failed to save profile. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/dashboard');
  };

  return (
    <>
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
                  <h2 className="mb-1">My Profile</h2>
                  <p className="text-muted mb-0">Manage your artist profile information</p>
                </div>

                {error && (
                  <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError('')} aria-label="Close"></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Basic Information */}
                  <section className="card border-0 shadow-sm mb-4">
                    <div className="card-body p-4">
                      <h2 className="h5 fw-bold mb-2">Basic Information</h2>
                      <p className="text-muted small mb-4">Tell us about yourself.</p>
                      
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label htmlFor="artistName" className="form-label fw-semibold">Artist Name</label>
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
                          <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
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
                  </section>

                  {/* Profile Picture */}
                  <section className="card border-0 shadow-sm mb-4">
                    <div className="card-body p-4">
                      <h2 className="h5 fw-bold mb-2">Profile Picture</h2>
                      <p className="text-muted small mb-4">Upload a clear, professional image.</p>
                      
                      <div className="d-flex align-items-center gap-4">
                        <div className="position-relative">
                          <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" 
                               style={{ width: '120px', height: '120px', overflow: 'hidden' }}>
                            {previewUrl ? (
                              <img 
                                src={previewUrl.startsWith('blob:') ? previewUrl : `${previewUrl}`} 
                                alt="Profile preview" 
                                className="w-100 h-100"
                                style={{ objectFit: 'cover' }}
                              />
                            ) : (
                              <i className="bi bi-person-circle text-muted" style={{ fontSize: '80px' }}></i>
                            )}
                          </div>
                        </div>
                        <div>
                          <label htmlFor="profilePicture" className="btn btn-outline-primary">
                            <i className="bi bi-cloud-upload-fill me-2"></i>
                            Upload New Picture
                          </label>
                          <input
                            type="file"
                            id="profilePicture"
                            accept="image/*"
                            onChange={handleProfilePictureChange}
                            style={{ display: 'none' }}
                          />
                          <p className="text-muted small mt-2 mb-0">
                            <i className="bi bi-info-circle me-1"></i>
                            PNG, JPG up to 5MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Biography */}
                  <section className="card border-0 shadow-sm mb-4">
                    <div className="card-body p-4">
                      <h2 className="h5 fw-bold mb-2">Biography</h2>
                      <p className="text-muted small mb-4">Share your artistic journey and inspiration.</p>
                      
                      <div>
                        <label htmlFor="bio" className="form-label fw-semibold">Artist Biography</label>
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
                        <div className="form-text">
                          <i className="bi bi-lightbulb me-1"></i>
                          A detailed bio helps buyers connect with your art and understand your unique perspective.
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Portfolio Upload */}
                  <section className="card border-0 shadow-sm mb-4">
                    <div className="card-body p-4">
                      <h2 className="h5 fw-bold mb-2">Portfolio Upload</h2>
                      <p className="text-muted small mb-4">Showcase your best artworks (up to 10 images).</p>
                      
                      {portfolioFiles.length > 0 && (
                        <div className="mb-4">
                          <h4 className="h6 fw-semibold mb-3">Current Uploads</h4>
                          <div className="list-group gap-2">
                            {portfolioFiles.map((file, index) => (
                              <div key={index} className="list-group-item d-flex align-items-center gap-3">
                                <i className="bi bi-file-image text-primary fs-5"></i>
                                <span className="flex-grow-1">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removePortfolioFile(index)}
                                  className="btn btn-sm btn-outline-danger"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="h6 fw-semibold mb-3">Upload New Artwork</h4>
                        <label htmlFor="portfolioUpload" className="btn btn-outline-secondary">
                          <i className="bi bi-plus-circle me-2"></i>
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
                  </section>

                  {/* Social Media & Website */}
                  <section className="card border-0 shadow-sm mb-4">
                    <div className="card-body p-4">
                      <h2 className="h5 fw-bold mb-2">Social Media & Website</h2>
                      <p className="text-muted small mb-4">Connect your online presence to reach more fans.</p>
                      
                      <div className="mb-3">
                        <label htmlFor="instagram" className="form-label fw-semibold">
                          <i className="bi bi-instagram text-danger me-2"></i>
                          Instagram Profile
                        </label>
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
                        {instagramError && (
                          <div className="invalid-feedback">
                            <i className="bi bi-exclamation-triangle me-1"></i>
                            {instagramError}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="twitter" className="form-label fw-semibold">
                          <i className="bi bi-twitter text-info me-2"></i>
                          Twitter Profile
                        </label>
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

                      <div className="mb-3">
                        <label htmlFor="website" className="form-label fw-semibold">
                          <i className="bi bi-globe text-primary me-2"></i>
                          Personal Website
                        </label>
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
                  </section>

                  {/* Form Actions */}
                  <div className="d-flex justify-content-end gap-3">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary px-4"
                      onClick={handleCancel}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary px-4"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Save Profile
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

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center py-4">
                <i className="bi bi-check-circle-fill text-success display-1 mb-3"></i>
                <h4 className="fw-bold mb-2">Success!</h4>
                <p className="text-muted">{successMessage}</p>
                <button className="btn btn-primary mt-3" onClick={closeSuccessModal}>
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ArtistProfilePage;

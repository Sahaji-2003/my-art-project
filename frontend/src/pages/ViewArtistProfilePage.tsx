import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { artistAPI, reviewAPI } from '../services/api.service';
import { artworkAPI, type Artwork } from '../services/artwork';
import ArtworkCard from '../components/ArtworkCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/App.css';

interface Review {
  _id: string;
  rating: number;
  comment?: string;
  buyerId?: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  artworkId?: {
    _id: string;
    title: string;
    images?: Array<{ url: string }>;
  };
  createdAt: string;
}

const ViewArtistProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [soldArtworks, setSoldArtworks] = useState<Artwork[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likingArtworks, setLikingArtworks] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (userId) {
      fetchArtistProfile();
      fetchArtistArtworks();
      fetchArtistReviews();
    }
  }, [userId]);

  const fetchArtistProfile = async () => {
    try {
      const response = await artistAPI.getProfileById(userId!);
      setProfile(response.data);
    } catch (err: any) {
      console.error('Error fetching artist profile:', err);
      setError('Failed to load artist profile');
    }
  };

  const fetchArtistArtworks = async () => {
    try {
      setLoading(true);
      const response = await artworkAPI.getArtworksByArtist(userId!);
      const allArtworks = response.data || [];
      setArtworks(allArtworks);
      // Filter sold artworks
      const sold = allArtworks.filter((artwork: Artwork) => artwork.status === 'sold');
      setSoldArtworks(sold);
    } catch (err: any) {
      console.error('Error fetching artist artworks:', err);
      setError('Failed to load artworks');
    } finally {
      setLoading(false);
    }
  };

  const fetchArtistReviews = async () => {
    try {
      const response = await reviewAPI.getArtistReviews(userId!, 5);
      setReviews(response.data || []);
      setTotalReviews(response.total || 0);
    } catch (err: any) {
      console.error('Error fetching artist reviews:', err);
      // Don't set error for reviews, just leave empty
    }
  };

  const handleToggleLike = async (artwork: Artwork) => {
    if (!artwork._id) return;
    
    setLikingArtworks(prev => new Set(prev).add(artwork._id));
    
    try {
      await artworkAPI.toggleLike(artwork._id);
      
      // Update local state
      setArtworks(prevArtworks => 
        prevArtworks.map(a => {
          if (a._id === artwork._id) {
            const newLikesCount = (a.likesCount || 0) + (a.isLiked ? -1 : 1);
            return {
              ...a,
              isLiked: !a.isLiked,
              likesCount: newLikesCount
            };
          }
          return a;
        })
      );
    } catch (err: any) {
      console.error('Error toggling like:', err);
    } finally {
      setLikingArtworks(prev => {
        const newSet = new Set(prev);
        newSet.delete(artwork._id);
        return newSet;
      });
    }
  };

  const handleCardClick = (artwork: Artwork) => {
    navigate(`/purchase/${artwork._id}`);
  };

  if (loading) {
    return (
      <div className="bg-light min-vh-100 py-5">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading artist profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="bg-light min-vh-100 py-5">
        <div className="container">
          <div className="text-center py-5">
            <i className="bi bi-exclamation-triangle display-1 text-warning"></i>
            <h3 className="fw-bold mt-3">Artist Not Found</h3>
            <p className="text-muted mb-4">{error}</p>
            <button className="btn btn-primary" onClick={() => navigate('/search')}>
              Browse Artworks
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        {error && (
          <div className="alert alert-warning alert-dismissible fade show mb-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}

        {/* Artist Header */}
        <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
          <div className="row align-items-center">
            <div className="col-auto">
              <div 
                className="rounded-circle bg-light d-flex align-items-center justify-content-center overflow-hidden"
                style={{ width: '120px', height: '120px' }}
              >
                {profile?.profilePicture ? (
                  <img 
                    src={profile.profilePicture} 
                    alt={profile?.name || 'Artist'} 
                    className="w-100 h-100"
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <i className="bi bi-person-circle text-muted" style={{ fontSize: '100px' }}></i>
                )}
              </div>
            </div>
            <div className="col">
              <div className="d-flex align-items-center gap-2 mb-2">
                <h2 className="h3 mb-0 fw-bold">{profile?.name || 'Artist'}</h2>
                {profile?.isVerified && (
                  <i className="bi bi-patch-check-fill text-primary fs-5"></i>
                )}
              </div>
              {profile?.bio && (
                <p className="text-muted mb-3">{profile.bio}</p>
              )}
              
              {/* Social Media Links */}
              {(profile?.socialMediaLinks?.instagram || profile?.socialMediaLinks?.twitter || profile?.socialMediaLinks?.website) && (
                <div className="d-flex gap-3 flex-wrap">
                  {profile.socialMediaLinks.instagram && (
                    <a 
                      href={profile.socialMediaLinks.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      <i className="bi bi-instagram text-danger fs-5"></i>
                    </a>
                  )}
                  {profile.socialMediaLinks.twitter && (
                    <a 
                      href={profile.socialMediaLinks.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      <i className="bi bi-twitter text-info fs-5"></i>
                    </a>
                  )}
                  {profile.socialMediaLinks.website && (
                    <a 
                      href={profile.socialMediaLinks.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      <i className="bi bi-globe text-primary fs-5"></i>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="row mt-4 pt-4 border-top">
            <div className="col-4 text-center">
              <div className="fw-bold fs-4 text-primary">{artworks.length}</div>
              <div className="text-muted small">Artworks</div>
            </div>
            <div className="col-4 text-center">
              <div className="fw-bold fs-4 text-primary">{profile?.totalSales || 0}</div>
              <div className="text-muted small">Sales</div>
            </div>
            <div className="col-4 text-center">
              <div className="fw-bold fs-4 text-primary">
                {profile?.rating ? profile.rating.toFixed(1) : '0.0'}
              </div>
              <div className="text-muted small">Rating</div>
            </div>
          </div>
        </div>

        {/* Sold Artworks Section */}
        {soldArtworks.length > 0 && (
          <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h4 mb-0 fw-bold">Sold Artworks</h2>
              <span className="badge bg-success">{soldArtworks.length} sold</span>
            </div>

            <div className="row g-4">
              {soldArtworks.map((artwork) => (
                <div key={artwork._id} className="col-6 col-md-4 col-lg-3">
                  <ArtworkCard
                    artwork={artwork}
                    onCardClick={() => handleCardClick(artwork)}
                    onLikeClick={() => handleToggleLike(artwork)}
                    isLiking={likingArtworks.has(artwork._id || '')}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Artworks Section */}
        <div className="bg-white rounded-4 shadow-sm p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4 mb-0 fw-bold">All Artworks by {profile?.name || 'Artist'}</h2>
            <span className="badge bg-primary">{artworks.length} pieces</span>
          </div>

          {artworks.length > 0 ? (
            <div className="row g-4">
              {artworks.map((artwork) => (
                <div key={artwork._id} className="col-6 col-md-4 col-lg-3">
                  <ArtworkCard
                    artwork={artwork}
                    onCardClick={() => handleCardClick(artwork)}
                    onLikeClick={() => handleToggleLike(artwork)}
                    isLiking={likingArtworks.has(artwork._id || '')}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-palette display-1 text-muted"></i>
              <p className="text-muted mt-3">No artworks available yet</p>
            </div>
          )}
        </div>

        {/* Customer Reviews Section */}
        {totalReviews > 0 && (
          <div className="bg-white rounded-4 shadow-sm p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="h4 mb-0 fw-bold">Customer Reviews</h2>
                <p className="text-muted small mb-0">{totalReviews} total {totalReviews === 1 ? 'review' : 'reviews'}</p>
              </div>
              <span className="badge bg-primary">Top {reviews.length} Reviews</span>
            </div>

            {reviews.length > 0 ? (
              <div>
                {reviews.map((review) => {
                  const reviewer = review.buyerId || {};
                  const reviewerName = reviewer.name || 'Anonymous';
                  const reviewerPicture = reviewer.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewerName)}&background=4A90E2&color=fff`;
                  const artworkTitle = review.artworkId?.title || 'Artwork';
                  
                  return (
                    <div key={review._id} className="mb-4 pb-4 border-bottom">
                      <div className="d-flex align-items-start gap-3 mb-2">
                        <img 
                          src={reviewerPicture}
                          alt={reviewerName}
                          className="rounded-circle"
                          style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                        />
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className="fw-semibold">{reviewerName}</span>
                            <span className="text-muted small">•</span>
                            <span className="text-muted small">{artworkTitle}</span>
                          </div>
                          <div className="text-warning mb-2">
                            {Array.from({ length: 5 }, (_, i) => (
                              <i key={i} className={`bi ${i < review.rating ? 'bi-star-fill' : 'bi-star'}`}></i>
                            ))}
                          </div>
                          {review.comment && (
                            <p className="text-muted mb-2">{review.comment}</p>
                          )}
                          <small className="text-muted">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </small>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4">
                <i className="bi bi-chat-left-text display-6 text-muted"></i>
                <p className="text-muted mt-3">No reviews yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewArtistProfilePage;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { artistAPI } from '../services/api.service';
import { artworkAPI, type Artwork } from '../services/artwork';
import ArtworkCard from '../components/ArtworkCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/App.css';

const ViewArtistProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [likingArtworks, setLikingArtworks] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (userId) {
      fetchArtistProfile();
      fetchArtistArtworks();
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
      setArtworks(response.data || []);
    } catch (err: any) {
      console.error('Error fetching artist artworks:', err);
      setError('Failed to load artworks');
    } finally {
      setLoading(false);
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
                {profile?.userId?.profilePicture || profile?.profilePicture ? (
                  <img 
                    src={profile.userId?.profilePicture || profile.profilePicture} 
                    alt={profile.userId?.name || 'Artist'} 
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
                <h2 className="h3 mb-0 fw-bold">{profile?.userId?.name || 'Artist'}</h2>
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

        {/* Artworks Section */}
        <div className="bg-white rounded-4 shadow-sm p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4 mb-0 fw-bold">Artworks by {profile?.userId?.name || 'Artist'}</h2>
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
      </div>
    </div>
  );
};

export default ViewArtistProfilePage;


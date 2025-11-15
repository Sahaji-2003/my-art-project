// ============================================
// src/pages/InventoryPage.tsx
// ============================================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { artworkAPI, type Artwork } from '../services/artwork';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.css';

const InventoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [stats, setStats] = useState({
    totalArtworks: 0,
    totalSales: 0,
    averagePrice: 0,
    totalViews: 0
  });

  useEffect(() => {
    fetchArtworks();
    fetchStats();
  }, []);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      setError('');
      // For now, we'll use search to get user's artworks
      // In a real app, you'd have a specific endpoint for user's inventory
      const response = await artworkAPI.searchArtworks({ limit: 50 });
      setArtworks(response.data || []);
    } catch (err: any) {
      console.error('Error fetching artworks:', err);
      setError('Failed to load artworks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Mock stats for now - in a real app, you'd fetch from analytics API
      setStats({
        totalArtworks: 24,
        totalSales: 12500,
        averagePrice: 520,
        totalViews: 8970
      });
    } catch (err: any) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleEditArtwork = (artworkId: string) => {
    // Navigate to edit page or open edit modal
    console.log('Edit artwork:', artworkId);
  };

  const handleDeleteArtwork = async (artworkId: string) => {
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      try {
        await artworkAPI.deleteArtwork(artworkId);
        setArtworks(prev => prev.filter(artwork => artwork._id !== artworkId));
        // Update stats
        setStats(prev => ({
          ...prev,
          totalArtworks: prev.totalArtworks - 1
        }));
      } catch (err: any) {
        console.error('Error deleting artwork:', err);
        alert('Failed to delete artwork. Please try again.');
      }
    }
  };

  const handleUploadNew = () => {
    navigate('/upload');
  };

  return (
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h1 className="h3 mb-0 text-primary">Inventory Management</h1>
                <button className="btn btn-primary" onClick={handleUploadNew}>
                  <i className="bi bi-upload me-2"></i>
                  Upload New Artwork
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3 text-primary">Performance Analytics</h2>
              <div className="row g-3">
                <div className="col-md-3 col-sm-6">
                  <div className="card border-0 bg-light">
                    <div className="card-body text-center">
                      <div className="fs-1 mb-2">🎨</div>
                      <h6 className="card-title text-muted">Total Artworks</h6>
                      <h3 className="text-primary">{stats.totalArtworks}</h3>
                      <small className="text-muted">Currently listed for sale</small>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 col-sm-6">
                  <div className="card border-0 bg-light">
                    <div className="card-body text-center">
                      <div className="fs-1 mb-2">💰</div>
                      <h6 className="card-title text-muted">Total Sales</h6>
                      <h3 className="text-success">${stats.totalSales.toLocaleString()}</h3>
                      <small className="text-success">+5% from last month</small>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 col-sm-6">
                  <div className="card border-0 bg-light">
                    <div className="card-body text-center">
                      <div className="fs-1 mb-2">💵</div>
                      <h6 className="card-title text-muted">Average Price</h6>
                      <h3 className="text-primary">${stats.averagePrice.toLocaleString()}</h3>
                      <small className="text-muted">Stable over the last quarter</small>
                    </div>
                  </div>
                </div>

                <div className="col-md-3 col-sm-6">
                  <div className="card border-0 bg-light">
                    <div className="card-body text-center">
                      <div className="fs-1 mb-2">👁️</div>
                      <h6 className="card-title text-muted">Artwork Views</h6>
                      <h3 className="text-primary">{stats.totalViews.toLocaleString()}</h3>
                      <small className="text-success">+12% from last month</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="row mb-4">
        <div className="col-lg-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h6 mb-0">Artwork Views & Sales Trends</h3>
                <i className="bi bi-graph-up text-primary"></i>
              </div>
              <div className="bg-light rounded p-3" style={{height: '200px'}}>
                <div className="d-flex align-items-center justify-content-center h-100">
                  <div className="text-center">
                    <div className="mb-2">
                      <div className="d-inline-block bg-primary rounded" style={{width: '100px', height: '3px', marginRight: '10px'}}></div>
                      <small className="text-muted">Views</small>
                    </div>
                    <div>
                      <div className="d-inline-block bg-success rounded" style={{width: '80px', height: '3px', marginRight: '10px'}}></div>
                      <small className="text-muted">Sales</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6 mb-3">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="h6 mb-0">Sales by Category</h3>
                <i className="bi bi-bar-chart text-primary"></i>
              </div>
              <div className="bg-light rounded p-3" style={{height: '200px'}}>
                <div className="d-flex align-items-end justify-content-around h-100">
                  <div className="text-center">
                    <div className="bg-primary rounded mb-2" style={{width: '30px', height: '60px'}}></div>
                    <small className="text-muted">Abstract</small>
                  </div>
                  <div className="text-center">
                    <div className="bg-primary rounded mb-2" style={{width: '30px', height: '45px'}}></div>
                    <small className="text-muted">Portrait</small>
                  </div>
                  <div className="text-center">
                    <div className="bg-primary rounded mb-2" style={{width: '30px', height: '30px'}}></div>
                    <small className="text-muted">Sculpture</small>
                  </div>
                  <div className="text-center">
                    <div className="bg-primary rounded mb-2" style={{width: '30px', height: '40px'}}></div>
                    <small className="text-muted">Digital</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Your Artworks Section */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h5 mb-3 text-primary">Your Artworks</h2>
              
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading artworks...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              ) : artworks.length === 0 ? (
                <div className="text-center py-5">
                  <div className="fs-1 mb-3">🎨</div>
                  <h3 className="h5 text-muted">No artworks found</h3>
                  <p className="text-muted mb-3">Start by uploading your first artwork to get started.</p>
                  <button className="btn btn-primary" onClick={handleUploadNew}>
                    Upload Your First Artwork
                  </button>
                </div>
              ) : (
                <div className="row g-3">
                  {artworks.map((artwork) => (
                    <div key={artwork._id} className="col-lg-3 col-md-4 col-sm-6">
                      <div className="card h-100">
                        <div className="position-relative">
                          <img
                            src={artwork.images?.[0]?.url || 'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=No+Image'}
                            alt={artwork.title || 'Artwork'}
                            className="card-img-top"
                            style={{height: '200px', objectFit: 'cover'}}
                          />
                        </div>
                        
                        <div className="card-body d-flex flex-column">
                          <h5 className="card-title">{artwork.title || 'Untitled'}</h5>
                          <p className="card-text text-muted small">{artwork.artist?.name || 'Unknown Artist'}</p>
                          <div className="text-primary fw-bold mb-3">${artwork.price?.toLocaleString() || '0'}</div>
                          
                          <div className="mt-auto">
                            <div className="d-grid gap-2">
                              <button 
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => handleEditArtwork(artwork._id)}
                              >
                                <i className="bi bi-pencil me-1"></i>
                                Edit
                              </button>
                              <button 
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDeleteArtwork(artwork._id)}
                              >
                                <i className="bi bi-trash me-1"></i>
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;

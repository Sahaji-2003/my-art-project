// ============================================
// src/pages/InventoryPage.tsx
// ============================================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { artworkAPI, type Artwork } from '../services/artwork';
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
    <div className="inventory-page">
      <div className="inventory-container">
        {/* Header Section */}
        <div className="inventory-header">
          <div className="header-content">
            <h1>Inventory Management</h1>
            <button className="upload-new-btn" onClick={handleUploadNew}>
              <span className="upload-icon">📤</span>
              Upload New Artwork
            </button>
          </div>
        </div>

        {/* Performance Analytics */}
        <div className="analytics-section">
          <h2>Performance Analytics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🎨</div>
              <div className="stat-content">
                <h3>Total Artworks</h3>
                <div className="stat-value">{stats.totalArtworks}</div>
                <p>Currently listed for sale</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>Total Sales</h3>
                <div className="stat-value">${stats.totalSales.toLocaleString()}</div>
                <p className="positive-change">+5% from last month</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💵</div>
              <div className="stat-content">
                <h3>Average Artwork Price</h3>
                <div className="stat-value">${stats.averagePrice.toLocaleString()}</div>
                <p>Stable over the last quarter</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">👁️</div>
              <div className="stat-content">
                <h3>Artwork Views</h3>
                <div className="stat-value">{stats.totalViews.toLocaleString()}</div>
                <p className="positive-change">+12% from last month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-container">
            <div className="chart-header">
              <h3>Artwork Views & Sales Trends</h3>
              <span className="chart-icon">📈</span>
            </div>
            <div className="chart-placeholder">
              <div className="chart-mock">
                <div className="chart-lines">
                  <div className="line views-line"></div>
                  <div className="line sales-line"></div>
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color views-color"></span>
                    <span>Views</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color sales-color"></span>
                    <span>Sales</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="chart-container">
            <div className="chart-header">
              <h3>Sales by Category</h3>
              <span className="chart-icon">📊</span>
            </div>
            <div className="chart-placeholder">
              <div className="chart-mock">
                <div className="bar-chart">
                  <div className="bar abstract-bar"></div>
                  <div className="bar portrait-bar"></div>
                  <div className="bar sculpture-bar"></div>
                  <div className="bar digital-bar"></div>
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color sales-color"></span>
                    <span>Sales Value</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color count-color"></span>
                    <span>Artworks Count</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Your Artworks Section */}
        <div className="artworks-section">
          <h2>Your Artworks</h2>
          
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading artworks...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <div className="error-icon">⚠️</div>
              <p>{error}</p>
            </div>
          ) : artworks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎨</div>
              <h3>No artworks found</h3>
              <p>Start by uploading your first artwork to get started.</p>
              <button className="upload-first-btn" onClick={handleUploadNew}>
                Upload Your First Artwork
              </button>
            </div>
          ) : (
            <div className="artworks-grid">
              {artworks.map((artwork) => (
                <div key={artwork._id} className="artwork-card">
                  <div className="artwork-image-container">
                    <img
                      src={artwork.images?.[0]?.url || 'https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=No+Image'}
                      alt={artwork.title || 'Artwork'}
                      className="artwork-image"
                    />
                  </div>
                  
                  <div className="artwork-info">
                    <h3 className="artwork-title">{artwork.title || 'Untitled'}</h3>
                    <p className="artist-name">{artwork.artist?.name || 'Unknown Artist'}</p>
                    <div className="artwork-price">${artwork.price?.toLocaleString() || '0'}</div>
                  </div>

                  <div className="artwork-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditArtwork(artwork._id)}
                    >
                      <span className="action-icon">✏️</span>
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteArtwork(artwork._id)}
                    >
                      <span className="action-icon">🗑️</span>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;

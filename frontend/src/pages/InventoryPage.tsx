// ============================================
// src/pages/InventoryPage.tsx
// ============================================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { artworkAPI, type Artwork } from '../services/artwork';
import { artistAPI, orderAPI } from '../services/api.service';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/App.css';

const InventoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [stats, setStats] = useState({
    totalArtworks: 0,
    totalSales: 0,
    totalRevenue: 0,
    averagePrice: 0,
    totalViews: 0
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch inventory and stats in parallel
      const [inventoryResponse, artistStats, ordersResponse] = await Promise.all([
        artistAPI.getInventory().catch(() => ({ data: { artworks: [] } })),
        artistAPI.getStats().catch(() => ({ data: { totalSales: 0, totalRevenue: 0 } })),
        orderAPI.getArtistOrders().catch(() => ({ data: [] }))
      ]);
      
      const fetchedArtworks = inventoryResponse.data?.artworks || [];
      setArtworks(fetchedArtworks);
      
      // Calculate stats
      const totalArtworks = fetchedArtworks.length;
      const orders = ordersResponse.data || [];
      const totalSales = orders.length;
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.price || order.totalAmount || 0), 0);
      const averagePrice = totalArtworks > 0 
        ? fetchedArtworks.reduce((sum: number, artwork: any) => sum + (artwork.price || 0), 0) / totalArtworks 
        : 0;
      const totalViews = fetchedArtworks.reduce((sum: number, artwork: any) => sum + (artwork.views || 0), 0);

      setStats({
        totalArtworks,
        totalSales,
        totalRevenue: artistStats.data?.totalRevenue || totalRevenue,
        averagePrice: Math.round(averagePrice),
        totalViews
      });
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
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
    <div className="container-fluid py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container">
        {/* Header Section */}
        <div className="bg-white rounded shadow-sm p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div>
              <h1 className="mb-1">Inventory Management</h1>
            </div>
            <button className="btn btn-primary btn-lg shadow-sm fw-semibold" onClick={handleUploadNew}>
              <i className="bi bi-cloud-upload-fill me-2"></i>
              Upload New Artwork
            </button>
          </div>
        </div>

        {/* Performance Analytics */}
        <div className="bg-white rounded shadow-sm p-4 mb-4">
          <h2 className="fw-bold mb-4 pb-3 border-bottom">Performance Analytics</h2>
          <div className="row g-4">
            <div className="col-12 col-sm-6 col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-palette-fill text-primary fs-3 me-2"></i>
                    <h6 className="text-muted mb-0 small">Total Artworks</h6>
                  </div>
                  <h3 className="fw-bold mb-1">{loading ? <span className="spinner-border spinner-border-sm"></span> : stats.totalArtworks}</h3>
                  <p className="text-muted small mb-0">Currently listed for sale</p>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-currency-dollar text-success fs-3 me-2"></i>
                    <h6 className="text-muted mb-0 small">Total Sales</h6>
                  </div>
                  <h3 className="fw-bold mb-1 text-success">${loading ? <span className="spinner-border spinner-border-sm"></span> : stats.totalRevenue.toLocaleString()}</h3>
                  <p className="text-muted small mb-0">+{Math.floor((stats.totalSales / Math.max(1, stats.totalArtworks)) * 100)}% from last month</p>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-currency-dollar text-info fs-3 me-2"></i>
                    <h6 className="text-muted mb-0 small">Average Artwork Price</h6>
                  </div>
                  <h3 className="fw-bold mb-1">${loading ? <span className="spinner-border spinner-border-sm"></span> : stats.averagePrice.toLocaleString()}</h3>
                  <p className="text-muted small mb-0">Stable over the last quarter</p>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-eye-fill text-warning fs-3 me-2"></i>
                    <h6 className="text-muted mb-0 small">Artwork Views</h6>
                  </div>
                  <h3 className="fw-bold mb-1">{loading ? <span className="spinner-border spinner-border-sm"></span> : stats.totalViews.toLocaleString()}</h3>
                  <p className="text-muted small mb-0">+12% from last month</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Your Artworks Section */}
        <div className="bg-white rounded shadow-sm p-4">
          <h2 className="fw-bold mb-4 pb-3 border-bottom">Your Artworks</h2>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading artworks...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <div className="alert alert-danger">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            </div>
          ) : artworks.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-palette display-1 text-muted opacity-50"></i>
              <h3 className="fw-bold mb-2 mt-3">No artworks found</h3>
              <p className="text-muted mb-4">Start by uploading your first artwork to get started.</p>
              <button className="btn btn-primary btn-lg shadow-sm fw-semibold" onClick={handleUploadNew}>
                <i className="bi bi-cloud-upload-fill me-2"></i>
                Upload Your First Artwork
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {artworks.map((artwork) => (
                <div key={artwork._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="position-relative" style={{ height: '250px', overflow: 'hidden' }}>
                      <img
                        src={artwork.images?.[0]?.url || 'https://via.placeholder.com/300x250/CCCCCC/FFFFFF?text=No+Image'}
                        alt={artwork.title || 'Artwork'}
                        className="w-100 h-100"
                        style={{ objectFit: 'cover' }}
                      />
                      {artwork.status && (
                        <span className={`badge position-absolute top-0 end-0 m-2 ${
                          artwork.status === 'sold' ? 'bg-danger' : 
                          artwork.status === 'available' ? 'bg-success' : 
                          'bg-warning'
                        }`}>
                          {artwork.status}
                        </span>
                      )}
                    </div>
                    
                    <div className="card-body">
                      <h5 className="card-title fw-bold mb-2">{artwork.title || 'Untitled'}</h5>
                      <p className="text-muted small mb-2">{artwork.medium || 'Unknown Medium'}</p>
                      <p className="text-primary fw-bold fs-5 mb-3">${artwork.price?.toLocaleString() || '0'}</p>
                      
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-outline-secondary btn-sm flex-grow-1"
                          onClick={() => handleEditArtwork(artwork._id)}
                        >
                          <i className="bi bi-pencil me-1"></i>
                          Edit
                        </button>
                        <button 
                          className="btn btn-outline-danger btn-sm flex-grow-1"
                          onClick={() => handleDeleteArtwork(artwork._id)}
                        >
                          <i className="bi bi-trash me-1"></i>
                          Delete
                        </button>
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
  );
};

export default InventoryPage;

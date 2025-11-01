import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { artworkAPI, type Artwork } from '../services/artwork';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const DashboardPage: React.FC = () => {
 const navigate = useNavigate();
 const scrollContainerRef = useRef<HTMLDivElement>(null);
 const [trendingArtworks, setTrendingArtworks] = useState<Artwork[]>([]);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
   fetchTrendingArtworks();
 }, []);

 const fetchTrendingArtworks = async () => {
   try {
     setLoading(true);
     const response = await artworkAPI.getTrendingArtworks(8);
     setTrendingArtworks(response.data || []);
   } catch (error) {
     console.error('Error fetching trending artworks:', error);
     setTrendingArtworks([]);
   } finally {
     setLoading(false);
   }
 };

 const scrollLeft = () => {
   if (scrollContainerRef.current) {
     scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
   }
 };

 const scrollRight = () => {
   if (scrollContainerRef.current) {
     scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
   }
 };

 const getPrimaryImage = (artwork: Artwork) => {
   if (artwork.images && artwork.images.length > 0) {
     const primaryImage = artwork.images.find(img => img.isPrimary);
     return primaryImage?.url || artwork.images[0].url;
   }
   return '/assets/images/default-artwork.jpg';
 };

 const getLikesCount = (artwork: Artwork) => {
   return artwork.likes ? (Array.isArray(artwork.likes) ? artwork.likes.length : 0) : 0;
 };

 const handleToggleLike = async (e: React.MouseEvent, artworkId: string) => {
   e.stopPropagation();
   try {
     await artworkAPI.toggleLike(artworkId);
     // Refresh trending artworks after like toggle
     await fetchTrendingArtworks();
   } catch (error) {
     console.error('Error toggling like:', error);
   }
 };

 const handleCardClick = (artworkId: string) => {
   navigate(`/purchase/${artworkId}`);
 };

 return (
    <div className="container-fluid px-3 px-md-4 px-lg-5 py-4 py-md-5">
        {/* Hero Section */}
      <section className="bg-light rounded-4 p-4 p-md-5 mb-4 mb-md-5 border-0 shadow-sm">
        <div className="row align-items-center g-4">
          <div className="col-lg-7">
            <h1 className="display-4 fw-bold mb-4">Discover, Create, Connect: Your Art Journey Starts Here.</h1>
            <p className="lead text-muted mb-4">
               Arthub connects talented artists with eager buyers. Manage your art, 
               track sales, and engage with a vibrant community. Your dashboard provides 
               a quick overview of everything you need.
             </p>
            <button 
              className="btn btn-primary btn-lg px-4 py-3 rounded-pill shadow-sm fw-semibold" 
              type="button" 
              onClick={() => navigate('/search')}
            >
              <i className="bi bi-search me-2"></i>
              Explore Artworks
            </button>
           </div>
          <div className="col-lg-5 text-center">
            <div className="bg-gradient rounded-4 p-5 d-flex align-items-center justify-content-center" 
                 style={{ 
                   background: 'linear-gradient(135deg, #ffb6c1 0%, #ffd1dc 100%)',
                   minHeight: '300px',
                   height: '100%'
                 }}>
              <i className="bi bi-palette-fill display-1 text-white opacity-75"></i>
               </div>
             </div>
           </div>
         </section>

      {/* Trending Artworks Section */}
      <section className="mb-4 mb-md-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h2 fw-bold mb-0">Trending Artworks</h2>
          <button 
            className="btn btn-outline-primary btn-sm" 
            onClick={() => navigate('/search')}
          >
            View All
            <i className="bi bi-arrow-right ms-2"></i>
          </button>
               </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading trending artworks...</p>
            </div>
        ) : trendingArtworks.length > 0 ? (
          <div className="position-relative">
            <button
              className="btn btn-light rounded-circle position-absolute start-0 top-50 translate-middle-y shadow-lg border-0 d-none d-md-flex align-items-center justify-content-center"
              onClick={scrollLeft}
              style={{ width: '48px', height: '48px', zIndex: 10, left: '-24px' }}
            >
              <i className="bi bi-chevron-left fs-4"></i>
            </button>

            <div 
              ref={scrollContainerRef}
              className="d-flex gap-3 overflow-auto hide-scrollbar"
            >
              {trendingArtworks.map((artwork) => (
                <div 
                  key={artwork._id}
                  className="card shadow-sm"
                  style={{ 
                    minWidth: '300px',
                    maxWidth: '300px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid #e9ecef'
                  }}
                  onClick={() => handleCardClick(artwork._id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <div className="position-relative" style={{ height: '250px', overflow: 'hidden' }}>
                    <img
                      src={getPrimaryImage(artwork)}
                      alt={artwork.title}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/assets/images/default-artwork.jpg';
                      }}
                    />
                    <div className="position-absolute top-0 end-0 p-2">
                      <button
                        className="btn btn-light rounded-pill shadow-sm border-0"
                        onClick={(e) => handleToggleLike(e, artwork._id)}
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <i className="bi bi-heart-fill text-danger me-1"></i>
                        <span className="fw-semibold">{getLikesCount(artwork)}</span>
                      </button>
                    </div>
               </div>
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-2 text-truncate" style={{ fontSize: '1.1rem' }}>
                      {artwork.title}
                    </h5>
                    <p className="text-muted small mb-3">
                      by {artwork.artist?.name || 'Unknown Artist'}
                    </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-primary fs-5">
                        ${artwork.price.toLocaleString()}
                      </span>
                      <span className="badge bg-secondary-subtle text-secondary">
                        {artwork.medium}
                      </span>
            </div>
               </div>
            </div>
              ))}
               </div>

            <button
              className="btn btn-light rounded-circle position-absolute end-0 top-50 translate-middle-y shadow-lg border-0 d-none d-md-flex align-items-center justify-content-center"
              onClick={scrollRight}
              style={{ width: '48px', height: '48px', zIndex: 10, right: '-24px' }}
            >
              <i className="bi bi-chevron-right fs-4"></i>
            </button>
             </div>
        ) : (
          <div className="alert alert-info text-center py-4">
            <i className="bi bi-info-circle me-2"></i>
            No trending artworks available at the moment.
           </div>
        )}
         </section>

      {/* Quick Access to Features */}
      <section className="mb-4 mb-md-5">
        <h2 className="h2 fw-bold mb-4 mb-md-5">Quick Access to Features</h2>
        <div className="row g-3 g-md-4">
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div 
              className="card border-0 shadow-sm h-100" 
              onClick={() => navigate('/upload')}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="card-body p-4 text-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <i className="bi bi-cloud-upload-fill text-primary fs-3"></i>
                </div>
                <h3 className="h6 fw-semibold mb-2">Upload New Artwork</h3>
                <p className="text-muted small mb-0">Showcase your latest creations to a global audience.</p>
              </div>
            </div>
            </div>

          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div 
              className="card border-0 shadow-sm h-100" 
              onClick={() => navigate('/artist-profile')}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="card-body p-4 text-center">
                <div className="bg-info bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <i className="bi bi-person-circle text-info fs-3"></i>
                </div>
                <h3 className="h6 fw-semibold mb-2">Manage Your Profile</h3>
                <p className="text-muted small mb-0">Update your artist bio, portfolio, and contact details.</p>
              </div>
            </div>
            </div>

          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div 
              className="card border-0 shadow-sm h-100" 
              onClick={() => navigate('/inventory')}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="card-body p-4 text-center">
                <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <i className="bi bi-clipboard-check-fill text-success fs-3"></i>
                </div>
                <h3 className="h6 fw-semibold mb-2">Inventory & Sales</h3>
                <p className="text-muted small mb-0">Track your listings, sales, and artwork availability.</p>
              </div>
            </div>
            </div>

          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div 
              className="card border-0 shadow-sm h-100" 
              onClick={() => navigate('/community')}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="card-body p-4 text-center">
                <div className="bg-warning bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <i className="bi bi-people-fill text-warning fs-3"></i>
                </div>
                <h3 className="h6 fw-semibold mb-2">Explore Community</h3>
                <p className="text-muted small mb-0">Connect with fellow artists, share insights, and collaborate.</p>
              </div>
            </div>
            </div>

          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div 
              className="card border-0 shadow-sm h-100" 
              onClick={() => navigate('/search')}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="card-body p-4 text-center">
                <div className="bg-danger bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <i className="bi bi-search text-danger fs-3"></i>
                </div>
                <h3 className="h6 fw-semibold mb-2">Discover New Art</h3>
                <p className="text-muted small mb-0">Browse a curated selection of unique artworks from various artists.</p>
              </div>
            </div>
            </div>

          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div 
              className="card border-0 shadow-sm h-100" 
              onClick={() => navigate('/search')}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="card-body p-4 text-center">
                <div className="bg-secondary bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                  <i className="bi bi-heart-fill text-secondary fs-3"></i>
             </div>
                <h3 className="h6 fw-semibold mb-2">Favorite Artworks</h3>
                <p className="text-muted small mb-0">Quickly access artworks you've saved or wish to purchase later.</p>
           </div>
                 </div>
               </div>
           </div>
         </section>

         {/* CTA Section */}
      <section className="bg-primary text-white rounded-4 p-5 mb-4 mb-md-5 border-0 shadow-sm">
        <div className="text-center">
          <h2 className="h2 fw-bold mb-3">Ready to Explore More Unique Artworks?</h2>
          <p className="lead mb-4 opacity-90">
               Dive into our extensive collection from artists around the globe. 
               Find your next masterpiece today.
             </p>
          <button 
            className="btn btn-light btn-lg px-5 py-3 rounded-pill shadow-sm fw-semibold" 
            type="button" 
            onClick={() => navigate('/search')}
          >
            <i className="bi bi-search me-2"></i>
              Browse Artworks
            </button>
           </div>
         </section>
     </div>
 );
};

export default DashboardPage;

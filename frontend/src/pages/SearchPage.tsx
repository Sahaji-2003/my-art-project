// ============================================
// src/pages/SearchPage.tsx
// ============================================
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { artworkAPI, type Artwork, type SearchFilters } from '../services/artwork';
import { getUser } from '../services/api.service';
import ArtworkCard from '../components/ArtworkCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/App.css';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentUser = getUser();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [likingArtworks, setLikingArtworks] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<SearchFilters>({
    q: '',
    medium: '',
    style: '',
    price_min: undefined,
    price_max: undefined,
    page: 1,
    limit: 12
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  const mediums = ['Oil on Canvas', 'Acrylic', 'Watercolor', 'Digital Art', 'Photography', 'Sculpture', 'Mixed Media', 'Pencil', 'Charcoal', 'Other'];
  const styles = ['Abstract', 'Impressionism', 'Realism', 'Surrealism', 'Contemporary', 'Modern', 'Pop Art', 'Minimalism', 'Expressionism', 'Other'];

  // Handle URL query parameters on component mount
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      setFilters(prev => ({ ...prev, q: query, page: 1 }));
    }
  }, [searchParams]);

  // Fetch artworks when filters change
  useEffect(() => {
    fetchArtworks();
  }, [filters]);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      setError('');
      
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '' && value !== null && value !== undefined)
      );

      const response = await artworkAPI.searchArtworks(cleanFilters);
      const artworksData = response.data || [];
      
      const validArtworks = Array.isArray(artworksData) 
        ? artworksData.filter(artwork => artwork && typeof artwork === 'object' && artwork._id)
        : [];
        
      setArtworks(validArtworks);
      
      if (response.pagination) {
        setPagination({
          currentPage: response.pagination.page || 1,
          totalPages: response.pagination.pages || 1,
          totalItems: response.pagination.total || 0
        });
      }
    } catch (err: any) {
      console.error('Error fetching artworks:', err);
      setError('Failed to load artworks. Please try again.');
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, q: searchQuery, page: 1 }));
  };

  const handleToggleLike = async (e: React.MouseEvent, artworkId: string) => {
    e.stopPropagation();
    
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (likingArtworks.has(artworkId)) return;

    try {
      setLikingArtworks(prev => new Set(prev).add(artworkId));
      const response = await artworkAPI.toggleLike(artworkId);
      
      setArtworks(prev => prev.map(artwork => 
        artwork._id === artworkId 
          ? { ...artwork, likesCount: response.data.likes, isLiked: response.data.isLiked }
          : artwork
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLikingArtworks(prev => {
        const newSet = new Set(prev);
        newSet.delete(artworkId);
        return newSet;
      });
    }
  };

  const handleCardClick = (artworkId: string) => {
    navigate(`/purchase/${artworkId}`);
  };

  const clearFilters = () => {
    setFilters({ q: '', medium: '', style: '', price_min: undefined, price_max: undefined, page: 1, limit: 12 });
    setSearchQuery('');
  };

  return (
    <div className="container-fluid py-3 py-md-4 bg-light min-vh-100">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-3">
          <h1 className="h2 fw-bold mb-2">Explore Artwork</h1>
          <p className="text-muted mb-3">Discover curated art from talented artists worldwide</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-3 shadow-sm p-3 mb-3">
          <form onSubmit={handleSearch}>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search artworks, artists, styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                <i className="bi bi-search me-1"></i>Search
              </button>
            </div>
          </form>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-3 shadow-sm p-3 mb-3">
          <div className="row g-2">
            <div className="col-md-4">
              <label className="form-label small fw-semibold mb-1">Medium</label>
              <select
                className="form-select form-select-sm"
                value={filters.medium}
                onChange={(e) => setFilters(prev => ({ ...prev, medium: e.target.value, page: 1 }))}
              >
                <option value="">All Mediums</option>
                {mediums.map(medium => (
                  <option key={medium} value={medium}>{medium}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold mb-1">Style</label>
              <select
                className="form-select form-select-sm"
                value={filters.style}
                onChange={(e) => setFilters(prev => ({ ...prev, style: e.target.value, page: 1 }))}
              >
                <option value="">All Styles</option>
                {styles.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold mb-1">Price Range</label>
              <div className="d-flex gap-2">
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Min"
                  value={filters.price_min || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, price_min: e.target.value ? parseInt(e.target.value) : undefined, page: 1 }))}
                />
                <input
                  type="number"
                  className="form-control form-control-sm"
                  placeholder="Max"
                  value={filters.price_max || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, price_max: e.target.value ? parseInt(e.target.value) : undefined, page: 1 }))}
                />
              </div>
            </div>
          </div>

          <div className="mt-2 pt-2 border-top">
            <button className="btn btn-outline-secondary btn-sm" onClick={clearFilters}>
              <i className="bi bi-x-circle me-1"></i>Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        {!loading && artworks.length > 0 && (
          <div className="mb-2">
            <p className="text-muted small mb-0">
              Showing {artworks.length} of {pagination.totalItems} artworks
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
            <button type="button" className="btn-close" onClick={() => setError('')}></button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted small">Loading artworks...</p>
          </div>
        )}

        {/* Artworks Grid */}
        {!loading && artworks.length > 0 && (
          <div className="row g-3 mb-3">
            {artworks.map((artwork) => (
              <div key={artwork._id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                <ArtworkCard
                  artwork={artwork}
                  onCardClick={handleCardClick}
                  onLikeClick={handleToggleLike}
                  isLiking={likingArtworks.has(artwork._id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && artworks.length === 0 && !error && (
          <div className="text-center py-4 bg-white rounded-3 shadow-sm">
            <i className="bi bi-palette display-6 text-muted opacity-50 mb-2"></i>
            <h5 className="fw-bold mb-2">No artworks found</h5>
            <p className="text-muted mb-3 small">Try adjusting your search or filters to find more artworks.</p>
            <button className="btn btn-primary btn-sm" onClick={clearFilters}>
              <i className="bi bi-arrow-counterclockwise me-1"></i>Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <nav aria-label="Artworks pagination">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.currentPage === 1}
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
              </li>
              
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (pagination.currentPage <= 3) {
                  pageNum = i + 1;
                } else if (pagination.currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = pagination.currentPage - 2 + i;
                }

                return (
                  <li key={pageNum} className={`page-item ${pagination.currentPage === pageNum ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setFilters(prev => ({ ...prev, page: pageNum }))}
                    >
                      {pageNum}
                    </button>
                  </li>
                );
              })}
              
              <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

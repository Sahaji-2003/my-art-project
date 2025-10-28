// ============================================
// src/pages/SearchPage.tsx
// ============================================
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { artworkAPI, type Artwork, type SearchFilters } from '../services/artwork';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.css';


const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
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

  // Popular mediums for quick filter
  const popularMediums = ['Oil', 'Watercolor', 'Photography', 'Digital', 'Acrylic', 'Sculpture'];

  // Handle URL query parameters on component mount
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      setFilters(prev => ({
        ...prev,
        q: query,
        page: 1
      }));
    }
  }, [searchParams]);

  // Fetch artworks on component mount and when filters change
  useEffect(() => {
    fetchArtworks();
  }, [filters]);

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Clean up filters - remove empty values
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '' && value !== null)
      );

      const response = await artworkAPI.searchArtworks(cleanFilters);
      const artworksData = response.data || [];
      
      // Ensure we have an array and filter out any invalid items
      const validArtworks = Array.isArray(artworksData) 
        ? artworksData.filter(artwork => artwork && typeof artwork === 'object' && artwork._id)
        : [];
        
      setArtworks(validArtworks);
      
      // Set pagination if available
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
    setFilters(prev => ({
      ...prev,
      q: searchQuery,
      page: 1
    }));
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handleMediumFilter = (medium: string) => {
    setFilters(prev => ({
      ...prev,
      medium: prev.medium === medium ? '' : medium,
      page: 1
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  };

  const clearFilters = () => {
    setFilters({
      q: '',
      medium: '',
      style: '',
      price_min: undefined,
      price_max: undefined,
      page: 1,
      limit: 12
    });
    setSearchQuery('');
  };

  return (
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="text-center">
            <h1 className="display-4 text-primary mb-3">Explore Artwork</h1>
            <p className="lead text-muted">Discover a curated collection of art from talented artists worldwide</p>
          </div>
        </div>
      </div>

      {/* Main Search Bar */}
      <div className="row mb-4">
        <div className="col-12">
          <form onSubmit={handleSearch}>
            <div className="input-group input-group-lg">
              <span className="input-group-text bg-light">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search artworks, artists, styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Popular Mediums Filter */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Popular Mediums</h5>
              <div className="d-flex flex-wrap gap-2">
                {popularMediums.map((medium) => (
                  <button
                    key={medium}
                    className={`btn btn-outline-primary btn-sm ${filters.medium === medium ? 'active' : ''}`}
                    onClick={() => handleMediumFilter(medium)}
                  >
                    {medium}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Advanced Filters</h5>
              <div className="row g-3">
                <div className="col-md-3">
                  <label htmlFor="style-filter" className="form-label">Style</label>
                  <select
                    id="style-filter"
                    className="form-select"
                    value={filters.style}
                    onChange={(e) => handleFilterChange('style', e.target.value)}
                  >
                    <option value="">All Styles</option>
                    <option value="Realistic">Realistic</option>
                    <option value="Abstract">Abstract</option>
                    <option value="Impressionist">Impressionist</option>
                    <option value="Contemporary">Contemporary</option>
                    <option value="Minimalist">Minimalist</option>
                    <option value="Surreal">Surreal</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label htmlFor="price-min" className="form-label">Min Price</label>
                  <input
                    type="number"
                    id="price-min"
                    className="form-control"
                    placeholder="Min"
                    value={filters.price_min || ''}
                    onChange={(e) => handleFilterChange('price_min', e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </div>

                <div className="col-md-3">
                  <label htmlFor="price-max" className="form-label">Max Price</label>
                  <input
                    type="number"
                    id="price-max"
                    className="form-control"
                    placeholder="Max"
                    value={filters.price_max || ''}
                    onChange={(e) => handleFilterChange('price_max', e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </div>

                <div className="col-md-3 d-flex align-items-end">
                  <button className="btn btn-outline-secondary w-100" onClick={clearFilters}>
                    <i className="bi bi-x-circle me-1"></i>
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      {!loading && artworks.length > 0 && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              Showing {artworks.length} of {pagination.totalItems} artworks
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="row mb-3">
          <div className="col-12">
            <div className="alert alert-danger d-flex align-items-center">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="row">
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading artworks...</p>
          </div>
        </div>
      )}

      {/* Artworks Grid */}
      {!loading && artworks.length > 0 && (
        <div className="row g-4">
          {artworks.filter(artwork => artwork && artwork._id).map((artwork) => (
            <div key={artwork._id} className="col-lg-3 col-md-4 col-sm-6">
              <div 
                className="card h-100 shadow-sm"
                onClick={() => navigate(`/purchase/${artwork._id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="position-relative">
                  <img
                    src={artwork.images?.[0]?.url || 'https://via.placeholder.com/400x300/CCCCCC/FFFFFF?text=No+Image'}
                    alt={artwork.title || 'Artwork'}
                    className="card-img-top"
                    style={{height: '250px', objectFit: 'cover'}}
                  />
                  <div className="position-absolute top-0 end-0 m-2">
                    <button 
                      className="btn btn-light btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle like functionality here
                      }}
                    >
                      <i className="bi bi-heart"></i>
                      <span className="ms-1">{artwork.likes?.length || 0}</span>
                    </button>
                  </div>
                </div>
                
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{artwork.title || 'Untitled'}</h5>
                  <p className="card-text text-muted small">by {artwork.artist?.name || 'Unknown Artist'}</p>
                  <div className="mt-auto">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="h5 text-primary mb-0">${artwork.price?.toLocaleString() || '0'}</span>
                      <span className="badge bg-secondary">
                        {artwork.medium || 'Other'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && artworks.length === 0 && !error && (
        <div className="row">
          <div className="col-12 text-center py-5">
            <div className="fs-1 mb-3">🎨</div>
            <h3 className="h4 text-muted">No artworks found</h3>
            <p className="text-muted mb-3">No artworks are available at the moment. Please check back later or try different search criteria.</p>
            <button className="btn btn-primary" onClick={clearFilters}>
              <i className="bi bi-arrow-clockwise me-1"></i>
              Clear Filters
            </button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <div className="row mt-4">
          <div className="col-12">
            <nav aria-label="Search pagination">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <li key={page} className={`page-item ${pagination.currentPage === page ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${pagination.currentPage === pagination.totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;

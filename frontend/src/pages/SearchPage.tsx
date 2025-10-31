// ============================================
// src/pages/SearchPage.tsx
// ============================================
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { artworkAPI, type Artwork, type SearchFilters } from '../services/artwork';
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
    <div className="search-page">
      <div className="search-container">
        {/* Header Section */}
        <div className="search-header">
          <h1>Explore Artwork</h1>
          <p>Discover a curated collection of art from talented artists worldwide</p>
        </div>

        {/* Main Search Bar */}
        <form className="main-search-form" onSubmit={handleSearch}>
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search artworks, artists, styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="main-search-input"
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </div>
        </form>

        {/* Popular Mediums Filter */}
        <div className="filters-section">
          <h3>Popular Mediums:</h3>
          <div className="medium-filters">
            {popularMediums.map((medium) => (
              <button
                key={medium}
                className={`medium-filter ${filters.medium === medium ? 'active' : ''}`}
                onClick={() => handleMediumFilter(medium)}
              >
                {medium}
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="advanced-filters">
          <div className="filter-group">
            <label htmlFor="style-filter">Style:</label>
            <select
              id="style-filter"
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

          <div className="filter-group">
            <label htmlFor="price-min">Min Price:</label>
            <input
              type="number"
              id="price-min"
              placeholder="Min"
              value={filters.price_min}
              onChange={(e) => handleFilterChange('price_min', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="price-max">Max Price:</label>
            <input
              type="number"
              id="price-max"
              placeholder="Max"
              value={filters.price_max}
              onChange={(e) => handleFilterChange('price_max', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>

          <button className="clear-filters" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>

        {/* Results Count */}
        {!loading && artworks.length > 0 && (
          <div className="results-info">
            <p>
              Showing {artworks.length} of {pagination.totalItems} artworks
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading artworks...</p>
          </div>
        )}

        {/* Artworks Grid */}
        {!loading && artworks.length > 0 && (
          <div className="artworks-grid">
            {artworks.filter(artwork => artwork && artwork._id).map((artwork) => (
              <div 
                key={artwork._id} 
                className="artwork-card"
                onClick={() => navigate(`/purchase/${artwork._id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="artwork-image-container">
                  <img
                    src={artwork.images?.[0]?.url || 'https://via.placeholder.com/400x300/CCCCCC/FFFFFF?text=No+Image'}
                    alt={artwork.title || 'Artwork'}
                    className="artwork-image"
                  />
                  <div className="artwork-overlay">
                    <button 
                      className="like-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle like functionality here
                      }}
                    >
                      <span>❤️</span>
                      {artwork.likes?.length || 0}
                    </button>
                  </div>
                </div>
                
                <div className="artwork-info">
                  <h3 className="artwork-title">{artwork.title || 'Untitled'}</h3>
                  <p className="artist-name">by {artwork.artist?.name || 'Unknown Artist'}</p>
                  <div className="artwork-meta">
                    <span className="artwork-price">${artwork.price?.toLocaleString() || '0'}</span>
                    <span className={`medium-tag medium-${artwork.medium?.toLowerCase() || 'other'}`}>
                      {artwork.medium || 'Other'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && artworks.length === 0 && !error && (
          <div className="no-results">
            <div className="no-results-icon">🎨</div>
            <h3>No artworks found</h3>
            <p>No artworks are available at the moment. Please check back later or try different search criteria.</p>
            <button className="browse-all-button" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              Previous
            </button>
            
            <div className="pagination-numbers">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`pagination-number ${pagination.currentPage === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              className="pagination-button"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

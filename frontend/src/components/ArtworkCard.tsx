// ============================================
// src/components/ArtworkCard.tsx
// ============================================
import React from 'react';
import { type Artwork } from '../services/artwork';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

interface ArtworkCardProps {
  artwork: Artwork;
  onCardClick: (artworkId: string) => void;
  onLikeClick?: (e: React.MouseEvent, artworkId: string) => void;
  isLiking?: boolean;
  minWidth?: string;
  maxWidth?: string;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({
  artwork,
  onCardClick,
  onLikeClick,
  isLiking = false,
  minWidth = '250px',
  maxWidth = '250px'
}) => {
  const getPrimaryImage = (artwork: Artwork) => {
    if (artwork.images && artwork.images.length > 0) {
      const primaryImage = artwork.images.find(img => img.isPrimary);
      return primaryImage?.url || artwork.images[0].url;
    }
    return 'https://via.placeholder.com/400x300/CCCCCC/FFFFFF?text=No+Image';
  };

  const getLikesCount = (artwork: Artwork) => {
    return artwork.likesCount !== undefined 
      ? artwork.likesCount 
      : (artwork.likes ? (Array.isArray(artwork.likes) ? artwork.likes.length : 0) : 0);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLikeClick) {
      onLikeClick(e, artwork._id);
    }
  };

  const handleCardClick = () => {
    onCardClick(artwork._id);
  };

  const mediumClass = artwork.medium?.toLowerCase().replace(/\s+/g, '') || 'other';

  return (
    <div 
      className="card border shadow-sm h-100 artwork-card-hover"
      onClick={handleCardClick}
      style={{ 
        minWidth,
        maxWidth,
        cursor: 'pointer'
      }}
    >
      <div className="position-relative artwork-image-wrapper">
        <img
          src={getPrimaryImage(artwork)}
          alt={artwork.title || 'Artwork'}
          className="artwork-image-zoom"
          style={{ 
            width: '100%',
            height: '180px',
            objectFit: 'cover',
            display: 'block'
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300/CCCCCC/FFFFFF?text=No+Image';
          }}
        />
        {onLikeClick && (
          <button 
            className="btn btn-sm position-absolute top-0 end-0 m-2 rounded-pill"
            onClick={handleLikeClick}
            disabled={isLiking}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              color: '#dc3545',
              pointerEvents: 'auto'
            }}
          >
            <i className="bi bi-heart-fill me-1"></i>
            {getLikesCount(artwork)}
          </button>
        )}
      </div>
      
      <div className="card-body p-3">
        <h5 className="card-title fw-bold mb-2">{artwork.title || 'Untitled'}</h5>
        <p className="text-muted small mb-2">by {artwork.artist?.name || 'Unknown Artist'}</p>
        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-bold text-primary">${artwork.price?.toLocaleString() || '0'}</span>
          <span className={`badge bg-secondary-subtle text-dark medium-${mediumClass}`}>
            {artwork.medium || 'Other'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;


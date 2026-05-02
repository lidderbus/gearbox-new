// src/components/OutlineDrawingQuery/FavoriteButton.js
// Favorite toggle button component
import React from 'react';
import { Button } from 'react-bootstrap';
import { isFavorite } from '../../utils/favorites';

/**
 * Favorite button component
 */
const FavoriteButton = ({ model, type, onToggle, size = 'sm' }) => {
  const favorited = isFavorite(model);

  return (
    <Button
      variant={favorited ? 'warning' : 'outline-secondary'}
      size={size}
      onClick={(e) => onToggle(model, type, e)}
      title={favorited ? `取消收藏 ${model}` : `添加收藏 ${model}`}
      aria-label={favorited ? `取消收藏 ${model}` : `收藏 ${model}`}
      aria-pressed={favorited}
      className="ms-2"
      style={{ padding: '2px 6px' }}
    >
      <i className={`bi ${favorited ? 'bi-star-fill' : 'bi-star'}`} aria-hidden="true"></i>
    </Button>
  );
};

export default FavoriteButton;

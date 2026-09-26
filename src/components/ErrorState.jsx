import React from 'react';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="error-card">
      <div className="error-card-header">
        <span className="error-icon">⚠️</span>
        <h4 className="error-title">Unable to generate itinerary</h4>
      </div>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button
          type="button"
          className="btn-retry"
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
    </div>
  );
}

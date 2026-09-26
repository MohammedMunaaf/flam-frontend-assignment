import React from 'react';

export default function LoadingState({ message = 'Generating your customized itinerary...' }) {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-message">{message}</p>
      <span className="loading-subtext">Structuring days and stops with Gemini</span>
    </div>
  );
}

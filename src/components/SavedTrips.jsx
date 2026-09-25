import React, { useState } from 'react';

export default function SavedTrips({ savedTrips, onLoadTrip, onDeleteTrip }) {
  const [isOpen, setIsOpen] = useState(false);

  if (savedTrips.length === 0) {
    return null;
  }

  return (
    <div className="saved-trips-container">
      <div
        className="saved-trips-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="saved-trips-header-left">
          <span className="saved-trips-icon">📁</span>
          <h3 className="saved-trips-title">Saved Itineraries</h3>
          <span className="saved-trips-count">{savedTrips.length}</span>
        </div>
        <button
          type="button"
          className="btn-toggle"
          aria-label={isOpen ? 'Collapse Saved Trips' : 'Expand Saved Trips'}
        >
          {isOpen ? 'Hide' : 'Show'}
        </button>
      </div>

      {isOpen && (
        <div className="saved-trips-list">
          {savedTrips.map((trip) => (
            <div key={trip.id} className="saved-trip-item">
              <div className="saved-trip-info">
                <h4 className="saved-trip-name">{trip.title}</h4>
                <div className="saved-trip-meta">
                  <span>{trip.itinerary.days.length} days</span>
                  <span>•</span>
                  <span>Saved on {trip.savedAt}</span>
                </div>
                {trip.prompt && (
                  <p className="saved-trip-prompt">"{trip.prompt}"</p>
                )}
              </div>
              <div className="saved-trip-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => onLoadTrip(trip)}
                >
                  Load
                </button>
                <button
                  type="button"
                  className="btn-danger-outline"
                  onClick={() => onDeleteTrip(trip.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

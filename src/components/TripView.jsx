import React from 'react';
import DayCard from './DayCard.jsx';

export default function TripView({ itinerary, onRemoveStop, onMoveStop, onSaveTrip, isSaved }) {
  if (!itinerary || !itinerary.days) {
    return null;
  }

  const totalStops = itinerary.days.reduce(
    (total, day) => total + (day.stops ? day.stops.length : 0),
    0
  );

  return (
    <div className="trip-view">
      <div className="trip-banner">
        <div className="trip-banner-main">
          <h2 className="trip-title">{itinerary.title}</h2>
          {itinerary.summary && (
            <p className="trip-summary">{itinerary.summary}</p>
          )}
        </div>
        <div className="trip-actions-group">
          <div className="trip-stats">
            <div className="stat-pill">
              <span className="stat-number">{itinerary.days.length}</span>
              <span className="stat-label">Days</span>
            </div>
            <div className="stat-pill">
              <span className="stat-number">{totalStops}</span>
              <span className="stat-label">Stops</span>
            </div>
          </div>
          <button
            type="button"
            className={isSaved ? 'btn-saved' : 'btn-save'}
            onClick={onSaveTrip}
          >
            {isSaved ? '✓ Saved' : 'Save Trip'}
          </button>
        </div>
      </div>

      <div className="days-list">
        {itinerary.days.map((day) => (
          <DayCard
            key={day.day}
            day={day}
            onRemoveStop={onRemoveStop}
            onMoveStop={onMoveStop}
          />
        ))}
      </div>
    </div>
  );
}

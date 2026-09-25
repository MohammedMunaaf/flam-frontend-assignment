import React, { useState } from 'react';
import StopCard from './StopCard.jsx';

export default function DayCard({ day, onRemoveStop, onMoveStop }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="day-card">
      <div
        className="day-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="day-title-info">
          <span className="day-badge">Day {day.day}</span>
          <h3 className="day-title">{day.title}</h3>
        </div>
        <div className="day-meta">
          <span className="day-count-badge">
            {day.stops.length} {day.stops.length === 1 ? 'stop' : 'stops'}
          </span>
          <button
            type="button"
            className="btn-toggle"
            aria-label={isExpanded ? 'Collapse Day' : 'Expand Day'}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="day-body">
          {day.stops.length === 0 ? (
            <p className="empty-day-text">No stops remaining for this day.</p>
          ) : (
            <div className="stops-list">
              {day.stops.map((stop, stopIndex) => (
                <StopCard
                  key={stop.id}
                  stop={stop}
                  stopIndex={stopIndex}
                  totalStops={day.stops.length}
                  onRemove={(stopId) => onRemoveStop(day.day, stopId)}
                  onMove={(currentIndex, direction) => onMoveStop(day.day, currentIndex, direction)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

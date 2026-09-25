import React from 'react';

export default function StopCard({ stop, stopIndex, totalStops, onRemove, onMove }) {
  return (
    <div className="stop-card">
      <div className="stop-header">
        <div className="stop-title-group">
          <span className="stop-number">{stopIndex + 1}</span>
          <h4 className="stop-name">{stop.name}</h4>
        </div>
        <span className="stop-duration">{stop.duration}</span>
      </div>

      <p className="stop-description">{stop.description}</p>

      <div className="stop-actions">
        <button
          type="button"
          className="btn-icon"
          title="Move Up"
          disabled={stopIndex === 0}
          onClick={() => onMove(stopIndex, -1)}
        >
          ▲
        </button>
        <button
          type="button"
          className="btn-icon"
          title="Move Down"
          disabled={stopIndex === totalStops - 1}
          onClick={() => onMove(stopIndex, 1)}
        >
          ▼
        </button>
        <button
          type="button"
          className="btn-danger-outline"
          onClick={() => onRemove(stop.id)}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

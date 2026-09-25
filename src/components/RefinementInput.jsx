import React, { useState } from 'react';

export default function RefinementInput({ onRefine, loading }) {
  const [instruction, setInstruction] = useState('');

  const suggestions = [
    'Add more local food and street food spots',
    'Make the schedule more relaxed with fewer stops',
    'Focus more on photography and scenic viewpoints'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!instruction.trim() || loading) return;
    onRefine(instruction);
    setInstruction('');
  };

  return (
    <div className="refinement-container">
      <div className="refinement-header">
        <h3 className="refinement-title">Refine This Itinerary</h3>
        <p className="refinement-subtitle">
          Want to change pace, add food stops, or adjust activities? Tell the AI what to update while keeping the rest.
        </p>
      </div>

      <form className="refinement-form" onSubmit={handleSubmit}>
        <div className="refinement-input-row">
          <input
            type="text"
            className="refinement-input"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="e.g. Add more food places and reduce travel time"
            disabled={loading}
          />
          <button
            type="submit"
            className="btn-accent"
            disabled={loading || !instruction.trim()}
          >
            {loading ? 'Refining...' : 'Refine Trip'}
          </button>
        </div>

        <div className="suggestions-container">
          <span className="suggestions-label">Quick adjustments:</span>
          <div className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="suggestion-chip"
                onClick={() => setInstruction(suggestion)}
                disabled={loading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}

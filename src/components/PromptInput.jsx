import React from 'react';

export default function PromptInput({ prompt, setPrompt, onSubmit, loading }) {
  const suggestions = [
    '3-day trip to Hyderabad for history and food lovers',
    '2-day cultural tour of Jaipur exploring forts and palaces',
    'Weekend getaway to Goa focused on beaches and seafood'
  ];

  return (
    <form className="prompt-form" onSubmit={onSubmit}>
      <label className="prompt-label" htmlFor="trip-prompt">
        Where do you want to go?
      </label>
      <textarea
        id="trip-prompt"
        className="prompt-textarea"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={3}
        placeholder="e.g. Plan a 3-day trip to Hyderabad for someone interested in food, history and photography."
      />

      <div className="suggestions-container">
        <span className="suggestions-label">Try:</span>
        <div className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className="suggestion-chip"
              onClick={() => setPrompt(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={loading || !prompt.trim()}
      >
        {loading ? 'Generating Itinerary...' : 'Generate Itinerary'}
      </button>
    </form>
  );
}

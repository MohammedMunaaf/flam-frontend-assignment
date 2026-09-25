import React, { useState } from 'react';
import { generateTrip } from './lib/api.js';

export default function App() {
  const [prompt, setPrompt] = useState('3-day trip to Hyderabad for history and food lovers');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [itinerary, setItinerary] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await generateTrip(prompt);
      setItinerary(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">AI Trip Planner</h1>
        <p className="app-subtitle">
          Plan your customized travel itinerary with AI-powered structure.
        </p>
      </header>

      <form className="prompt-form" onSubmit={handleGenerate}>
        <label className="prompt-label" htmlFor="trip-prompt">
          Trip Description
        </label>
        <textarea
          id="trip-prompt"
          className="prompt-textarea"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          placeholder="e.g. Plan a 3-day trip to Hyderabad for someone interested in food, history and photography."
        />
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Generating Itinerary...' : 'Generate Itinerary'}
        </button>
      </form>

      {itinerary && (
        <div className='success-banner'>
          <strong>Itinerary: </strong>{itinerary.title}
          <p>Response Generated Successfully, Please have a look in the console.</p>
        </div>
      )}

      {error && (
        <div className="error-banner">
          <strong>Error: </strong>{error}
        </div>
      )}
    </div>
  );
}

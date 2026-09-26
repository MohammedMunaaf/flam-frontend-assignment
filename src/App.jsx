import React, { useState, useEffect, useRef } from 'react';
import { generateTrip, refineTrip } from './lib/api.js';
import { loadSavedTrips, saveTrip, deleteTrip } from './lib/storage.js';
import PromptInput from './components/PromptInput.jsx';
import TripView from './components/TripView.jsx';
import RefinementInput from './components/RefinementInput.jsx';
import SavedTrips from './components/SavedTrips.jsx';
import LoadingState from './components/LoadingState.jsx';
import ErrorState from './components/ErrorState.jsx';

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('trip_planner_theme') || 'dark');
  const [prompt, setPrompt] = useState('3-day trip to Hyderabad for history and food lovers');
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [error, setError] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [savedTrips, setSavedTrips] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  const requestIdRef = useRef(0);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('trip_planner_theme', theme);
  }, [theme]);

  useEffect(() => {
    setSavedTrips(loadSavedTrips());
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleGenerate = async (e) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    const currentRequestId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    setIsSaved(false);

    try {
      const data = await generateTrip(prompt);
      if (currentRequestId !== requestIdRef.current) return;
      setItinerary(data);
    } catch (err) {
      if (currentRequestId !== requestIdRef.current) return;
      setError(err.message);
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  const handleRefine = async (instruction) => {
    if (!itinerary) return;

    const currentRequestId = ++requestIdRef.current;
    setRefining(true);
    setError(null);
    setIsSaved(false);

    try {
      const updatedData = await refineTrip(itinerary, instruction);
      if (currentRequestId !== requestIdRef.current) return;
      setItinerary(updatedData);
    } catch (err) {
      if (currentRequestId !== requestIdRef.current) return;
      setError(err.message);
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setRefining(false);
      }
    }
  };

  const handleRemoveStop = (dayNumber, stopId) => {
    setItinerary((prev) => {
      if (!prev) return prev;
      const updatedDays = prev.days.map((day) => {
        if (day.day !== dayNumber) return day;
        return {
          ...day,
          stops: day.stops.filter((stop) => stop.id !== stopId)
        };
      });
      return { ...prev, days: updatedDays };
    });
    setIsSaved(false);
  };

  const handleMoveStop = (dayNumber, currentIndex, direction) => {
    setItinerary((prev) => {
      if (!prev) return prev;
      const updatedDays = prev.days.map((day) => {
        if (day.day !== dayNumber) return day;
        const targetIndex = currentIndex + direction;
        if (targetIndex < 0 || targetIndex >= day.stops.length) return day;
        const newStops = [...day.stops];
        const [movedStop] = newStops.splice(currentIndex, 1);
        newStops.splice(targetIndex, 0, movedStop);
        return {
          ...day,
          stops: newStops
        };
      });
      return { ...prev, days: updatedDays };
    });
    setIsSaved(false);
  };

  const handleSaveTrip = () => {
    if (!itinerary) return;
    try {
      const updatedList = saveTrip(prompt, itinerary);
      setSavedTrips(updatedList);
      setIsSaved(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLoadTrip = (savedSession) => {
    setPrompt(savedSession.prompt || '');
    setItinerary(savedSession.itinerary);
    setError(null);
    setIsSaved(true);
  };

  const handleDeleteTrip = (tripId) => {
    const updatedList = deleteTrip(tripId);
    setSavedTrips(updatedList);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-top-row">
          <div>
            <h1 className="app-title">AI Trip Planner</h1>
            <p className="app-subtitle">
              Plan your customized travel itinerary with AI-powered structure.
            </p>
          </div>
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </header>

      <SavedTrips
        savedTrips={savedTrips}
        onLoadTrip={handleLoadTrip}
        onDeleteTrip={handleDeleteTrip}
      />

      <PromptInput
        prompt={prompt}
        setPrompt={setPrompt}
        onSubmit={handleGenerate}
        loading={loading || refining}
      />

      {error && (
        <ErrorState
          message={error}
          onRetry={handleGenerate}
        />
      )}

      {loading && (
        <LoadingState
          message="Generating your structured itinerary..."
        />
      )}

      {!loading && !itinerary && !error && (
        <div className="empty-state">
          <div className="empty-state-icon">🗺️</div>
          <h3 className="empty-state-title">No Itinerary Yet</h3>
          <p className="empty-state-desc">
            Describe your dream trip or pick one of the quick suggestions above to generate an interactive day-by-day plan.
          </p>
        </div>
      )}

      {!loading && itinerary && (
        <>
          <TripView
            itinerary={itinerary}
            onRemoveStop={handleRemoveStop}
            onMoveStop={handleMoveStop}
            onSaveTrip={handleSaveTrip}
            isSaved={isSaved}
          />

          <RefinementInput
            onRefine={handleRefine}
            loading={refining}
          />
        </>
      )}
    </div>
  );
}

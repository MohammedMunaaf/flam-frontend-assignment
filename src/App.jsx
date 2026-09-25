import React, { useState, useEffect } from 'react';
import { generateTrip, refineTrip } from './lib/api.js';
import { loadSavedTrips, saveTrip, deleteTrip } from './lib/storage.js';
import PromptInput from './components/PromptInput.jsx';
import TripView from './components/TripView.jsx';
import RefinementInput from './components/RefinementInput.jsx';
import SavedTrips from './components/SavedTrips.jsx';

export default function App() {
  const [prompt, setPrompt] = useState('3-day trip to Hyderabad for history and food lovers');
  const [loading, setLoading] = useState(false);
  const [refining, setRefining] = useState(false);
  const [error, setError] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [savedTrips, setSavedTrips] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setSavedTrips(loadSavedTrips());
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setIsSaved(false);

    try {
      const data = await generateTrip(prompt);
      setItinerary(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = async (instruction) => {
    if (!itinerary) return;

    setRefining(true);
    setError(null);
    setIsSaved(false);

    try {
      const updatedData = await refineTrip(itinerary, instruction);
      setItinerary(updatedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setRefining(false);
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
        <h1 className="app-title">AI Trip Planner</h1>
        <p className="app-subtitle">
          Plan your customized travel itinerary with AI-powered structure.
        </p>
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
        loading={loading}
      />

      {error && (
        <div className="error-banner">
          <strong>Error: </strong>{error}
        </div>
      )}

      {itinerary && (
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

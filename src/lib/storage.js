const STORAGE_KEY = 'ai_trip_planner_saved_trips';

export function loadSavedTrips() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item) => (
      item &&
      typeof item === 'object' &&
      item.id &&
      item.itinerary &&
      item.itinerary.days
    ));
  } catch {
    return [];
  }
}

export function saveTrip(prompt, itinerary) {
  if (!itinerary || !itinerary.days) {
    throw new Error('Cannot save an empty or invalid itinerary.');
  }

  const existingTrips = loadSavedTrips();
  const newTrip = {
    id: `trip_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: itinerary.title || 'Custom Trip',
    prompt: prompt || '',
    itinerary,
    savedAt: new Date().toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),
    timestamp: Date.now()
  };

  const updatedTrips = [newTrip, ...existingTrips.filter((t) => t.title !== newTrip.title)].slice(0, 10);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrips));
    return updatedTrips;
  } catch {
    throw new Error('Failed to save itinerary to local storage.');
  }
}

export function deleteTrip(tripId) {
  const existingTrips = loadSavedTrips();
  const updatedTrips = existingTrips.filter((t) => t.id !== tripId);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTrips));
    return updatedTrips;
  } catch {
    return existingTrips;
  }
}

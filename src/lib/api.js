import { validateTripResult } from './validateResult.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function generateTrip(prompt, signal) {
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    throw new Error('Please enter a trip description.');
  }

  const response = await fetch(`${API_URL}/api/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt: prompt.trim() }),
    signal
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate itinerary.');
  }

  return validateTripResult(data);
}

export async function refineTrip(currentItinerary, instruction, signal) {
  if (!currentItinerary || !Array.isArray(currentItinerary.days)) {
    throw new Error('An existing valid itinerary is required to perform refinement.');
  }

  if (!instruction || typeof instruction !== 'string' || !instruction.trim()) {
    throw new Error('Please provide a refinement instruction.');
  }

  const response = await fetch(`${API_URL}/api/refine`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      currentItinerary,
      instruction: instruction.trim()
    }),
    signal
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to refine itinerary.');
  }

  return validateTripResult(data);
}

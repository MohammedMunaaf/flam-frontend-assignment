import { validateTripResult } from './validateResult.js';

export async function generateTrip(prompt, signal) {
  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    throw new Error('Please enter a trip description.');
  }

  const response = await fetch('/api/generate', {
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

  const result = validateTripResult(data);
  console.log(result);
  return result;
}

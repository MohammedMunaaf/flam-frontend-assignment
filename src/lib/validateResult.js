export function validateTripResult(rawInput) {
  if (!rawInput) {
    throw new Error('Received an empty response from the server.');
  }

  let data = rawInput;
  if (typeof rawInput === 'string') {
    try {
      data = JSON.parse(rawInput);
    } catch {
      throw new Error('The AI model returned malformed JSON that could not be parsed.');
    }
  }

  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new Error('Invalid itinerary format: response is not a valid JSON object.');
  }

  if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
    throw new Error('Invalid itinerary format: missing or empty trip title.');
  }

  if (!Array.isArray(data.days) || data.days.length === 0) {
    throw new Error('Invalid itinerary format: trip must contain at least one day.');
  }

  const validatedDays = data.days.map((dayItem, dayIndex) => {
    if (typeof dayItem !== 'object' || dayItem === null || Array.isArray(dayItem)) {
      throw new Error(`Invalid format for Day ${dayIndex + 1}: expected an object.`);
    }

    const dayNumber = Number(dayItem.day) || dayIndex + 1;
    const dayTitle = typeof dayItem.title === 'string' && dayItem.title.trim()
      ? dayItem.title.trim()
      : `Day ${dayNumber}`;

    if (!Array.isArray(dayItem.stops) || dayItem.stops.length === 0) {
      throw new Error(`Day ${dayNumber} does not have any itinerary stops.`);
    }

    const validatedStops = dayItem.stops.map((stopItem, stopIndex) => {
      if (typeof stopItem !== 'object' || stopItem === null || Array.isArray(stopItem)) {
        throw new Error(`Invalid stop format at Day ${dayNumber}, Stop ${stopIndex + 1}.`);
      }

      if (!stopItem.name || typeof stopItem.name !== 'string' || !stopItem.name.trim()) {
        throw new Error(`Stop ${stopIndex + 1} on Day ${dayNumber} is missing a name.`);
      }

      const description = typeof stopItem.description === 'string' && stopItem.description.trim()
        ? stopItem.description.trim()
        : 'Explore and enjoy this location.';

      const duration = typeof stopItem.duration === 'string' && stopItem.duration.trim()
        ? stopItem.duration.trim()
        : '1 - 2 hours';

      const stopId = stopItem.id && typeof stopItem.id === 'string'
        ? stopItem.id
        : `day-${dayNumber}-stop-${stopIndex}-${Math.random().toString(36).substring(2, 9)}`;

      return {
        id: stopId,
        name: stopItem.name.trim(),
        description,
        duration
      };
    });

    return {
      day: dayNumber,
      title: dayTitle,
      stops: validatedStops
    };
  });

  return {
    title: data.title.trim(),
    summary: typeof data.summary === 'string' ? data.summary.trim() : '',
    days: validatedDays
  };
}

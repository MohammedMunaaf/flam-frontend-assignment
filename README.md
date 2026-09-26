# AI Trip Planner

A React app that takes a free-form travel request, sends it to Google Gemini, and turns the structured JSON response into an interactive day-by-day itinerary.

Built as part of the Flam Frontend Internship Assignment.



## What it does

You type something like "Plan a 3-day trip to Hyderabad for history and food lovers" and hit Generate. The app sends that to the backend, which calls Gemini with a strict JSON prompt. The response is validated before it ever touches the UI, then rendered as an interactive itinerary where you can:

- Expand or collapse individual days
- Move stops up or down within a day
- Remove stops you don't want
- Refine the itinerary with a follow-up instruction (e.g. "add more street food stops")
- Save and reload itineraries across sessions using localStorage
- Toggle between dark and light mode



## Tech stack

- React (hooks, functional components)
- Vite (dev server + build)
- Express (backend proxy that holds the API key)
- Google Gemini API (`@google/generative-ai`)
- Plain CSS (no UI framework)


## Project structure

```
├── server/
│   └── server.js          # Express backend — holds the API key, calls Gemini
├── src/
│   ├── components/
│   │   ├── PromptInput.jsx
│   │   ├── TripView.jsx
│   │   ├── DayCard.jsx
│   │   ├── StopCard.jsx
│   │   ├── RefinementInput.jsx
│   │   ├── SavedTrips.jsx
│   │   ├── LoadingState.jsx
│   │   └── ErrorState.jsx
│   ├── lib/
│   │   ├── api.js           # Frontend API helpers (never calls Gemini directly)
│   │   ├── validateResult.js  # Validates AI response shape before rendering
│   │   └── storage.js       # localStorage utilities for save/reload
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── vite.config.js
└── package.json
```


## Setup

### 1. Clone the repo and install dependencies

```bash
git clone <your-repo-url>
cd flam-frontend-assignment
npm install
```

### 2. Create a `.env` file

```bash
cp .env.example .env
```

Open `.env` and fill in your Gemini API key:

```
PORT=5000
GEMINI_API_KEY=your_key_here
```

You can get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 3. Run the app

```bash
npm start
```

This starts both the Express backend (port 5000) and the Vite dev server (port 5173) together using `concurrently`.

Open `http://localhost:5173` in your browser.



## How the AI integration works

The frontend never calls Gemini directly. All requests go through the Express backend at `/api/generate` and `/api/refine`. The backend holds the `GEMINI_API_KEY` in its environment and uses it to call the Gemini API.

The prompt instructs Gemini to return **only valid JSON** matching a specific shape:

```json
{
  "title": "string",
  "summary": "string",
  "days": [
    {
      "day": 1,
      "title": "string",
      "stops": [
        {
          "name": "string",
          "description": "string",
          "duration": "string"
        }
      ]
    }
  ]
}
```

The backend strips any markdown formatting Gemini might add, parses the JSON, and sends it to the frontend.


## Validation

`src/lib/validateResult.js` checks the response before it is ever used in the UI:

- Response must exist and not be empty
- Must be valid JSON (caught with try/catch)
- Must be an object with a non-empty `title`
- `days` must be a non-empty array
- Each day must have `day`, `title`, and a non-empty `stops` array
- Each stop must have a non-empty `name`
- Missing optional fields (`description`, `duration`) are filled with safe defaults
- Each stop gets a generated `id` for React keying and removal tracking

If any of these checks fail, an error is thrown and the error state is shown instead of trying to render broken data.


## Error handling

Every failure mode has an explicit UI state:

| Scenario | Behaviour |
|---|---|
| Empty user input | Button stays disabled |
| Network / API failure | ErrorState shown with a Retry button |
| Malformed JSON from AI | Caught in validateResult, shows error |
| Wrong shape from AI | Caught in validateResult, shows error |
| Empty AI response | Caught on the backend, returns 502 |
| Slow request | LoadingState shown, no silent hang |
| Stale response | `useRef` request ID counter prevents older requests from overwriting newer results |


## Refinement loop

After an itinerary is generated, a Refinement section appears below. You can type an instruction like "add more local food stops" and the app sends both the current itinerary and the instruction to `/api/refine`. The backend tells Gemini to modify only what was asked and keep everything else the same. The refined result goes through the same validation pipeline.


## Save and reload

Itineraries are saved to `localStorage`. The saved data includes the original prompt, the full itinerary, and the date saved. Corrupted or invalid localStorage data is handled with a try/catch that returns an empty array instead of crashing.

Up to 10 trips can be saved. Saving the same trip title again replaces the old entry.


## AI usage note

Gemini was used as the AI service for generating and refining trip itineraries. AI assistance was also used during development for implementation support, debugging, and reviewing parts of the code.

The final implementation, architecture, validation flow, UI behaviour, and feature decisions were reviewed and tested as part of the project.


## Known limitations

* The Gemini model can be changed in the backend based on model availability, performance, or project requirements. The app is currently configured to use `gemini-3.1-flash-lite`.

* Refinement replaces the entire itinerary — it doesn't do surgical edits. It sends the whole current state and gets a new complete itinerary back.

* Saved trips are stored in browser `localStorage` so they don't sync across devices.


## Deployment

The application is deployed with the frontend and backend configured separately. The Gemini API key is stored as an environment variable on the backend and is not exposed to the frontend.

**Live demo:** https://trip-planner-frontend-virid-psi.vercel.app/

**Backend:** Render | **Frontend:** Vercel



## Time spent

Approximately 7–8 hours in total, independent of the timestamps shown in GitHub commits:

* Project setup, backend proxy, and Gemini integration
* Response parsing and validation pipeline
* Core interactive UI (day cards, stop cards, reorder, remove)
* Refinement loop
* Save/reload sessions
* Loading, error, and empty states + stale request guard
* Dark/light mode and final polish
* Deployment
* README


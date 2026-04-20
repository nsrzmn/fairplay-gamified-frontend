
  # FairPlay Tracker Dashboard

  This is a code bundle for FairPlay Tracker Dashboard. The original project is available at https://www.figma.com/design/zAAy3qN77gPgV65mzZtUI3/FairPlay-Tracker-Dashboard.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Railway deployment

  This frontend is configured to call the backend through `/api` and proxy that path from the Railway frontend service to your backend service using Railway private networking.

  ### Build command

  ```bash
  npm run build
  ```

  ### Start command

  ```bash
  npm run start
  ```

  ### Required Railway variable

  ```bash
  BACKEND_INTERNAL_URL=http://fairplay-gamified-backend.railway.internal
  ```

  ### Optional Railway variable

  ```bash
  VITE_GAME_URL=https://fairplay-gamified-game-production.up.railway.app
  ```

  When `VITE_GAME_URL` is set, the sidebar shows a `Play Game` button that opens the hosted game in a new tab.

  Notes:
  - Keep frontend API calls on `/api` (already configured in `src/services/api.ts`).
  - Do not set `VITE_API_URL` on Railway unless you intentionally want browser-direct calls.
  - Set `VITE_GAME_URL` only to a public URL because it is exposed to the browser bundle.
  - For local dev, Vite proxies `/api` to `http://localhost:8000` by default.

  ## Settings and Responsiveness

  - The Settings page supports fairness threshold tuning and per-metric fairness weights.
  - The Data tab includes a `Recompute Historical Fairness` action to apply current weights to previous sessions.
  - The Monitoring tab Tracking Interval now actively controls dashboard polling cadence for overview, sessions, and live alerts.
  - The frontend refreshes runtime settings periodically, so interval changes apply without reloading the page.
  - Mobile optimization includes:
    - responsive spacing/layout updates,
    - mobile tab navigation,
    - horizontal overflow handling for wide tables.
  
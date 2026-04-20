
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
  
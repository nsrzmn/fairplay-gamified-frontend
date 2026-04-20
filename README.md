
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

  Notes:
  - Keep frontend API calls on `/api` (already configured in `src/services/api.ts`).
  - Do not set `VITE_API_URL` on Railway unless you intentionally want browser-direct calls.
  - For local dev, Vite proxies `/api` to `http://localhost:8000` by default.
  
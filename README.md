
  # Alpha Tester Invitation Page

  This is a code bundle for Alpha Tester Invitation Page. The original project is available at https://www.figma.com/design/Q3Cxoun5nt1sYPX1c0ET3c/Alpha-Tester-Invitation-Page.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Deploy base path (fixes “white screen”)

  If the deployed site loads as a blank white page, it usually means the built
  `dist/index.html` is pointing at the wrong asset URLs (e.g. `/assets/...` when
  the site is actually served under `/repo/`).

  This project defaults to **relative** asset URLs for `npm run build`. If you
  need a fixed base path, set `VITE_BASE` for the build:

  - GitHub Pages repo site: `VITE_BASE=/your-repo/`
  - Custom domain at root: `VITE_BASE=/`

  ## Firebase (Firestore) form submissions

  The signup form writes to Firestore collection `signups`.

  ### Local development

  Create `.env.local` with:

  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`

  You can copy the keys from `.env.example`.

  ### GitHub Actions (GitHub Pages)

  Add the same keys as GitHub repo secrets (Settings → Secrets and variables → Actions → New repository secret):

  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`

  The workflow in `.github/workflows/deploy.yml` injects these secrets into the `npm run build` step.

  ### Firestore security rules (recommended)

  Because this site is public, you should lock down Firestore so clients can only create a signup document (no listing/reading).

  Example rules (Firebase Console → Firestore → Rules):

  ```txt
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /signups/{docId} {
        allow create: if request.resource.data.keys().hasOnly([
          "fullName","email","inviteCode","gender","dateOfBirth",
          "livesInLondon","deviceType","osVersion","consent","submittedAt"
        ])
        && request.resource.data.fullName is string
        && request.resource.data.email is string
        && request.resource.data.inviteCode is string
        && request.resource.data.gender is string
        && request.resource.data.dateOfBirth is string
        && request.resource.data.livesInLondon is bool
        && request.resource.data.deviceType is string
        && request.resource.data.osVersion is string
        && request.resource.data.consent is bool;

        allow read, update, delete: if false;
      }
    }
  }
  ```
  

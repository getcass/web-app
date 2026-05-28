
  # Cass Web App

  This is the public Cass web app, including the landing page, Terms, Privacy Policy, and related static pages.

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

  ## Public access copy

  The public web app points users to the mobile app waitlist. It intentionally does not include a signup form or client-side account submission path; account creation happens in the mobile app.
  

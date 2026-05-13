
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

  ## Closed alpha intake

  The private alpha intake is closed. This web app intentionally does not include a signup form, client invite-code list, or client-side submission path.
  

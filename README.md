# Mrityunjay Gupta — Portfolio website

Source code for a ten-page personal portfolio with project narratives, research figures, videos, recognitions, music, and community work.

## Local setup

The repository includes the source code and complete `public/` folder: images, videos, fonts, logos, generated pages, and linked research documents. No separate asset-copy step is required.

```sh
npm ci
npm run build
npm run check
npm run dev
```

Open http://127.0.0.1:4173. The build generates the complete site in `dist/`; use `dist` as the deployment output directory.

## Source files

- `src/site.mjs`: page shell, homepage, navigation, recognitions, and sources.
- `src/narratives.mjs`: project, research, work, music, and community content.
- `src/visuals.mjs`: AmbuGo interface prototypes and photo layouts.
- `src/layout.css`: current editorial layout and text emphasis.
- Other `src/*.css`: template components, responsive styling, and Penn navy/crimson colours.
- `build.mjs`, `check.mjs`, `serve.mjs`: static generation, validation, and local server.

The public assets include the supporting documents and media linked by the portfolio.

## Portfolio access

Vercel Routing Middleware checks the shared portfolio password before serving pages, documents, images, or videos. The local server uses the same check. Only the fonts needed by the access screen are available before login. Successful login keeps an HttpOnly session cookie until the browser session ends; `/_portfolio/lock` clears it.

`access-config.mjs` contains a salted PBKDF2 verifier. Neither the password nor the browser credential is stored in source or browser JavaScript. The access screen tells visitors to use the password supplied alongside the website link in the Additional Information section.

Run `npm test` for the access checks. Set `PORTFOLIO_TEST_PASSWORD` locally to exercise successful login too. Authentication runs on Vercel or with `npm run dev`; serving `dist` from an ordinary static server does not run the access check. The public GitHub repository remains separately accessible.

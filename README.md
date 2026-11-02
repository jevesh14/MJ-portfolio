# Mrityunjay Gupta — Portfolio website

Source code for a dependency-free, ten-page personal portfolio with project narratives, research figures, videos, recognitions, music, and community work.

## Local setup

The repository contains the source and build configuration. The runtime asset collection is kept separately in the local `public/` folder. Copy that folder from the working portfolio before running the full preview or validation. It includes images, videos, fonts, logos, and linked research documents.

```sh
npm run build
npm run check
npm run dev
```

Open http://127.0.0.1:4173. Deploy the generated `dist/` directory to a static host after supplying the intended public assets.

## Source files

- `src/site.mjs`: page shell, homepage, navigation, recognitions, and sources.
- `src/narratives.mjs`: project, research, work, music, and community content.
- `src/visuals.mjs`: AmbuGo interface prototypes and photo layouts.
- `src/layout.css`: current editorial layout and text emphasis.
- Other `src/*.css`: template components, responsive styling, and Penn navy/crimson colours.
- `build.mjs`, `check.mjs`, `serve.mjs`: static generation, validation, and local server.

Proof PDFs, institutional correspondence, and personal media are not part of this source-code upload.

# Mrityunjay Gupta — Portfolio website

Source code for a dependency-free, ten-page personal portfolio with project narratives, research figures, videos, recognitions, music, and community work.

## Local setup

The repository includes the source code and complete `public/` folder: images, videos, fonts, logos, generated pages, and linked research documents. No separate asset-copy step is required.

```sh
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

# Portfolio redesign — 5 November 2026

Penn navy and red remain the identifying colours, with an ivory page, Garamond headings, and system sans-serif text. Navigation, captions, and role/date metadata use a consistent smaller scale. Page titles have no generic introductory straplines.

Home uses the original ISEF photograph, two named demonstrations, a browsable recognition strip led by Diana/ISEF/Yau/Cambridge, and the existing correspondence links. Projects place technical evidence beside its explanation. Research gives figures a larger reading width. Work retains role/date information and paired demonstrations. Music retains the performance sequence, large Musica classroom photograph, and both Aashray images. Community leads with the Viking clap. Recognition uses document-like award rows. Media remains filterable, and the documents page remains an index.

Removed four superseded CSS layers and the spectacle-only motion script. Shared components are in src/style.css, compositions in src/layout.css. CSS decreased from 138,340 to 26,285 bytes. No new production dependency.

Validation: ten pages built; 690 local references and anchors passed; comparison found no removed content links or numeric values. DOM checks passed for menus, Escape, photo viewing, filters, and recognition controls. CSS parsed without syntax errors. Six access tests pass; successful-password test is skipped without its environment-provided password. Authentication logic is unchanged; only its screen styling and button wording changed.

Browser screenshot and rendered desktop/mobile inspection could not be completed: the connected browser supports only embedded apps and the local headless browser failed to launch. Responsive rules are implemented at 1080, 900, and 600 pixels, but real-browser visual verification remains outstanding.

## Image and typography refinement

Changed all visible text to EB Garamond, including navigation, captions, diagrams, tables, and the welcome screen. Added a warmer cream palette, a larger consistent portrait, direct demo introductions, and larger serif supporting text. References reviewed: farhan-haque.com and vidhimiglani.com.

Photographic galleries use equal 4:3 frames with subject-specific focal positions. The six original performance photographs were inspected together, followed by a diagnostic preview of the crops. Diagrams use consistent 16:10 contain frames; press clippings use 3:4 contain frames. Source files and full-size lightbox images remain unchanged.

Changed the Community navigation label to Students For Last-Mile Learning. Innovation & entrepreneurship now precedes Research awards, with the prior section IDs retained. Project and research accounts have content-specific subheadings. AmbuGo and PredictX have connected workflow diagrams based on their existing technical descriptions.

Ten-page build and 690-reference check pass. Six access tests pass; the successful-password test is skipped without its environment-provided password. DOM menu, viewer, filters, and ticker checks pass. CSS parsing and targeted ordering/label/diagram assertions pass. A full browser launch was attempted but is unavailable in this session; screenshot inspection of rendered pages remains outstanding.

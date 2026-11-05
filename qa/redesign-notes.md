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

## Content and evidence corrections

Restored the greeting in Penn blue with the exact text “Hi, I'm Mrityunjay!”, reduced the beige, enlarged the explanatory homepage heading and Diana correspondence text, and styled section-index links as outlined navigation buttons. Removed M&TSI from the moving recognition strip only.

Reworked project, research, and work descriptions into concise academic explanations, technical subheadings, selective bold emphasis, and method/result bullets. AmbuGo’s project account now includes driver override, progress-feedback results, matched simulations, traffic metrics and uncertainty intervals, and field deployment. Removed the duplicated research article while retaining its anchor as a link to the project. Added the override label to the driver-interface demonstration.

PredictX now has a separate Next steps section linking its CSR sanction and spirometry research. Renamed the professor-website navigation link. Showed the completed EcoFog mesh close-up alongside explicitly labelled early supports; removed white padding from the physical mesh photographs. The SFLML certificate uses its full uncropped aspect ratio.

Validation: ten-page build; 687 local references and anchors before adding the direct full-certificate source link; six passing access tests and one password-dependent skip; CSS syntax, DOM interactions, and targeted content assertions pass. Numeric values across the site were retained. The only removed navigation target was the duplicate research jump link; its destination anchor remains valid.

## Caption, wording and scrolling polish

Removed the control-board explanatory caption and its Prototype/sample-requests label. Standardized sentence-case starts after bullet labels and replaced EcoFog’s third material point with PLA’s hydrophobic drainage role. Combined the flagged short statements, rewrote the timbre conclusion, removed em dashes from the narrative text, and removed only from the compatibility-controls wording. Caption labels no longer end in periods, including image-viewer labels.

Removed the visible AmbuGo research cross-reference, with a hidden legacy anchor and redirect for existing links. Removed the youngest-intern phrase. Reduced EcoFog gallery width to 900px and supporting figures to at most 380px on desktop. The fixed Back to top link is initially hidden and appears after 400px of scrolling, with tested return-to-top hiding. DOM and targeted wording/caption/scroll checks pass; build and reference checks pass.

## Sentence flow, recognition order and certificate layout

Reviewed narrative paragraphs across Home, Projects, Research, Spirometry, Work, Music and Community, combining short standalone statements into connected explanations. The NHANES evaluation now describes participant-separated fitting and independent survey-cycle evaluation together. Factual award metadata, interface labels and captions remain concise. All prior numeric values and content links were retained.

Used the user’s exact PLA sentence. Reordered both the moving strip and recognition records to ISEF, S.-T. Yau, then Diana, and changed the portrait caption to At my booth at ISEF. Replaced the tall certificate row with a full, uncropped preview capped at 260px, a record summary and a direct full-size link; reduced inter-section spacing.

Ten-page build and 689-reference check pass. DOM controls, scrolling behaviour, CSS syntax, exact wording, both award orders, preserved numeric values/links and certificate-record markup pass. A prose audit finds no isolated sentences shorter than twelve words in the main narrative paragraphs, excluding metadata and interface labels.

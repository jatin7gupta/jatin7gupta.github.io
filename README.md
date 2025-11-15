## Poster-Style Landing

Art-directed, single-page landing for [jatin7gupta.github.io](https://jatin7gupta.github.io). Pure HTML/CSS/JS, tuned for GitHub Pages and performance-first delivery (no frameworks, no build step).

### Files
- `index.html` - sticky header, poster hero, identity switch, badges, one-liners, now list, contact strip, footer, SEO metadata, and Inter font link.
- `styles/main.css` - layout grid, oversized hero type, dark-mode variables, badge + chip styles, `.ring-orange` utility, button system, and reveal/focus states.
- `scripts/main.js` - theme toggle persistence, rotating hero word, identity modes, credibility badge swapping, reduced-motion aware signature tile, and section reveal observer.
- `images/monogram.svg` - orange-gradient JG mark for the header badge.

### Customize Copy & Interactions
1. **Rotating hero word** - edit the `WORDS` array in `scripts/main.js`. The interval (1500ms) and fade timing live in the same block. Reduced-motion users automatically see the static first word.
2. **Identity presets** - update the `MODES` object in `scripts/main.js`. Each entry controls the hero subline plus the three credibility badges. Buttons in `.switch` automatically reflect new labels and persist the last mode in `localStorage`.
3. **Credibility badges only** - if you prefer a static band, tweak the `<span class="badge">` text in `index.html` and remove the `MODES` entry you no longer need.
4. **Signature tile lines** - the SVG paths are generated in `drawSignature()` inside `scripts/main.js`. Adjust shape counts, palette, or stroke widths to change the composition.

### Visual System
- **Colors** - set via CSS variables in `:root` and `html.theme-dark`. Update `--bg`, `--surface`, `--text`, `--muted`, `--line`, and the single accent `--accent`. The gradient utility `.ring-orange` and the primary button both reference this accent.
- **Type scale** - hero size uses `clamp` in `.hero-title`. Supporting scales (chips, nav, one-liners) are in `styles/main.css` near their selectors for quick tuning.
- **Spacing rhythm** - all major sections inherit `padding` from the base `section` rule; adjust that clamp to expand or compress the poster whitespace.

### Accessibility & Motion
- Theme toggle is a button with `aria-pressed` and respects system preference when no explicit choice is stored.
- Animations (rotating word, signature parallax, reveal-on-scroll) disable automatically when `prefers-reduced-motion` is set; badges and one-liners simply render visible.
- Focus states rely on the high-contrast orange outline defined globally (`:focus-visible`), and chips/buttons keep generous hit targets.

### Development & Deploy
- Open `index.html` directly in a browser or run a lightweight server (for example `python -m http.server 8000`) for local testing.
- No tooling required; commit the updated static files and push to GitHub Pages. The included `favicon.ico` and optional `/images/og.jpg` are referenced automatically for social previews.

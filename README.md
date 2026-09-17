# v3ndettaaa / portfolio

A small, terminal-inspired portfolio with an ASCII wordmark, a monospace layout, and real GitHub projects. No framework, build step, or API key.

## Preview

```sh
python3 -m http.server 4173
```

Open http://localhost:4173.

## Live site

https://v3ndettaaa.github.io/ — served by GitHub Pages from the `main` branch root of this repository (`v3ndettaaa.github.io`). Deploy is branch-based, so pushing to `main` redeploys the site.

## Files

- `index.html`: layout, ASCII art, introduction, and contact link.
- `styles.css`: colors, typography, responsive layout, and reduced-motion support.
- `script.js`: GitHub data fetching, project rendering, and saved-data fallback.

## GitHub data

The page refreshes public profile counts and up to 100 repositories from the unauthenticated GitHub API. It excludes forks and the profile README repository. Four featured projects appear first, followed by other projects ordered by their last push date.

Requests time out after eight seconds. Network errors, API errors, and malformed responses use the saved snapshot from September 17, 2026. The page labels live versus saved data. Featured descriptions are curated from public project READMEs; remaining descriptions come from GitHub.

Without JavaScript, the introduction and contact sections remain available, with a link to all repositories. JetBrains Mono loads from Google Fonts with a system monospace fallback.

## Customize

Edit profile copy and contact links in `index.html`, palette variables in `styles.css`, and the username, saved data, featured order, and curated descriptions in `script.js`.

# lint.fish

Static personal site for **Linton Fisher**, DevOps / Cloud Engineer, intended for the apex `https://lint.fish`.

Plain HTML, CSS, and a little vanilla JavaScript. No build step, no bundler, no package manager. Suitable for [IONOS Deploy Now](https://www.ionos.com/hosting/deploy-now) (or any static host) by publishing this folder as-is.

## Structure

```
lint-fish-site/
  index.html      Home page (about, skills, experience, contact, and a collapsed CV request)
  thanks.html     Fallback “message sent” page for form posts when JavaScript is off
  404.html        Custom not-found page
  robots.txt      Allows crawlers
  favicon.svg     Inline-style SVG mark (terminal prompt)
  css/styles.css  Self-contained dark-only styles (system fonts, no light scheme)
  js/config.js    The one place to set the Web3Forms access key
  js/forms.js     Form fetch enhancement, plus opening the CV request details from #request-cv
  README.md       This file
```

## What you need to fill in before going live

1. **Web3Forms access key** — forms will not deliver until this is set.
   - Create a free key at [web3forms.com](https://web3forms.com). Point it at an alias you control (for example addy.io), not a public address on the site.
   - Edit the single config line in `js/config.js`:
     ```js
     window.SITE_CONFIG = { web3formsAccessKey: "53fc0ae6-0d06-44bd-a2fd-a49eabab4168" };
     ```
   - Also replace the same `53fc0ae6-0d06-44bd-a2fd-a49eabab4168` token in the two hidden `access_key` fields in `index.html`. That keeps the forms working when JavaScript is disabled. A project-wide search for the token will catch every occurrence.
2. **Redirect URL** (optional check) — both forms include `<input type="hidden" name="redirect" value="https://lint.fish/thanks.html">` for no-JS submissions. That is correct once the site is live on the apex. For local no-JS tests, Web3Forms needs a publicly reachable redirect URL.

Do not commit a real access key to a public repository if you can avoid it. If the repo will be public, prefer injecting the key at deploy time, or keep the placeholder in git and set the value only in the hosted copy.

## Forms

Both forms `POST` to `https://api.web3forms.com/submit`.

| Form         | Subject                    | Fields                         |
| ------------ | -------------------------- | ------------------------------ |
| Contact      | `lint.fish — Contact form` | name, email, message           |
| Request my CV| `lint.fish — CV request`   | name, company, email, role/reason |

The contact form is always visible. The CV request sits inside a native `<details>` element (summary: “Recruiter? Request my CV”), collapsed by default. Nav and footer links to `#request-cv` open it when JavaScript is available, and still scroll to it when it isn’t.

Each form has a hidden honeypot (`botcheck`). With JavaScript enabled, `js/forms.js` submits via `fetch` and shows a success or error message inline. Without JavaScript, the browser posts to Web3Forms normally and is redirected to `thanks.html`.

## Design

The site is dark-only: a near-black slate background with a faint grid, teal-to-violet glow, a small Terraform-style terminal in the hero, grouped skill cards, and a vertical experience timeline. There is no light colour scheme. Motion is CSS-only and is disabled when `prefers-reduced-motion` is set. No external fonts, CDNs, or trackers.

## Privacy

The site is built not to publish personal contact details or a CV file. There are no analytics, third-party trackers, external fonts, or CDNs. A short privacy note next to the forms states that submissions are used only to reply.

## Local preview

From this folder:

```bash
python3 -m http.server 8080
```

Then open <http://127.0.0.1:8080/>.

## Deploy notes

This folder is the site root. After the placeholders above are filled, push or upload it and point the `lint.fish` apex at the host. DNS, hosting, and publishing are intentionally out of scope of this folder.

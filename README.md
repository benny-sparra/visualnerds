# Visual Nerds — AI & VFX Studio

Official website for **Visual Nerds**, an AI film and VFX studio based near London, UK.
Live at [visualnerds.com](https://visualnerds.com) and [visualnerds.co.uk](https://visualnerds.co.uk).

**Made by nerds. Watched by everyone.**

---

## Brand

| Token | Value |
|---|---|
| Primary | Hot Pink `#FF2D88` |
| Secondary | Electric Blue `#00C2FF` · Acid Yellow `#FFE600` |
| Background | Ink `#0A0A0B` |
| Headlines | Syne 700 |
| Labels / UI | Space Mono |
| Body | DM Sans |

---

## Stack

Pure static site — HTML5 / CSS3 / Vanilla JS. No build tools, no frameworks, no dependencies beyond Google Fonts.

---

## Site Structure

```
/
├── index.html          ← Homepage (Hero · Reel · Quick Contact · Contact form)
├── about.html          ← About page
├── portfolio.html      ← Full work / project list
├── services.html       ← Services overview
├── contact.html        ← Contact form
├── faq.html            ← FAQ
├── press.html          ← Press coverage + downloadable brand assets & images
├── our-technology.html ← Technology stack info
├── official-sites.html ← Official domains info
├── privacy.html        ← Privacy Policy
├── terms.html          ← Terms & Conditions
├── coming-soon.html    ← Coming soon placeholder
├── styles.css          ← All styles (brand design system)
├── app.js              ← All JS (see JS Features below)
├── images/             ← All brand and hero images (see below)
├── CNAME               ← GitHub Pages custom domain (visualnerds.com)
└── ai-*.html           ← SEO redirect pages → main domain
```

### Homepage sections (index.html)

| Anchor | Content |
|---|---|
| `#home` | Hero — full-bleed image, VISUAL NERDS centred, WATCH THE REEL CTA |
| `#reel` | Vimeo showreel embed (add `data-vimeo="ID"`) |
| Quick contact strip | Email link + START A PROJECT button — sits directly after the reel |
| `#contact` | Full enquiry form + email |

### Images (`/images/`)

| File | Use |
|---|---|
| `logo.png` | Official neon logo — used in nav, footer, favicon, and press page |
| `hero-keyboard.png` | Homepage hero background |
| `hero-servers.png` | Cinematic hero alternative |
| `hero-woman.png` | Cinematic hero alternative |
| `bg-statue.png` | Branded background (with logo overlay) |
| `bg-face.png` | Branded background (with logo overlay) |
| `bg-flowers.png` | Branded background (with logo overlay) |
| `bg-studio.png` | Branded background (with logo overlay) |
| `bg-office.png` | Branded background (with logo overlay) |
| `bg-clown.png` | Branded background (with logo overlay) |

All images are also available for press download directly on [press.html](press.html).

---

## JavaScript Features (`app.js`)

| Feature | Description |
|---|---|
| Nav scroll | Adds `.scrolled` class + blur backdrop after 20px |
| Mobile menu | Hamburger toggle + focus trap + Escape key close |
| Active nav link | Highlights current page link automatically |
| Neural network canvas | Animated particle/node background on pages with `.hero-canvas` |
| Typewriter | Cycles words on `.typewriter` elements |
| Counter animation | Animates `[data-target]` numbers when scrolled into view |
| Scroll reveal | Adds `.in-view` to `.reveal` elements on scroll |
| Portfolio filter | Filters `.portfolio-card[data-category]` by `.filter-btn` |
| Magnetic buttons | `.btn-primary` follows cursor on hover |
| Email decode | Base64-encoded `office@visualnerds.com` decoded at runtime (spam prevention) |
| Runtime attribute decoder | Any `data-*-enc` attribute (Vimeo IDs, URLs, etc.) is base64-decoded at runtime — never visible in plain HTML |
| Honeypot | Hidden `website` field catches bots silently without alerting them |
| Rate limiting | Blocks form re-submission within 30 seconds (stored in `sessionStorage`) |
| Input sanitisation | Strips all HTML tags from form inputs before building the mailto body |
| Smooth page transition | 120ms fade between internal page navigations |
| Page load fade-in | Body fades in on load |
| Scroll progress bar | Pink→blue gradient bar across the top of the viewport |
| Cursor glow | Soft radial glow follows mouse (desktop only) |
| Hero parallax | Hero image scrolls at 0.3× speed for depth (respects `prefers-reduced-motion`) |
| Toast notifications | Small overlay messages for form feedback |
| Form validation | Real-time field validation (name length, email format, message length) with inline error messages |
| Textarea counter | Live character count (max 1000) on all textareas |
| Lazy image loading | `loading="lazy"` applied automatically to non-hero images |
| Video modal | Vimeo embed opens in modal via `data-vimeo="ID"` |

---

## Adding Content

### Reel video
Vimeo IDs are stored **base64-encoded** so they never appear as plain text in the HTML source.

1. Encode your Vimeo ID in the browser console:
   ```js
   btoa('YOUR_VIMEO_ID')   // e.g. btoa('123456789') → 'MTIzNDU2Nzg5'
   ```
2. Add the encoded value to `#reelPlay` in `index.html`:
   ```html
   <div class="vn-reel__placeholder" id="reelPlay" data-vimeo-enc="MTIzNDU2Nzg5">
   ```
   The `data-vimeo-enc` attribute is decoded to `data-vimeo` at runtime by `app.js`. Any `data-*-enc` attribute works the same way — Vimeo IDs, URLs, anything sensitive.

### Contact email
Contact is `office@visualnerds.com`. The base64-encoded version in `app.js` decodes to this at runtime. If you change the email, re-encode with:
```js
btoa('newaddress@visualnerds.com')
```
and update the `atob(...)` call in `app.js`.

### Social links
Replace `href="#"` on the `.vn-social` icon links in the footer of each page.

### Hero image
Change the `src` on `<img class="vn-hero__img">` in `index.html`. Recommended size: 1920×1080 minimum, landscape.

---

## Deployment (GitHub Pages + Cloudflare)

### Step 1 — GitHub Pages
1. Push all files to `main` branch (files live in **repository root**)
2. **Settings → Pages** → source: `main`, root `/`
3. `CNAME` file already contains `visualnerds.com`

### Step 2 — visualnerds.com DNS (Cloudflare)
In the `visualnerds.com` Cloudflare dashboard → **DNS** (all set to **DNS only / grey cloud**):
- 4 × A records for `@`: `185.199.108.153` · `.109.` · `.110.` · `.111.153`
- CNAME: `www` → `USERNAME.github.io`

Enable **Enforce HTTPS** in GitHub Pages Settings.

### Step 3 — visualnerds.co.uk redirect (Cloudflare)
In the `visualnerds.co.uk` dashboard:
1. DNS — placeholder A record `@` → `192.0.2.1` (**Proxied**)
2. Rules → Redirect Rules:
   - Match: `Hostname equals visualnerds.co.uk`
   - Action: Dynamic redirect
   - URL: `concat("https://visualnerds.com", http.request.uri.path)`
   - Status: `301`

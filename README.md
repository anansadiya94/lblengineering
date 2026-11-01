# LBL Engineering website

Static website for **ל.ב.ל הנדסה וביצוע / LBL Engineering**, built with [Astro](https://astro.build).
Hebrew (RTL) at `/`, English (LTR) under `/en`. No CMS, no database: all text and photos live in `content/`.

## Run it locally

You need Node.js 22.22 or newer.

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:4321. Changes to `content/` and `src/` reload automatically.

Other commands:

| Command | What it does |
| --- | --- |
| `npm run build` | Builds the site into `dist/` |
| `npm run preview` | Serves the built `dist/` locally |
| `npm run check` | Type-checks the code |
| `npm run check:links` | After a build: checks every internal link and image in `dist/` |
| `npm run icons` | Regenerates the favicons and the social-sharing image from the logo |

For the contact form to send messages locally, copy `.env.example` to `.env` and add the Web3Forms key (see below).

## Editing content

Everything you'd normally edit is in `content/`:

```
content/
├─ site.json        company details, address, phones, team, project photos, which photos the home page uses
├─ he/*.md          Hebrew page text (home, about, projects, contact, accessibility)
├─ en/*.md          English page text, same files
└─ images/          all photos (brand, hero, home, projects, team)
```

- **Text on a page:** open `content/he/<page>.md` (and the matching `content/en/<page>.md`) and edit the values between the `---` lines. The accessibility statement's body text is below the second `---`.
- **Phone, email, address, team:** `content/site.json`. Each visible text has a `he` and an `en` version.
- **Add a project photo:** put the image in `content/images/projects/`, then add an entry to `projects` in `site.json`:
  ```json
  {
    "src": "images/projects/project-17.jpg",
    "alt": { "he": "תיאור התמונה", "en": "Description of the photo" },
    "title": { "he": "שם הפרויקט", "en": "Project name" },
    "description": { "he": "שורה קצרה", "en": "One short line" }
  }
  ```
  `title` and `description` are optional. When set, they show under the photo and in the lightbox.
- **Change the home-page photos:** the `home` section of `site.json` (`hero_image`, `projects_preview`, and so on).
- Small interface labels (button text, form labels, menu names) are in `src/lib/i18n.ts`.

Images are resized and converted to WebP automatically at build time, so you can drop in full-size JPGs.

## Contact form (Web3Forms)

1. Go to https://web3forms.com, enter the email address that should receive messages, and copy the access key it sends you.
2. In Vercel: **Project → Settings → Environment Variables**, add `PUBLIC_WEB3FORMS_KEY` with that key, then redeploy.
3. Locally: put the same line in `.env`.

Until a key is set, the form shows a note asking visitors to call or email instead. The form includes a hidden honeypot field (`botcheck`) that catches spam bots. Web3Forms keys are meant to be public, because they're used in the browser; the key only lets someone send messages to your inbox.

## Deploy to Vercel (free)

1. Push this repository to GitHub.
2. At https://vercel.com, choose **Add New → Project**, import the repository and leave the defaults. Vercel detects Astro; the build command is `npm run build` and the output folder is `dist`.
3. Add the `PUBLIC_WEB3FORMS_KEY` environment variable (see above) and deploy.

After that, every push to `main` deploys automatically, and other branches get preview URLs.

`vercel.json` holds:
- 301 redirects from the old WordPress addresses (`/אודות/`, `/פרויקטים/`, `/יצירת-קשר/`, `/portfolio-item/*`, and the old Weglot `/en/...` versions) to the new pages. Each old Hebrew address is listed both percent-encoded and in plain Hebrew, so it matches either way.
- 301 redirects from `www.lblengineering.com`, `lbl-eng.com` and `www.lbl-eng.com` to `https://lblengineering.com`, the canonical domain.
- `cleanUrls` and `trailingSlash: false`, so pages live at `/about` (not `/about.html` or `/about/`).

## Domains and DNS at Hostinger

In Vercel, open **Project → Settings → Domains** and add all four:

| Domain | Setting in Vercel |
| --- | --- |
| `lblengineering.com` | Production (the main domain) |
| `www.lblengineering.com` | Redirect to `lblengineering.com` (301) |
| `lbl-eng.com` | Redirect to `lblengineering.com` (301) |
| `www.lbl-eng.com` | Redirect to `lblengineering.com` (301) |

Then, in Hostinger: **Domains → (domain) → DNS / Nameservers → Manage DNS records**. For **each** of the two domains:

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| A | `@` | the IP Vercel shows on the Domains page (commonly `76.76.21.21`) | 3600 |
| CNAME | `www` | the target Vercel shows (commonly `cname.vercel-dns.com`) | 3600 |

- **Use the exact values Vercel displays** next to each domain. Vercel now sometimes gives project-specific values, and those take precedence over the common defaults above.
- **Delete** any existing `A`, `AAAA` or `CNAME` records for `@` and `www` that point at Hostinger's web hosting, or they'll conflict.
- **Don't touch `MX` and `TXT` (SPF/DKIM) records** if the domain sends or receives email. Email keeps working independently of the website.
- DNS changes usually take minutes, but can take up to 48 hours. Vercel issues the HTTPS certificates automatically once the records resolve.

## Accessibility

Built to WCAG 2.1 AA (Israeli Standard SI 5568). It uses semantic landmarks and headings, a skip link, full keyboard support (including the lightbox and mobile menu), visible focus outlines, AA contrast, alt text on every image, labelled form fields with announced errors, and reduced-motion support. There is no overlay widget. The statement is at `/accessibility` and `/en/accessibility`; fill in the coordinator's details in `content/he/accessibility.md` and `content/en/accessibility.md`.

## Open items for the client (search the code for `TODO`)

- [ ] **English review.** All English text was translated from the Hebrew by AI (`content/en/*.md`, English labels in `src/lib/i18n.ts`, English fields in `site.json`).
- [ ] **Project titles and descriptions.** Add optional `title` and `description` to each project in `site.json`.
- [ ] **Unlabelled team photo.** `content/images/team/team-member-2021.png` is probably Luai Otter; once confirmed, set his `photo` in `site.json`. Until then he shows initials.
- [ ] **Map address.** The Google Maps embed points to "זאב ז'בוטינסקי 14, עכו", but the office address is "גיבורי סיני 12, עכו". Confirm the address and replace `map_embed` (and `map_link`) in `site.json`.
- [ ] **Contact details.** Confirm everyone's phone and email (several are on `yhaj-eng.com`; Luai's old link pointed to Waseem's address).
- [ ] **Accessibility coordinator.** Name, phone and email in both `accessibility.md` files, plus the office's physical accessibility if clients visit.
- [ ] **Web3Forms access key** (see above).
- [ ] Postal code for the address, if wanted in search results (`address.postal_code` in `site.json`).

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
2. On GitHub: **Settings → Secrets and variables → Actions → New repository secret**. Name it `PUBLIC_WEB3FORMS_KEY` and paste the key. The next deploy picks it up (or re-run the latest "Deploy to GitHub Pages" workflow).
3. Locally: put the same line in `.env`.

Until a key is set, the form shows a note asking visitors to call or email instead. The form includes a hidden honeypot field (`botcheck`) that catches spam bots. Web3Forms keys are meant to be public, because they're used in the browser; the key only lets someone send messages to your inbox.

## Deploying (GitHub Pages)

The site is hosted free on GitHub Pages from this repository. `.github/workflows/deploy.yml` runs on every push to `main`: it installs, type-checks, builds, checks every link and image, and only then publishes. If any step fails, the live site stays as it was. You can watch runs under the repository's **Actions** tab, or start one by hand with **Run workflow**.

So to publish a change: edit the files, commit, and push to `main`.

`public/CNAME` tells GitHub Pages the site's domain (`lblengineering.com`); leave it in place.

Old WordPress addresses (`/אודות/`, `/portfolio-item/...` and so on) aren't redirected. They show the site's 404 page, which links back to the home page in both languages. The home page address is unchanged.

## Domain and DNS at Hostinger

In Hostinger: **Domains → lblengineering.com → DNS / Nameservers → Manage DNS records**.

1. **Delete** the existing `A`, `AAAA` and `CNAME` records for `@` and `www` that point at the old WordPress hosting.
2. **Add** these records:

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| A | `@` | `185.199.108.153` | 3600 |
| A | `@` | `185.199.109.153` | 3600 |
| A | `@` | `185.199.110.153` | 3600 |
| A | `@` | `185.199.111.153` | 3600 |
| CNAME | `www` | `anansadiya94.github.io` | 3600 |

3. **Don't touch `MX` and `TXT` (SPF/DKIM) records** if the domain sends or receives email.
4. Wait for DNS to update. That usually takes minutes, but can take up to 48 hours.
5. On GitHub: **Settings → Pages**. When the custom-domain check shows a green tick, enable **Enforce HTTPS**. GitHub issues the certificate automatically; this can take up to an hour after DNS resolves.

`www.lblengineering.com` then redirects to `lblengineering.com` automatically.

Optional, recommended: verify the domain under your GitHub account (**Settings → Pages → Add a domain**, on your profile settings, not the repository). GitHub gives you one `TXT` record to add at Hostinger. This stops anyone else's GitHub Pages site from claiming the domain.

After the site is live, add it to [Google Search Console](https://search.google.com/search-console) and submit `https://lblengineering.com/sitemap-index.xml` so Google picks up the new pages quickly.

## Accessibility

Built to WCAG 2.1 AA (Israeli Standard SI 5568). It uses semantic landmarks and headings, a skip link, full keyboard support (including the lightbox and mobile menu), visible focus outlines, AA contrast, alt text on every image, labelled form fields with announced errors, and reduced-motion support. There is no overlay widget. The statement is at `/accessibility` and `/en/accessibility`; fill in the coordinator's details in `content/he/accessibility.md` and `content/en/accessibility.md`.

## Open items for the client (search the code for `TODO`)

- [ ] **English review.** All English text was translated from the Hebrew by AI (`content/en/*.md`, English labels in `src/lib/i18n.ts`, English fields in `site.json`).
- [ ] **Project titles and descriptions.** Add optional `title` and `description` to each project in `site.json`.
- [ ] **Unlabelled team photo.** `content/images/team/team-member-2021.png` is probably Luai Otter; once confirmed, set his `photo` in `site.json`. Until then he shows initials.
- [ ] **Map address.** The Google Maps embed points to "זאב ז'בוטינסקי 14, עכו", but the office address is "גיבורי סיני 12, עכו". Confirm the address and replace `map_embed` (and `map_link`) in `site.json`.
- [ ] **Contact details.** Confirm everyone's phone and email (several are on `yhaj-eng.com`; Luai's old link pointed to Waseem's address).
- [ ] **Accessibility coordinator.** Name, phone and email in both `accessibility.md` files, plus the office's physical accessibility if clients visit.
- [ ] **Web3Forms access key**, as a GitHub secret (see above).
- [ ] Postal code for the address, if wanted in search results (`address.postal_code` in `site.json`).

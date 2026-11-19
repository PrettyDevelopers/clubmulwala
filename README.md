# ClubMulwala - Homepage

Static homepage concept for ClubMulwala (Mulwala NSW), designed and built by PRETTY Advertising Agency.
Plain HTML, CSS and JavaScript. No build step, no frameworks, no dependencies.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | The homepage, including SEO meta tags, Open Graph tags and JSON-LD structured data |
| `css/styles.css` | All styles (responsive at 1120px and 760px) |
| `js/main.js` | Hero slider, dining selector, rates toggle, reviews carousel, menus, scroll reveals |
| `images/` | Club photography as WebP + JPEG in two sizes each, plus logo, favicons and social share image |
| `robots.txt`, `sitemap.xml` | Search engine crawl files |
| `site.webmanifest` | Icons and theme colour for mobile home screens |
| `.nojekyll` | Tells GitHub Pages to serve the files as-is |

## Upload to GitHub

1. Create a new repository on github.com (e.g. `club-mulwala-homepage`).
2. Click **Add file > Upload files** and drag in **everything inside this folder** (keep the `css`, `js` and `images` folders).
   Note: `.nojekyll` is a hidden file - on a Mac press Cmd+Shift+. in Finder to show it.
3. Commit the files.
4. To preview online: **Settings > Pages > Deploy from a branch > main / (root)**. The site appears at `https://<username>.github.io/<repo>/` within a minute or two.

## Before going live on clubmulwala.com.au

- **Canonical and social URLs** point to `https://www.clubmulwala.com.au/`. Leave them as-is for launch on that domain. For a preview link that should not be indexed, add `<meta name="robots" content="noindex">` to the GitHub Pages copy.
- **Newsletter form** posts to the club's existing Mailchimp list (same list, fields and tag as the current site). Real subscriptions will be created when it's submitted.
- **Events, news and hours** reflect the live site as of November 2026 and need updating as they change (also update the Event entries in the JSON-LD in `index.html`).
- **Logo** is the existing PNG. A vector (SVG) version from the club would make it sharper on high-res screens.
- **Oriental Pearl photo** is the highest resolution available on the current site (1120px wide). A new photo would lift that panel.
- **Fonts** load from Google Fonts (Fraunces for headings, Inter for body text, Outfit for labels and buttons).
- **After editing CSS or JS**, bump the `?v=` number on the `styles.css` and `main.js` links in `index.html` so visitors get the new version straight away.

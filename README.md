# AutoLux — myautolux.com website

A modern, responsive multi-page website for **AutoLux**, an auto broker and
leasing company serving the Greater Los Angeles and Sacramento areas
(currently at https://www.myautolux.com/).

Pure static HTML/CSS/JS — no build step, no framework. Open `index.html` in a
browser, or host the folder on any static host (GitHub Pages, Vercel, Netlify).

## Pages

| File | Page |
|---|---|
| `index.html` | Home — hero, services, how it works, brands, testimonials |
| `lease-specials.html` | Monthly lease specials (sample offers to be updated monthly) |
| `commercial.html` | Commercial vehicles & fleet leasing |
| `credit-application.html` | Financing — links to the AutoPay Fast Track hosted application |
| `about.html` | About Us + testimonials |
| `contact.html` | Contact form, both locations, hours |

Shared assets: `css/styles.css`, `js/main.js` (mobile nav, scroll reveal,
active-link highlight, form handling).

## Financing integration (AutoPay / The Savings Group)

Two levels of integration are set up:

1. **Live now — hosted application.** The "Get Approved" / "Start Secure
   Application" buttons send visitors to AutoPay's hosted application with the
   `AUTOPAY_AUTO_LUX_FAST_TRACK_API` lead channel, so leads are attributed to
   AutoLux automatically. No credentials or backend required.

2. **Optional — live rates on the site.** The Savings Group Rates API can show
   real APR/payment offers directly on the site, but it requires a partner
   bearer token and a small backend proxy (it must never be called from the
   browser). A ready-to-deploy serverless template and full instructions are in
   [`integrations/rates-api/`](integrations/rates-api/README.md).

## Things to update before/after launch

- Replace sample lease specials in `lease-specials.html` with the current
  month's real numbers.
- Point the footer social links at the real Facebook / Instagram / Yelp /
  Google profiles.
- Wire the contact form to a real backend or a form service (Formspree,
  Basin, etc.) — it currently shows a confirmation client-side only.
- Add real vehicle/location photography when available.

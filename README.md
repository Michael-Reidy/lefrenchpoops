# Le French Poops

Static comic site, no build step.

## Preview
    python3 -m http.server 8000   # then open http://localhost:8000

## Publish a new weekly comic
1. Put the image in `comics/` (e.g. `comics/004.png`).
2. Add an entry to `comics.json` with the next `number`, a `date` (YYYY-MM-DD), `title`, `image`, `alt` text and optional `caption`.

Comics with a future `date` stay hidden until that day, so you can load several weeks ahead.

Host anywhere that serves static files (Netlify, Cloudflare Pages, GitHub Pages).

## Selling a digital copy (Stripe Payment Links)
1. In Stripe Dashboard: Payment Links > New. Create a product for the comic and set a price.
2. Make the download page: `tools/make-download.py 4 path/to/comic-004-hires.png`
   It prints a private URL like `/d/<random>/`.
3. In the Payment Link, under After payment choose "Redirect to your website" and use
   `https://lefrenchpoops.com/d/<random>/`.
4. Add `"buyUrl": "<the Stripe link>"` to that comic's entry in `comics.json`.

Note: the download page is protected only by its unguessable URL (no logins). Anyone
who is given the link can download. Don't put high-res files anywhere else on the site.
Stripe still emails receipts. For real access control, upgrade to Stripe Checkout + a small backend.
# lefrenchpoops

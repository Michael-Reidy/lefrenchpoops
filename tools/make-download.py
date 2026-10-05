#!/usr/bin/env python3
"""Create a private thank-you/download page for a comic.

Usage: tools/make-download.py <comic-number> <path/to/hi-res-file>

Copies the file to d/<random>/ with a thank-you page and prints the URL path.
Paste that URL into Stripe (Payment Link > After payment > Don't show
confirmation page > Redirect to your website). Do NOT list it in comics.json.
"""
import secrets, shutil, sys, html
from pathlib import Path

if len(sys.argv) != 3:
    sys.exit(__doc__)
num, src = sys.argv[1], Path(sys.argv[2])
token = secrets.token_urlsafe(24)
out = Path(__file__).resolve().parent.parent / "d" / token
out.mkdir(parents=True)
shutil.copy(src, out / src.name)
(out / "index.html").write_text(f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Thank you! · Le French Poops</title>
<link rel="stylesheet" href="../../style.css"></head>
<body><header><h1>Le French <span>Poops</span> 💩🥖</h1></header>
<main><section class="card"><h2>Merci beaucoup! 🎉</h2>
<p>Thank you for buying comic #{html.escape(num)}.</p>
<p><a class="btn buy-btn" href="{html.escape(src.name)}" download>⬇ Download your comic</a></p>
<p><a href="../../index.html">Back to the comics</a></p></section></main></body></html>
""")
print(f"Thank-you page created. Stripe redirect URL path: /d/{token}/")

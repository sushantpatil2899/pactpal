"""Builds Daniel's deliverable: Rosa's Corner Bakery, five pages in one file with the photos inlined."""
import base64, io, sys
from pathlib import Path
from PIL import Image

root = Path(sys.argv[1])

def photo(name: str) -> str:
    im = Image.open(root / "images" / name).convert("RGB")
    im.thumbnail((1200, 1200))
    buf = io.BytesIO(); im.save(buf, "JPEG", quality=78)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()

hero, loaf, rolls, counter, cake = (photo(n) for n in ["bakery-1-hero.jpg", "bakery-2-sourdough.jpg", "bakery-3-cinnamon-rolls.jpg", "bakery-4-counter.jpg", "bakery-5-cake.jpg"])
html = f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Rosa's Corner Bakery</title><style>
:root{{--cream:#fbf6ee;--crust:#8a4b22;--ink:#2b2118;--muted:#6d5d4f}}
*{{box-sizing:border-box}}body{{margin:0;font-family:Georgia,"Times New Roman",serif;background:var(--cream);color:var(--ink);line-height:1.6}}
header{{position:sticky;top:0;background:var(--cream);border-bottom:1px solid #eadfcf;display:flex;justify-content:space-between;align-items:center;padding:14px 6vw;z-index:2}}
header b{{font-size:22px;color:var(--crust)}}nav a{{margin-left:18px;color:var(--ink);text-decoration:none;font-family:Helvetica,Arial,sans-serif;font-size:14px}}
section{{padding:64px 6vw;max-width:1100px;margin:auto}}h1{{font-size:46px;margin:0 0 12px}}h2{{font-size:32px;margin:0 0 16px;color:var(--crust)}}
.hero{{display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center}}img{{width:100%;border-radius:14px;display:block}}
.btn{{display:inline-block;background:var(--crust);color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none;font-family:Helvetica,Arial,sans-serif}}
.grid{{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}}.card{{background:#fff;border-radius:14px;padding:18px;box-shadow:0 1px 3px rgba(0,0,0,.06)}}
.price{{float:right;color:var(--crust);font-weight:700}}form{{display:grid;gap:12px;max-width:520px}}input,select,textarea{{padding:10px;border:1px solid #d9cbb7;border-radius:8px;font:inherit}}
footer{{text-align:center;padding:30px;color:var(--muted);font-family:Helvetica,Arial,sans-serif;font-size:13px}}
@media(max-width:760px){{.hero,.grid{{grid-template-columns:1fr}}h1{{font-size:34px}}}}
</style></head><body>
<header><b>Rosa's Corner Bakery</b><nav><a href="#home">Home</a><a href="#menu">Menu</a><a href="#about">About</a><a href="#order">Order</a><a href="#visit">Visit</a></nav></header>
<section id="home" class="hero"><div><h1>Baked before sunrise, gone by noon.</h1><p>Sourdough, croissants and celebration cakes, made by hand on the corner of Maple and 3rd since 2014.</p><a class="btn" href="#order">Order for pickup</a></div><img src="{hero}" alt="Fresh sourdough loaves and croissants on a wooden table"></section>
<section id="menu"><h2>Menu</h2><div class="grid">
<div class="card"><img src="{loaf}" alt="Sliced sourdough loaf"><p><b>Country sourdough</b><span class="price">$9</span><br>48-hour ferment, crackling crust.</p></div>
<div class="card"><img src="{rolls}" alt="Tray of iced cinnamon rolls"><p><b>Cinnamon rolls</b><span class="price">$4.50</span><br>Brown butter, cream-cheese icing.</p></div>
<div class="card"><img src="{cake}" alt="Berry celebration cake"><p><b>Berry celebration cake</b><span class="price">from $48</span><br>Order two days ahead.</p></div>
</div></section>
<section id="about" class="hero"><img src="{counter}" alt="The bakery counter and display case"><div><h2>About Rosa</h2><p>Rosa Alvarez trained in her grandmother's kitchen in Oaxaca and in a Paris boulangerie. Everything is baked on site, with local flour and butter.</p></div></section>
<section id="order"><h2>Order for pickup</h2><form onsubmit="event.preventDefault();this.querySelector('p').hidden=false"><label>Name<input required></label><label>Item<select><option>Country sourdough</option><option>Cinnamon rolls (6)</option><option>Berry celebration cake</option></select></label><label>Pickup day<input type="date" required></label><label>Notes<textarea rows="3"></textarea></label><button class="btn" type="submit">Place order</button><p hidden>Thanks! We'll email you when it's ready.</p></form></section>
<section id="visit"><h2>Visit</h2><p>Maple &amp; 3rd · Tue–Sun 7am–2pm · Closed Mondays</p></section>
<footer>Rosa's Corner Bakery · Site by Okafor Web</footer></body></html>"""
out = root / "deliverables" / "rosas-corner-bakery-site.html"
out.write_text(html); print(out.name, round(out.stat().st_size / 1024), "KB")

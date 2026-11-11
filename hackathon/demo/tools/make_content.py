"""Makes the demo's generated content from the owner's images (run once; outputs are committed).

- Priya's retouched candle photos: colour-corrected, lifted to a near-white background, square.
  Two are left with their shadows, as story 3 needs (she delivered work that was not finished).
- Jun's three spreadsheet templates, with real formulas.
"""
import sys
from pathlib import Path
from PIL import Image, ImageEnhance, ImageOps, ImageFilter
import openpyxl
from openpyxl.styles import Font, PatternFill

root = Path(sys.argv[1])
img, out = root / "images", root / "deliverables"


def retouch(src: str, dst: str, keep_shadow: bool) -> None:
    im = Image.open(img / src).convert("RGB")
    im = ImageOps.autocontrast(im, cutoff=1)
    im = ImageEnhance.Color(im).enhance(0.92)
    im = ImageEnhance.Brightness(im).enhance(1.08)
    w, h = im.size
    # Fade everything outside the product towards white: a soft oval mask around the centre.
    mask = Image.new("L", (w, h), 0)
    inner = Image.new("L", (int(w * 0.62), int(h * 0.74)), 255)
    mask.paste(inner, ((w - inner.width) // 2, int(h * 0.16)))
    mask = mask.filter(ImageFilter.GaussianBlur(w // 14))
    white = Image.new("RGB", (w, h), (250, 250, 248))
    clean = Image.composite(im, white, mask)
    if keep_shadow:
        # Unfinished: the background is only half lifted and the table shadow stays.
        clean = Image.blend(im, clean, 0.45)
    clean.resize((1200, 1200)).save(out / dst, quality=88)


for src, dst, shadow in [
    ("candle-1-jar.jpg", "priya-candle-1-jar.jpg", False),
    ("candle-2-tins.jpg", "priya-candle-2-tins.jpg", False),
    ("candle-3-pillar.jpg", "priya-candle-3-pillar.jpg", True),
    ("candle-5-lavender.jpg", "priya-candle-5-lavender.jpg", True),
]:
    retouch(src, dst, shadow)

bold, head = Font(bold=True), PatternFill("solid", fgColor="E3F6EF")


def sheet(name: str, title: str, columns: list[str], rows: list[list], formulas) -> None:
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = title
    ws.append(columns)
    for cell in ws[1]:
        cell.font, cell.fill = bold, head
    for row in rows:
        ws.append(row)
    formulas(ws, len(rows) + 1)
    for col in ws.columns:
        ws.column_dimensions[col[0].column_letter].width = 22
    wb.save(out / name)


sheet(
    "jun-budget-planner.xlsx",
    "Budget",
    ["Category", "Planned", "Actual", "Difference"],
    [["Rent", 1200, 1200], ["Groceries", 450, 0], ["Transport", 120, 0], ["Utilities", 160, 0], ["Savings", 300, 0]],
    lambda ws, last: [
        *[ws.cell(r, 4, f"=B{r}-C{r}") for r in range(2, last + 1)],
        ws.cell(last + 1, 1, "Total").__setattr__("font", bold),
        ws.cell(last + 1, 2, f"=SUM(B2:B{last})"),
        ws.cell(last + 1, 3, f"=SUM(C2:C{last})"),
        ws.cell(last + 1, 4, f"=B{last + 1}-C{last + 1}"),
    ],
)
sheet(
    "jun-invoice-tracker.xlsx",
    "Invoices",
    ["Client", "Invoice", "Sent", "Due", "Amount", "Paid", "Outstanding"],
    [["Client A", "INV-001", "2026-11-01", "2026-11-15", 800, 800], ["Client B", "INV-002", "2026-11-05", "2026-11-19", 450, 0]],
    lambda ws, last: [ws.cell(r, 7, f"=E{r}-F{r}") for r in range(2, last + 1)],
)
sheet(
    "jun-content-calendar.xlsx",
    "Calendar",
    ["Week of", "Channel", "Topic", "Status", "Owner"],
    [["2026-11-16", "Newsletter", "Year-end tips", "Draft", "Me"], ["2026-11-23", "Blog", "Holiday hours", "Idea", "Me"]],
    lambda ws, last: None,
)
print("made", sorted(p.name for p in out.iterdir()))

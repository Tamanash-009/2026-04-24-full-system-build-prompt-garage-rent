from pathlib import Path
from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
ASSETS.mkdir(parents=True, exist_ok=True)


def rounded(draw, xy, radius, fill):
    draw.rounded_rectangle(xy, radius=radius, fill=fill)


def build_icon(size: int) -> Image.Image:
    image = Image.new("RGBA", (size, size), (15, 23, 42, 255))
    draw = ImageDraw.Draw(image)

    roof_y = int(size * 0.29)
    left = int(size * 0.21)
    right = int(size * 0.79)
    center = size // 2
    base_y = int(size * 0.53)

    draw.line(
        [(left, base_y), (center, roof_y), (right, base_y)],
        fill=(103, 232, 249, 255),
        width=max(14, size // 24),
        joint="curve",
    )

    rounded(
        draw,
        (int(size * 0.30), int(size * 0.50), int(size * 0.70), int(size * 0.77)),
        radius=int(size * 0.035),
        fill=(248, 250, 252, 255),
    )
    rounded(
        draw,
        (int(size * 0.40), int(size * 0.56), int(size * 0.60), int(size * 0.77)),
        radius=int(size * 0.03),
        fill=(245, 158, 11, 255),
    )
    draw.ellipse(
        (int(size * 0.68), int(size * 0.18), int(size * 0.86), int(size * 0.36)),
        fill=(245, 158, 11, 255),
    )
    draw.line(
        [(int(size * 0.77), int(size * 0.21)), (int(size * 0.77), int(size * 0.33))],
        fill=(15, 23, 42, 255),
        width=max(10, size // 34),
    )
    draw.line(
        [(int(size * 0.72), int(size * 0.27)), (int(size * 0.82), int(size * 0.27))],
        fill=(15, 23, 42, 255),
        width=max(10, size // 34),
    )

    return image


def build_splash(size: int) -> Image.Image:
    image = Image.new("RGBA", (size, size), (15, 23, 42, 255))
    icon = build_icon(int(size * 0.48))
    image.alpha_composite(icon, ((size - icon.width) // 2, (size - icon.height) // 2))
    return image


build_icon(1024).save(ASSETS / "logo.png")
build_icon(1024).save(ASSETS / "icon.png")
build_splash(2732).save(ASSETS / "splash.png")

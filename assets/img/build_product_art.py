#!/usr/bin/env python3
"""Generate product placeholder art for the relaunch — vector-style SVG per product,
rendered to PNG. Studio-neutral flat illustration (NO fake photography, NO fake logos).
Every product gets: warm-bone background, granite product silhouette, flame signal accent,
tiny IX mark. This keeps the build honest (illustration system, not fake photos) and fast.
"""
import json, os, subprocess

OUT = "/home/Tara/ixpeaks-launch/site/assets/img/products"
os.makedirs(OUT, exist_ok=True)
products = json.load(open("/home/Tara/ixpeaks-launch/site/data/products.json"))

# silhouette drawing per icon: (viewBox svg body, accent zone)
def svg_body(icon, signal="#FF5A1F", ink="#23282C", line="#23282C"):
    W, H = 800, 1000
    def shoe(rot=0):
        # trail shoe side profile
        return f'''<g transform="rotate({rot} 400 560)">
        <path d="M180 640 Q170 600 210 560 L260 500 Q280 460 340 450 L560 450 Q640 460 660 520 L680 580 Q690 620 650 640 L240 660 Q195 660 180 640 Z" fill="{ink}"/>
        <path d="M200 640 L660 636 Q676 636 686 616 L700 616 Q710 650 690 660 L200 668 Q186 668 200 640 Z" fill="#3A3F44"/>
        <path d="M330 470 Q500 430 620 490 Q560 470 500 470 Q420 470 380 480 Z" fill="{signal}"/>
        <circle cx="300" cy="500" r="10" fill="{signal}"/>
        <path d="M360 470 L560 470" stroke="{line}" stroke-width="4" fill="none"/>
        </g>'''
    def boot():
        return shoe().replace('rotate(0','rotate(-4') + '''<path d="M240 420 L240 470" stroke="{line}" stroke-width="14"/>'''.format(line=line)
    def tee():
        return f'''<path d="M290 300 L360 260 Q400 290 440 260 L510 300 L560 340 L520 400 L500 380 L500 720 Q400 745 300 720 L300 380 L280 400 L240 340 Z" fill="{ink}"/>
        <circle cx="360" cy="360" r="14" fill="{signal}"/>'''
    def hoodie():
        return f'''<path d="M280 320 L350 265 Q400 300 450 265 L520 320 L575 370 L535 425 L515 405 L515 740 Q400 770 285 740 L285 405 L265 425 L225 370 Z" fill="{ink}"/>
        <path d="M350 265 Q400 320 450 265 L440 250 Q400 275 360 250 Z" fill="{signal}"/>
        <rect x="350" y="600" width="100" height="90" rx="8" fill="#3A3F44"/>'''
    def shell():
        return f'''<path d="M270 300 L360 250 Q400 285 440 250 L530 300 L580 360 L540 410 L520 392 L520 760 Q400 790 280 760 L280 392 L260 410 L220 360 Z" fill="{ink}" stroke="#ffffff22"/>
        <path d="M400 250 L400 770" stroke="{signal}" stroke-width="6"/>
        <path d="M480 380 L560 360" stroke="{line}" stroke-width="6"/>'''
    def puffer():
        rows = ""
        for i in range(7):
            y = 330 + i*58
            rows += f'<path d="M300 {y} Q400 {y+14} 500 {y}" stroke="{line}" stroke-width="3" fill="none"/>'
        return f'''<path d="M280 310 Q400 250 520 310 L555 350 L525 395 L505 380 L505 740 Q400 770 295 740 L295 380 L275 395 L245 350 Z" fill="{ink}"/>{rows}
        <path d="M330 700 Q400 730 470 700 Q400 745 330 700 Z" fill="{signal}"/>'''
    def pants():
        return f'''<path d="M320 260 L480 260 L490 700 L430 700 L400 460 L370 700 L310 700 Z" fill="{ink}"/>
        <path d="M320 280 L480 280" stroke="{signal}" stroke-width="8"/>'''
    def shorts():
        left, right = 340, 460
        return f'''<path d="M320 300 L480 300 L505 520 L430 520 L400 380 L370 520 L295 520 Z" fill="{ink}"/>
        <path d="M320 318 L480 318" stroke="{signal}" stroke-width="8"/>
        <rect x="450" y="340" width="40" height="26" rx="5" fill="{signal}"/>'''
    def pack():
        return f'''<rect x="290" y="280" width="220" height="360" rx="40" fill="{ink}"/>
        <path d="M340 280 Q400 230 460 280" stroke="{signal}" stroke-width="10" fill="none"/>
        <rect x="330" y="420" width="140" height="90" rx="12" fill="#3A3F44"/>
        <circle cx="400" cy="360" r="16" fill="{signal}"/>'''
    def flaskpair():
        return f'''<rect x="300" y="380" width="90" height="280" rx="40" fill="{ink}"/>
        <rect x="430" y="380" width="90" height="280" rx="40" fill="{ink}"/>
        <rect x="300" y="620" width="90" height="26" rx="10" fill="{signal}"/>
        <rect x="430" y="620" width="90" height="26" rx="10" fill="{signal}"/>'''
    def cap():
        return f'''<path d="M280 470 Q400 350 520 470 L520 510 L280 510 Z" fill="{ink}"/>
        <path d="M280 510 L620 510 Q640 530 610 545 L280 545 Z" fill="#3A3F44"/>
        <circle cx="400" cy="430" r="14" fill="{signal}"/>'''
    def socks():
        return f'''<path d="M330 300 L420 300 L415 560 Q470 640 380 660 Q300 665 330 560 Z" fill="{ink}"/>
        <path d="M470 300 L560 300 L555 560 Q610 640 520 660 Q440 665 470 560 Z" fill="{ink}" opacity=".85"/>
        <rect x="330" y="300" width="90" height="36" fill="{signal}"/>
        <rect x="470" y="300" width="90" height="36" fill="{signal}"/>'''
    def beanie():
        return f'''<path d="M300 520 Q300 350 400 350 Q500 350 500 520 L500 560 L300 560 Z" fill="{ink}"/>
        <rect x="300" y="520" width="200" height="50" rx="18" fill="{signal}"/>
        <circle cx="400" cy="340" r="26" fill="{signal}"/>'''
    def gloves():
        return f'''<path d="M340 320 Q330 300 350 295 Q370 290 375 315 L375 260 Q375 240 395 240 Q415 240 415 260 L415 235 Q415 220 435 222 Q455 224 455 250 L455 470 Q450 560 400 570 Q350 570 340 480 Z" fill="{ink}"/>
        <rect x="345" y="330" width="34" height="14" rx="6" fill="{signal}"/>'''
    def duffel():
        return f'''<rect x="260" y="420" width="280" height="190" rx="50" fill="{ink}"/>
        <path d="M330 420 Q400 340 470 420" stroke="{signal}" stroke-width="12" fill="none"/>
        <rect x="330" y="500" width="140" height="50" rx="10" fill="#3A3F44"/>'''
    def rainjacket():
        return shell().replace('stroke="#ffffff22"','') + '''<path d="M340 280 L340 250 Q400 220 460 250 L460 280" stroke="{s2}" stroke-width="8" fill="none"/>'''.format(s2=signal)
    def anorak():
        return shell() + '<path d="M420 260 L420 480" stroke="#fff" stroke-width="5"/>'
    def softshell():
        shell2 = shell()
        return shell2.replace(f'fill="{signal}"', f'fill="#3A3F44"')
    def sundhoodie():
        return hoodie().replace(f'fill="{signal}"', f'fill="#3A3F44"') + '<path d="M300 380 Q400 420 500 380" stroke="#3A3F44" stroke-width="6" fill="none"/>'
    def slip():
        return f'''<ellipse cx="400" cy="560" rx="190" ry="90" fill="{ink}"/>
        <path d="M230 560 Q400 480 570 560" stroke="{signal}" stroke-width="10" fill="none"/>
        <rect x="290" y="470" width="70" height="20" rx="8" fill="{signal}"/>
        <rect x="440" y="470" width="70" height="20" rx="8" fill="{signal}"/>'''
    def kidslip():
        return slip() + '<circle cx="400" cy="520" r="16" fill="#F4F3EF"/>'
    def bibpant():
        return f'''<path d="M320 300 L480 300 L490 700 L430 700 L400 480 L370 700 L310 700 Z" fill="{ink}"/>
        <rect x="320" y="240" width="160" height="80" rx="8" fill="{ink}"/>
        <path d="M340 240 L340 190 M460 240 L460 190" stroke="{signal}" stroke-width="12"/>
        <path d="M320 300 L480 300" stroke="{signal}" stroke-width="8"/>'''
    def bundle():
        return cap() + '''<g transform="translate(60 220) scale(.45)">{}</g>'''.format(socks())
    def fleece():
        return hoodie().replace('fill="#3A3F44"','fill="#2b3034"')

    fns = dict(trailshoe=shoe, boot=boot, approach=shoe, slide=slip, kidsslip=kidslip,
               tee=tee, hoodie=hoodie, shell=shell, rainjacket=rainjacket, anorak=anorak,
               softshell=softshell, sunhoodie=sundhoodie, puffer=puffer, fleece=fleece,
               pants=pants, kidpants=bibpant, shorts=shorts, pack=pack, flaskpair=flaskpair,
               duffel=duffel, cap=cap, socks=socks, beanie=beanie, gloves=gloves, bundle=bundle)
    fn = fns.get(icon, tee)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}">
<rect width="{W}" height="{H}" fill="#EFE9DF"/>
<rect x="0" y="0" width="{W}" height="10" fill="{signal}"/>
<text x="40" y="70" font-family="Arial, sans-serif" font-size="30" letter-spacing="6" fill="#B9B2A6">IXPEAKS</text>
<g transform="translate(0 40)" opacity=".25">
  <path d="M0 760 Q200 560 400 700 T800 620" stroke="#B9B2A6" stroke-width="2" fill="none"/>
  <path d="M0 800 Q200 600 400 740 T800 660" stroke="#B9B2A6" stroke-width="2" fill="none"/>
</g>
{fn()}
<text x="40" y="952" font-family="Arial, sans-serif" font-size="26" letter-spacing="4" fill="#B9B2A6">LAUNCH CONCEPT — NOT FINAL PRODUCTION</text>
</svg>'''

count = 0
for p in products:
    svg = svg_body(p["icon"])
    svg_path = f'{OUT}/{p["id"].lower()}.svg'
    png_path = f'{OUT}/{p["id"].lower()}.png'
    open(svg_path, "w").write(svg)
    try:
        import cairosvg
    except ImportError:
        print("no cairosvg; aborting")
        raise SystemExit(1)
    for p in products:
        svg = svg_body(p["icon"])
        svg_path = f'{OUT}/{p["id"].lower()}.svg'
        png_path = f'{OUT}/{p["id"].lower()}.png'
        open(svg_path, "w").write(svg)
        try:
            cairosvg.svg2png(url=svg_path, write_to=png_path, output_width=800, output_height=1000)
        except Exception as e:
            print("NO RENDERER:", p["id"], e)
            continue
        count += 1
print("rendered:", count, "of", len(products))
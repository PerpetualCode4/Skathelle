"""
Skathelle NB Agent v4
- Navigerer til riktig side (page=X frå URL)
- Ventar lenger på innhald
- Tar screenshot av treff-sida + nokre sider rundt

Køyr: python skathelle_screenshot_v4.py
"""

import asyncio
from pathlib import Path
from datetime import datetime
from urllib.parse import urlparse, parse_qs
from playwright.async_api import async_playwright

OUTPUT_DIR = Path("nb_screenshots_v4")

SØKEORD = [
    "skathellekasting",
    "skathelle jostedalen",
]

async def lukk_popup(page):
    try:
        await page.keyboard.press("Escape")
        await page.wait_for_timeout(500)
    except:
        pass

async def naviger_til_side(page, målside):
    """Navigerer til riktig side i avisa."""
    for _ in range(30):  # maks 30 klikk
        try:
            # Les kva side me er på no
            sidetekst = await page.evaluate("""
                () => {
                    const el = document.querySelector('.page-count, [class*="pageCount"], [class*="page-number"]');
                    return el ? el.innerText : '';
                }
            """)
            
            # Prøv å lese sidenummer frå tittellinja
            if f"{målside}/" in sidetekst or f"/{målside}" in sidetekst:
                return True
                
            # Klikk neste
            neste = page.locator("button[aria-label='navigate_next']")
            if await neste.count() > 0 and await neste.first.is_enabled():
                await neste.first.click()
                await page.wait_for_timeout(2000)
            else:
                break
        except:
            break
    return False

async def hent_alle_treff_urls(page, søkeord):
    urls = []
    søk_url = f"https://www.nb.no/search?q={søkeord.replace(' ', '%20')}&mediatype=aviser"
    print(f"  Søker: {søkeord}")
    await page.goto(søk_url, timeout=60000)
    await page.wait_for_timeout(5000)

    side_nr = 1
    while True:
        print(f"    Side {side_nr}...")
        lenker = await page.evaluate("""
            () => {
                const links = Array.from(document.querySelectorAll('a[href*="/items/"]'));
                return [...new Set(links.map(l => l.href))];
            }
        """)
        nye = [l for l in lenker if "/items/" in l and l not in urls]
        urls.extend(nye)
        print(f"    {len(nye)} nye ({len(urls)} totalt)")
        try:
            neste = page.locator("button[aria-label='Go to next page']")
            if await neste.count() > 0 and await neste.first.is_enabled():
                await neste.first.click()
                await page.wait_for_timeout(3000)
                side_nr += 1
            else:
                break
        except:
            break
        if side_nr > 20:
            break
    return urls

async def ta_screenshots_av_artikkel(page, url, namn, output_dir):
    screenshots = []
    
    # Hent målside frå URL (?page=X)
    parsed = urlparse(url)
    params = parse_qs(parsed.query)
    målside = int(params.get("page", [0])[0])
    
    # Gå til sida med søketekst highlight
    await page.goto(url, timeout=60000)
    await page.wait_for_timeout(6000)
    await lukk_popup(page)

    innhald = await page.content()
    if "tilgjengelig etter bestemte vilkår" in innhald.lower():
        print(f"    ⚠ Ingen tilgang")
        return screenshots

    try:
        await page.wait_for_selector("canvas, [class*='viewer'] img, img[src*='nb.no']", timeout=25000)
        await page.wait_for_timeout(5000)
    except:
        await page.wait_for_timeout(6000)

    await lukk_popup(page)

    # Ta screenshot av treff-sida + 2 sider rundt
    for i in range(3):
        sti = output_dir / f"{namn}_side{målside + i}.png"
        await page.screenshot(path=str(sti), full_page=False)
        screenshots.append(str(sti))
        print(f"    Screenshot side {målside + i}")
        
        try:
            neste = page.locator("button[aria-label='navigate_next']")
            if await neste.count() > 0 and await neste.first.is_enabled():
                await neste.first.click()
                await page.wait_for_timeout(3000)
            else:
                break
        except:
            break

    return screenshots

async def main():
    OUTPUT_DIR.mkdir(exist_ok=True)
    print("=" * 55)
    print("Skathelle NB Agent v4 — navigerer til riktig side")
    print("=" * 55)
    print(f"Output: {OUTPUT_DIR.absolute()}")
    print("\nNettlesaren opnar — logg inn med BankID.")
    print("Trykk ENTER når du er logga inn og ser nb.no-forsida.")
    print("=" * 55)
    input()

    async with async_playwright() as p:
        browser = await p.firefox.launch(headless=False)
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        await page.goto("https://www.nb.no")
        await page.wait_for_timeout(3000)

        print("\nLogga inn? Trykk ENTER for å starte...")
        input()
        await page.wait_for_timeout(3000)

        alle_urls = []
        for søkeord in SØKEORD:
            urls = await hent_alle_treff_urls(page, søkeord)
            for u in urls:
                if u not in alle_urls:
                    alle_urls.append(u)

        print(f"\nFann {len(alle_urls)} artiklar. Startar...\n")
        Path("nb_alle_urls.txt").write_text("\n".join(alle_urls), encoding="utf-8")

        alle_resultat = []
        for idx, url in enumerate(alle_urls, 1):
            namn = f"artikkel_{idx:03d}"
            print(f"[{idx}/{len(alle_urls)}] {url}")
            shots = await ta_screenshots_av_artikkel(page, url, namn, OUTPUT_DIR)
            alle_resultat.append({"namn": namn, "url": url, "screenshots": shots})
            await asyncio.sleep(1)

        await browser.close()

    linjer = [f"# NB Rapport v4 — {datetime.now().strftime('%d.%m.%Y %H:%M')}", ""]
    for r in alle_resultat:
        if r["screenshots"]:
            linjer.append(f"## {r['namn']}")
            linjer.append(f"- {r['url']}")
            for s in r["screenshots"]:
                linjer.append(f"  - `{s}`")
            linjer.append("")

    Path("nb_rapport_v4.md").write_text("\n".join(linjer), encoding="utf-8")
    print(f"\nFerdig! → {OUTPUT_DIR}/ og nb_rapport_v4.md")

if __name__ == "__main__":
    asyncio.run(main())

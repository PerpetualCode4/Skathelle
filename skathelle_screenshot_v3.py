"""
Skathelle NB Agent v3 FIKSA
Køyr: python skathelle_screenshot_v3.py
"""

import asyncio
from pathlib import Path
from datetime import datetime
from playwright.async_api import async_playwright

OUTPUT_DIR = Path("nb_screenshots_v3")

SØKEORD = [
    "skathellekasting",
    "skathelle jostedalen",
]

async def lukk_popup(page):
    try:
        await page.keyboard.press("Escape")
        await page.wait_for_timeout(300)
    except:
        pass

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
            else:
                break
        except:
            break

        if side_nr > 20:
            break
        side_nr += 1

    return urls

async def ta_screenshots_av_artikkel(page, url, namn, output_dir):
    screenshots = []
    await page.goto(url, timeout=60000)
    await page.wait_for_timeout(5000)
    await lukk_popup(page)

    innhald = await page.content()
    if "tilgjengelig etter bestemte vilkår" in innhald.lower():
        print(f"    ⚠ Ingen tilgang")
        return screenshots

    try:
        await page.wait_for_selector("canvas, [class*='viewer'] img", timeout=20000)
        await page.wait_for_timeout(4000)
    except:
        await page.wait_for_timeout(5000)

    await lukk_popup(page)

    for i in range(1, 6):
        sti = output_dir / f"{namn}_s{i}.png"
        await page.screenshot(path=str(sti), full_page=False)
        screenshots.append(str(sti))
        print(f"    Side {i} lagra")

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

    async with async_playwright() as p:
        browser = await p.firefox.launch(headless=False)
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        await page.goto("https://www.nb.no")
        await page.wait_for_timeout(3000)

        print("\n" + "="*50)
        print("Logg inn på nb.no med BankID.")
        print("Når du ser NB-forsida att: trykk ENTER her.")
        print("="*50)
        input()
        await page.wait_for_timeout(3000)

        alle_urls = []
        for søkeord in SØKEORD:
            urls = await hent_alle_treff_urls(page, søkeord)
            for u in urls:
                if u not in alle_urls:
                    alle_urls.append(u)

        print(f"\nFann {len(alle_urls)} artiklar. Startar screenshots...\n")
        Path("nb_alle_urls.txt").write_text("\n".join(alle_urls), encoding="utf-8")

        alle_resultat = []
        for idx, url in enumerate(alle_urls, 1):
            namn = f"artikkel_{idx:03d}"
            print(f"[{idx}/{len(alle_urls)}] {url}")
            shots = await ta_screenshots_av_artikkel(page, url, namn, OUTPUT_DIR)
            alle_resultat.append({"namn": namn, "url": url, "screenshots": shots})
            await asyncio.sleep(1)

        await browser.close()

    linjer = [f"# NB Rapport — {datetime.now().strftime('%d.%m.%Y %H:%M')}", ""]
    for r in alle_resultat:
        if r["screenshots"]:
            linjer.append(f"## {r['namn']}")
            linjer.append(f"- {r['url']}")
            for s in r["screenshots"]:
                linjer.append(f"  - `{s}`")
            linjer.append("")

    Path("nb_rapport_v3.md").write_text("\n".join(linjer), encoding="utf-8")
    print("\nFerdig! → nb_screenshots_v3/ og nb_rapport_v3.md")

if __name__ == "__main__":
    asyncio.run(main())

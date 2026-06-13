"""
Skathelle NB Screenshot Agent
Opnar nb.no automatisk, søker og tar screenshots av artiklar.

Køyr fyrst:
  pip install playwright
  playwright install chromium

Så:
  python skathelle_screenshot_agent.py
"""

import asyncio
import json
import os
from datetime import datetime
from pathlib import Path
from playwright.async_api import async_playwright

# Mappene som vert laga
OUTPUT_DIR = Path("nb_screenshots")
RAPPORT_FIL = Path("skathelle_nb_rapport.md")

# Desse URL-ane er frå skathelle_nb_funn.md — dei viktigaste fyrst
PRIORITERTE_KJELDER = [
    # JSA — Jostedal skule- og bygdeavis
    {
        "namn": "JSA 2014",
        "api_url": "https://api.nb.no/catalog/v1/items/c6ea39b0d51f2b6b7d091d388492ea51",
        "nb_url": "https://www.nb.no/items/c6ea39b0d51f2b6b7d091d388492ea51",
    },
    {
        "namn": "JSA 2022",
        "api_url": "https://api.nb.no/catalog/v1/items/4c274f2fc1251ee3f0eb8e76c6ad688c",
        "nb_url": "https://www.nb.no/items/4c274f2fc1251ee3f0eb8e76c6ad688c",
    },
    {
        "namn": "JSA 2025",
        "api_url": "https://api.nb.no/catalog/v1/items/520969ce6ffc471bffa1934a4a5d434f",
        "nb_url": "https://www.nb.no/items/520969ce6ffc471bffa1934a4a5d434f",
    },
    # VG
    {
        "namn": "VG - skathellekasting",
        "api_url": "https://api.nb.no/catalog/v1/items/fc6e927a87f6f07ecb6fb9f50ef7259f",
        "nb_url": "https://www.nb.no/items/fc6e927a87f6f07ecb6fb9f50ef7259f",
    },
    # Bergens Tidende
    {
        "namn": "Bergens Tidende - skathellekasting",
        "api_url": "https://api.nb.no/catalog/v1/items/76df4afbf2a91d4bf6cf0a8581882f8d",
        "nb_url": "https://www.nb.no/items/76df4afbf2a91d4bf6cf0a8581882f8d",
    },
    # Fjordingen
    {
        "namn": "Fjordingen - skathellekasting",
        "api_url": "https://api.nb.no/catalog/v1/items/d72631550c5ac68d7732ed630f763066",
        "nb_url": "https://www.nb.no/items/d72631550c5ac68d7732ed630f763066",
    },
    # Sogn og Fjordane (eldre)
    {
        "namn": "Sogn og Fjordane A",
        "api_url": "https://api.nb.no/catalog/v1/items/dd0d7278510d740033b193493e648965",
        "nb_url": "https://www.nb.no/items/dd0d7278510d740033b193493e648965",
    },
    {
        "namn": "Sogn og Fjordane B",
        "api_url": "https://api.nb.no/catalog/v1/items/c39c97ed2ee7668e2f635aa9ce260e6c",
        "nb_url": "https://www.nb.no/items/c39c97ed2ee7668e2f635aa9ce260e6c",
    },
    # Bustudl barnehagebok
    {
        "namn": "Bustudl - Gaupne barnehage 1992",
        "api_url": "https://api.nb.no/catalog/v1/items/a7b41734d433ecf9bea0d8448fc69981",
        "nb_url": "https://www.nb.no/items/a7b41734d433ecf9bea0d8448fc69981",
    },
]

async def hent_metadata(page, api_url):
    """Prøvar å hente metadata frå API."""
    try:
        r = await page.evaluate(f"""
            fetch('{api_url}')
                .then(r => r.json())
                .then(d => JSON.stringify(d))
                .catch(e => JSON.stringify({{feil: e.message}}))
        """)
        return json.loads(r)
    except:
        return {}

async def prosesser_kjelde(page, kjelde, output_dir):
    """Opnar ei kjelde på nb.no og tar screenshot."""
    namn = kjelde["namn"].replace(" ", "_").replace("-", "")
    print(f"\n→ {kjelde['namn']}")

    resultat = {
        "namn": kjelde["namn"],
        "url": kjelde["nb_url"],
        "screenshot": None,
        "tittel": "",
        "år": "",
        "tekst_utdrag": "",
        "tilgjengeleg": False,
    }

    try:
        await page.goto(kjelde["nb_url"], wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(3000)

        # Hent sidetittel
        tittel = await page.title()
        resultat["tittel"] = tittel
        print(f"  Tittel: {tittel}")

        # Prøv å hente synleg tekst
        tekst = await page.evaluate("""
            () => {
                const el = document.querySelector('article') ||
                           document.querySelector('.content') ||
                           document.querySelector('main');
                return el ? el.innerText.slice(0, 500) : document.body.innerText.slice(0, 500);
            }
        """)
        resultat["tekst_utdrag"] = tekst[:400] if tekst else ""

        # Sjekk om sida krev innlogging
        if any(ord in tekst.lower() for ord in ["logg inn", "innlogging", "tilgang", "login"]):
            print("  ⚠ Krev innlogging")
            resultat["tilgjengeleg"] = False
        else:
            resultat["tilgjengeleg"] = True
            print("  ✓ Open tilgang")

        # Ta screenshot
        screenshot_sti = output_dir / f"{namn}.png"
        await page.screenshot(path=str(screenshot_sti), full_page=False)
        resultat["screenshot"] = str(screenshot_sti)
        print(f"  Screenshot: {screenshot_sti.name}")

    except Exception as e:
        print(f"  FEIL: {e}")
        resultat["feil"] = str(e)

    return resultat

def lag_rapport(alle_resultat):
    linjer = []
    linjer.append("# Skathelle — NB Screenshot-rapport")
    linjer.append(f"*Generert: {datetime.now().strftime('%d.%m.%Y %H:%M')}*")
    linjer.append("")

    opne = [r for r in alle_resultat if r.get("tilgjengeleg")]
    lukka = [r for r in alle_resultat if not r.get("tilgjengeleg")]

    linjer.append(f"## Oppsummering")
    linjer.append(f"- **{len(opne)} kjelder med open tilgang**")
    linjer.append(f"- {len(lukka)} kjelder krev innlogging")
    linjer.append("")

    if opne:
        linjer.append("## ✓ Opne kjelder — prioriter desse")
        for r in opne:
            linjer.append(f"\n### {r['namn']}")
            linjer.append(f"- URL: {r['url']}")
            if r.get("screenshot"):
                linjer.append(f"- Screenshot: `{r['screenshot']}`")
            if r.get("tekst_utdrag"):
                linjer.append(f"- Utdrag:\n  > {r['tekst_utdrag'][:200]}")

    if lukka:
        linjer.append("\n## ⚠ Krev innlogging")
        linjer.append("*Desse må du opne manuelt på nb.no med din eigen brukar.*")
        for r in lukka:
            linjer.append(f"- [{r['namn']}]({r['url']})")

    return "\n".join(linjer)

async def main():
    OUTPUT_DIR.mkdir(exist_ok=True)
    print("Startar NB Screenshot Agent...")
    print(f"Screenshots vert lagra i: {OUTPUT_DIR.absolute()}\n")

    alle_resultat = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)  # headless=False so du kan sjå kva som skjer
        page = await browser.new_page()
        await page.set_viewport_size({"width": 1280, "height": 900})

        for kjelde in PRIORITERTE_KJELDER:
            resultat = await prosesser_kjelde(page, kjelde, OUTPUT_DIR)
            alle_resultat.append(resultat)
            await asyncio.sleep(2)  # Ver høfleg

        await browser.close()

    rapport = lag_rapport(alle_resultat)
    RAPPORT_FIL.write_text(rapport, encoding="utf-8")

    print(f"\n{'='*50}")
    print("Ferdig!")
    print(f"→ {RAPPORT_FIL} (les denne)")
    print(f"→ {OUTPUT_DIR}/ (screenshots)")

if __name__ == "__main__":
    asyncio.run(main())

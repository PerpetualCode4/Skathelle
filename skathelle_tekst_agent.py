"""
Skathelle NB Tekst-agent
Hentar sjølve teksten frå avisartiklane via NB sitt IIIF/fulltekst-API
og samlar alt i ei lesbar .md-fil.

Køyr: python skathelle_tekst_agent.py
"""

import requests
import json
from pathlib import Path
from datetime import datetime
from urllib.parse import urlparse, parse_qs

# URLane me fann tidlegare
KJELDER = [
    {"namn": "Fjordingen 1979-08-10", "url": "https://www.nb.no/items/d72631550c5ac68d7732ed630f763066?page=6&searchText=skathellekasting"},
    {"namn": "Ukjend avis A", "url": "https://www.nb.no/items/82b2c125e17141cbca22a7a21b4064bf?page=1&searchText=skathellekasting"},
    {"namn": "Sogn og Fjordane 1987-07-22", "url": "https://www.nb.no/items/c39c97ed2ee7668e2f635aa9ce260e6c?page=2&searchText=skathellekasting"},
    {"namn": "Ukjend avis B", "url": "https://www.nb.no/items/13bbf30557690a18a205219c0b37a1d0?page=1&searchText=skathellekasting"},
    {"namn": "Sogningen-Sogns Avis 1987-07-21", "url": "https://www.nb.no/items/db2668b95450452d534aef09e8c7025d?page=7&searchText=skathellekasting"},
    {"namn": "Ukjend avis C", "url": "https://www.nb.no/items/59fe4978afddb51498db0a6303dcfa0f?page=2&searchText=skathelle%20jostedalen"},
    {"namn": "Ukjend avis D", "url": "https://www.nb.no/items/0383b045a8825af62c53d659139edd89?page=6&searchText=skathelle%20jostedalen"},
    {"namn": "Ukjend avis E", "url": "https://www.nb.no/items/9cdae8a429ba5a93bb9254356bdcc09e?page=0&searchText=skathelle%20jostedalen"},
    {"namn": "Ukjend avis F", "url": "https://www.nb.no/items/86477e89f319343d1b2ebbbae00a069a?page=2&searchText=skathelle%20jostedalen"},
    {"namn": "Ukjend avis G", "url": "https://www.nb.no/items/e052daa53442368a8c19b444e7b60a5e?page=10&searchText=skathelle%20jostedalen"},
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

def hent_item_id(url):
    """Hent item-ID og sidenummer frå URL."""
    path = urlparse(url).path
    item_id = path.split("/items/")[-1].split("?")[0]
    params = parse_qs(urlparse(url).query)
    side = int(params.get("page", [0])[0])
    return item_id, side

def hent_metadata(item_id):
    """Hent metadata om avisa."""
    url = f"https://api.nb.no/catalog/v1/items/{item_id}"
    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        if r.status_code == 200:
            data = r.json()
            meta = data.get("metadata", {})
            return {
                "tittel": meta.get("title", ""),
                "år": meta.get("originYear", ""),
                "avis": meta.get("seriesTitle", ""),
                "dato": meta.get("date", ""),
                "stad": meta.get("placeOfPublication", ""),
            }
    except:
        pass
    return {}

def hent_fulltekst(item_id, side):
    """Prøver å hente fulltekst frå NB sitt tekst-API."""
    # NB har eit fulltekst-API for digitaliserte aviser
    urls_å_prøve = [
        f"https://api.nb.no/catalog/v1/items/{item_id}/pages/{side}/fulltext",
        f"https://api.nb.no/catalog/v1/items/{item_id}/fulltextpage/{side}",
        f"https://api.nb.no/catalog/v1/items/{item_id}/alto/{side}",
    ]
    for url in urls_å_prøve:
        try:
            r = requests.get(url, headers=HEADERS, timeout=15)
            if r.status_code == 200:
                data = r.json()
                # Prøv ulike felt
                tekst = (
                    data.get("text") or
                    data.get("content") or
                    data.get("fulltext") or
                    str(data)[:2000]
                )
                if tekst and len(str(tekst)) > 50:
                    return str(tekst)[:3000], url
        except:
            pass
    return None, None

def søk_i_item(item_id, søkeord="skathelle"):
    """Søker etter kontekst rundt søkeordet i heile avisa."""
    url = f"https://api.nb.no/catalog/v1/items/{item_id}/search?q={søkeord}"
    try:
        r = requests.get(url, headers=HEADERS, timeout=15)
        if r.status_code == 200:
            data = r.json()
            return json.dumps(data, ensure_ascii=False)[:3000]
    except:
        pass
    return None

def main():
    print("Skathelle Tekst-agent startar...\n")
    linjer = [
        "# Skathelle — Tekst frå Nasjonalbiblioteket",
        f"*Generert: {datetime.now().strftime('%d.%m.%Y %H:%M')}*",
        "",
        "---",
        ""
    ]

    for kjelde in KJELDER:
        item_id, side = hent_item_id(kjelde["url"])
        print(f"→ {kjelde['namn']} (id: {item_id}, side: {side})")

        # Metadata
        meta = hent_metadata(item_id)
        
        linjer.append(f"## {kjelde['namn']}")
        if meta.get("avis"):
            linjer.append(f"**Avis:** {meta['avis']}")
        if meta.get("dato") or meta.get("år"):
            linjer.append(f"**Dato:** {meta.get('dato') or meta.get('år')}")
        linjer.append(f"**Side:** {side}")
        linjer.append(f"**URL:** {kjelde['url']}")
        linjer.append("")

        # Fulltekst
        tekst, kjelde_url = hent_fulltekst(item_id, side)
        if tekst:
            print(f"  ✓ Fulltekst funne")
            linjer.append("**Tekst:**")
            linjer.append(f"```")
            linjer.append(tekst)
            linjer.append(f"```")
        else:
            print(f"  → Prøver søke-API...")
            søk = søk_i_item(item_id)
            if søk:
                print(f"  ✓ Søkeresultat funne")
                linjer.append("**Søkeresultat (rådata):**")
                linjer.append(f"```")
                linjer.append(søk[:1000])
                linjer.append(f"```")
            else:
                print(f"  ✗ Ingen tekst tilgjengeleg (krev truleg innlogging)")
                linjer.append("*Tekst ikkje tilgjengeleg utan innlogging.*")

        linjer.append("")
        linjer.append("---")
        linjer.append("")

    output = "\n".join(linjer)
    Path("skathelle_tekst.md").write_text(output, encoding="utf-8")
    print("\nFerdig! → skathelle_tekst.md")

if __name__ == "__main__":
    main()

"""
Skathelle NB Agent
Søker i Nasjonalbibliotekets katalog-API og samlar funn i ei .md-fil.
Køyr: python skathelle_nb_agent.py

Krev: pip install requests
"""

import requests
import json
from datetime import datetime

SØKEORD = [
    "skathelle",
    "skathellekasting",
    "skathelle jostedalen",
]

def søk_nb_katalog(søkeord, antal=20):
    """Søker i NB sitt opne katalog-API."""
    url = "https://api.nb.no/catalog/v1/items"
    params = {
        "q": søkeord,
        "size": antal,
        "mediatype": "aviser",
    }
    try:
        r = requests.get(url, params=params, timeout=15)
        if r.status_code != 200:
            return [], f"Feil {r.status_code}: {r.text[:100]}"
        data = r.json()
        treff = []
        items = data.get("_embedded", {}).get("items", [])
        for item in items:
            meta = item.get("metadata", {})
            treff.append({
                "tittel": meta.get("title", "ukjend"),
                "år": meta.get("originYear", "ukjend"),
                "avis": meta.get("seriesTitle", ""),
                "stad": meta.get("placeOfPublication", ""),
                "url": item.get("_links", {}).get("self", {}).get("href", ""),
                "id": meta.get("identifiers", {}).get("urn", ""),
            })
        totalt = data.get("page", {}).get("totalElements", 0)
        return treff, f"{totalt} treff totalt"
    except Exception as e:
        return [], str(e)

def søk_nb_freetext(søkeord, antal=20):
    """Søker i fulltekst via NB sitt søke-API."""
    url = "https://api.nb.no/catalog/v1/items"
    params = {
        "q": søkeord,
        "size": antal,
    }
    try:
        r = requests.get(url, params=params, timeout=15)
        if r.status_code != 200:
            return [], f"Feil {r.status_code}"
        data = r.json()
        treff = []
        items = data.get("_embedded", {}).get("items", [])
        for item in items:
            meta = item.get("metadata", {})
            treff.append({
                "tittel": meta.get("title", "ukjend"),
                "år": meta.get("originYear", "ukjend"),
                "type": meta.get("mediaType", ""),
                "url": item.get("_links", {}).get("self", {}).get("href", ""),
            })
        totalt = data.get("page", {}).get("totalElements", 0)
        return treff, f"{totalt} treff totalt"
    except Exception as e:
        return [], str(e)

def lag_md_rapport(alle_funn):
    linjer = []
    linjer.append("# Skathelle — Research frå Nasjonalbiblioteket")
    linjer.append(f"*Generert: {datetime.now().strftime('%d.%m.%Y %H:%M')}*")
    linjer.append("")

    for søkeord, data in alle_funn.items():
        linjer.append(f"## Søkeord: \"{søkeord}\"")
        linjer.append("")

        for type_søk, (treff, info) in data.items():
            linjer.append(f"### {type_søk} — {info}")
            if not treff:
                linjer.append("*Ingen treff.*")
            else:
                for t in treff:
                    linjer.append(f"- **{t.get('tittel', '')}**")
                    if t.get("år"):
                        linjer.append(f"  - År: {t['år']}")
                    if t.get("avis"):
                        linjer.append(f"  - Avis: {t['avis']}")
                    if t.get("type"):
                        linjer.append(f"  - Type: {t['type']}")
                    if t.get("url"):
                        linjer.append(f"  - [Opne på nb.no]({t['url']})")
            linjer.append("")

    linjer.append("---")
    linjer.append("## Manuelle søkelenker")
    linjer.append("")
    for s in SØKEORD:
        q = s.replace(" ", "+")
        linjer.append(f"- [nb.no avissøk: {s}](https://www.nb.no/search?q={q}&mediatype=aviser)")
    linjer.append("")
    linjer.append("*NB: Ta screenshots av artiklar du finn. Spør historielaget om originaldokument.*")

    return "\n".join(linjer)

def main():
    print("Startar søk i Nasjonalbiblioteket...\n")
    alle_funn = {}

    for søkeord in SØKEORD:
        print(f"Søker: \"{søkeord}\"")
        alle_funn[søkeord] = {}

        print("  → Avissøk...")
        treff, info = søk_nb_katalog(søkeord)
        alle_funn[søkeord]["Aviser"] = (treff, info)
        print(f"     {info}")

        print("  → Fulltekstsøk...")
        treff2, info2 = søk_nb_freetext(søkeord)
        alle_funn[søkeord]["Alt materiale"] = (treff2, info2)
        print(f"     {info2}")
        print()

    rapport = lag_md_rapport(alle_funn)

    with open("skathelle_nb_funn.md", "w", encoding="utf-8") as f:
        f.write(rapport)

    with open("skathelle_nb_funn.json", "w", encoding="utf-8") as f:
        json.dump(
            {k: {t: (r, i) for t, (r, i) in v.items()} for k, v in alle_funn.items()},
            f, ensure_ascii=False, indent=2
        )

    print("Ferdig!")
    print("→ skathelle_nb_funn.md  (les denne — opne i VS Code eller Notepad)")
    print("→ skathelle_nb_funn.json (rådata)")

if __name__ == "__main__":
    main()

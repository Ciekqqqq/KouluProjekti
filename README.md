# SplitBill – yhteisten kulujen jakosovellus

SplitBill on responsiivinen CRUD-verkkosovellus, jolla voi tallentaa yhteisiä kuluja
(kulun nimi, summa, maksaja, osallistujien määrä ja kategoria) ja laskea, paljonko
kukin osallistuja maksaa. Tieto säilyy JSON Serverin `db.json`-tiedostossa ja kaikki
toiminnot tehdään REST-rajapinnan kautta `fetch()`-funktiolla.

## Ominaisuudet

- Kolme erillistä näkymää: **Kulut**, **Lisää kulu** ja **Yhteenveto**, yhteinen navigaatio ja ulkoasu.
- Kulujen listaus, lisääminen, muokkaaminen ja poistaminen (CRUD) REST-rajapinnan kautta.
- Yhteenveto: kulujen määrä, yhteissumma ja osuus henkilöä kohden.
- Järjestys: uusin ensin, suurin summa tai nimi aakkosissa.
- HTML:n oma lomakevalidointi (`required`, `min`, `max`, `maxlength`, `type`).
- Vaalea ja tumma teema järjestelmän asetuksen mukaan (`color-scheme` + `light-dark()`).
- Responsiivinen mobile-first-asettelu CSS Gridillä ja Flexboxilla.
- Saavutettavuus: semanttinen HTML, label-elementit, `aria-live`-palautteet, näppäimistökäyttö, fokusrenkaat.

## Teknologiat

| Teknologia | Käyttö |
|---|---|
| HTML5 | Semanttinen rakenne, lomakkeet, `dialog`, `details`, `datalist`, Popover API |
| CSS3 | Grid, Flexbox, media queries, `color-scheme`, `light-dark()`, `:user-invalid` |
| JavaScript (ES2020+) | DOM, tapahtumankäsittely, taulukkomemetodit, `fetch()` |
| JSON Server | REST API ja tietojen tallennus (`db.json`) |
| Git ja GitHub | Versionhallinta ja repositorio |

Projekti ei käytä Reactia, omaa Node.js-palvelinta eikä SQL-tietokantaa.

## Käynnistys

Vaatimukset: Node.js ja npm.

```bash
# 1. Asenna riippuvuudet
npm install

# 2. Käynnistä JSON Server (portti 3000, tarjoilee myös staattiset tiedostot)
npm run server

# 3. Avaa selain
# http://localhost:3000
```

JSON Server tarjoilee sekä rajapinnan että `index.html`, `style.css` ja `script.js`,
joten sovellus toimii samasta osoitteesta. Palvelin lukee ja kirjoittaa `db.json`-tiedostoa,
joten muutokset säilyvät palvelimen uudelleenkäynnistyksen jälkeen.

## REST-rajapinta

| Toiminto | Metodi | Osoite |
|---|---|---|
| Listaa kulut | `GET` | `/expenses` |
| Hae yksi kulu | `GET` | `/expenses/:id` |
| Lisää kulu | `POST` | `/expenses` |
| Muokkaa kulua | `PATCH` | `/expenses/:id` |
| Poista kulu | `DELETE` | `/expenses/:id` |

Rajapinnan osoite on määritelty `script.js`-tiedoston alussa:

```js
const API_URL = 'http://localhost:3000/expenses';
```

## Projektin rakenne

```
KouluProjekti/
├── index.html      # Rakenne: header, nav, main, kolme näkymää, dialog, popover, footer
├── style.css       # Tyylit: mobile-first, Grid/Flexbox, teemat, validointitilat
├── script.js       # REST-kutsut, näkymien vaihto, DOM-renderöinti, tapahtumat
├── db.json         # JSON Serverin tietokanta (expenses-kokoelma)
├── package.json    # Riippuvuudet ja npm run server -komento
└── README.md       # Tämä tiedosto
```

## Tietomalli

```json
{
  "id": "1",
  "name": "Päivällinen",
  "amount": 30,
  "payer": "Aino",
  "participants": 3,
  "category": "Ruoka"
}
```

`id` syntyy JSON Serverissä automaattisesti, kun kulu lisätään.

## Virhetilanteet

Jos palvelin ei vastaa tai vastaa virheellä, käyttäjälle näytetään `aria-live`-alueella
selkokielinen ilmoitus (esimerkiksi kehotus käynnistää JSON Server). Sovellus ei jää
tyhjän päälle ilman palautetta.

## Tekijä

Ciekqqqq – KouluProjekti

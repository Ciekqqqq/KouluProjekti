# SplitBill – yhteisten kulujen jakaminen

SplitBill on responsiivinen verkkosovellus, johon voi tallentaa yhteisiä kuluja. Se näyttää kulun summan, maksajan, osallistujat ja kategorian sekä laskee summan osallistujaa kohden. Tiedot tallennetaan `db.json`-tiedostoon JSON Serverin kautta.

## Käynnistys

Tarvitset Node.js:n ja npm:n. Suorita projektikansiossa:

```bash
npm install
npm run server
```

Avaa selaimessa **http://127.0.0.1:3000**. Pidä palvelin käynnissä käytön ajan. JSON Server tarjoaa samalla verkkosivun ja REST-rajapinnan. Selaimen omana tiedostona (`file://`) avattu sivu ei riitä CRUD-toimintoihin.

## Ominaisuudet ja tekniikat

- **Kulut**, **Lisää kulu** ja **Yhteenveto** ovat kolme erillistä näkymää.
- Kuluja voi listata, lisätä, muokata ja poistaa. Lista päivittyy toiminnon jälkeen.
- Yhteenveto laskee kulujen määrän, yhteissumman ja jokaisen kulun osuuden osallistujaa kohden.
- HTML: semanttiset elementit, lomakkeet ja niiden oma validointi, `datalist`, `details`, muokkaus-`dialog` ja poistamisen Popover.
- CSS: mobile-first, Grid ja Flexbox, vaalea ja tumma teema järjestelmän asetuksen mukaan (`color-scheme` ja `light-dark()`).
- JavaScript: tapahtumat, DOM, taulukot ja oliot, `fetch()` sekä virheilmoitukset.
- JSON Server: REST API ja `db.json`-tiedoston `expenses`-kokoelma. Git ja GitHub: versionhallinta.

Projekti ei käytä Reactia, omaa Node.js-palvelinta eikä SQL-tietokantaa.

## Lyhyt projektisuunnitelma

**Aihe:** yhteisten kulujen kirjaaminen ja jakaminen. **Tekijä:** Ciekqqqq, tehty yksin; HTML, CSS, JavaScript, tietokanta, testaus ja ohjeistus ovat saman tekijän työtä. Kurssin tekniikoiden lisäksi Node.js ja npm käynnistävät valmiin JSON Serverin; koodi kirjoitetaan tavallisella HTML:llä, CSS:llä ja JavaScriptillä.

**Aikataulu:** viikko 1: suunnittelu ja HTML; viikko 2: responsiivinen CSS ja teemat; viikko 3: JSON Server ja CRUD; viikko 4: toiminnan kokeilu, virhetilanteet ja esittely. Tämä on projektin vaiheistus, ei palautuspäivä.

| Riski | Ratkaisu |
|---|---|
| Palvelin ei käynnisty | Asenna riippuvuudet ja käynnistä `npm run server`; varmista, että portti 3000 on vapaa. |
| Pyyntö epäonnistuu | Näytä käyttäjälle virheilmoitus ja tietojen latauksessa uudelleenyrityspainike. |
| Puhelimen näkymä hajoaa | Aloita kapean näytön tyyleistä ja tarkista myös tabletti ja tietokone. |
| Työtä kertyy liikaa | Rajaa sovellus yhteen tietokokoelmaan ja kolmeen näkymään. |

## Näin selitän koodin esittelyssä

1. **`index.html` on rakenne.** `header` ja `nav` ovat yläosa ja valikko, `main` sisältää kolme `section`-näkymää. Lisäämislomake käyttää `required`-, `type`-, `min`-, `max`- ja `maxlength`-määrityksiä. Selain tarkistaa syötteet itse. `datalist` ehdottaa kategorioita ja `details` avaa laskuohjeen.
2. **`style.css` tekee asettelun.** Perustyylit sopivat puhelimelle; `@media (min-width: 650px)` asettaa kenttiä ja yhteenvetolaatikoita vierekkäin leveämmällä näytöllä. `light-dark()` valitsee värit laitteen teeman mukaan.
3. **`script.js` hakee tiedot.** `apiRequest()` kutsuu `fetch()`-funktiota, tarkistaa vastauksen ja näyttää virheen tarvittaessa. `loadExpenses()` hakee kulut taulukkoon ja `renderAll()` piirtää tiedot sivulle.
4. **CRUD tapahtuu palvelimella.** GET lukee, POST lisää, PATCH muokkaa ja DELETE poistaa. Tapahtumankuuntelijat (`addEventListener`) käynnistävät pyynnöt. Onnistuneen muutoksen jälkeen tiedot haetaan uudelleen, jolloin näkymä vastaa `db.json`-tiedoston sisältöä.
5. **Taulukot ja oliot käsittelevät kuluja.** Jokainen kulu on olio (`name`, `amount`, `payer`, `participants`, `category`). `find()` etsii muokattavan kulun, `sort()` järjestää listan, `reduce()` laskee summan ja `map()` rakentaa yhteenvedon rivit. `share()` jakaa kulun summan osallistujien määrällä.
6. **Muokkaus ja poisto ovat eri käyttötilanteita.** `dialog` sisältää muokkauslomakkeen, Popover pyytää vahvistuksen ennen poistoa. Virheet näytetään `aria-live`-viestialueella, ja painikkeita sekä lomakkeita voi käyttää näppäimistöllä.

### Esittelyn kulku

Käynnistä palvelin ja näytä `db.json`. Lisää esimerkkikulu, näytä sen ilmestyminen listaan ja `db.json`-tiedostoon, muokkaa sitä, vaihda järjestystä ja poista se. Avaa yhteenveto, näytä vaalea/tumma teema ja kapea näkymä. Näytä lopuksi `script.js`-tiedoston `apiRequest()` ja tapahtumankäsittelijät sekä GitHubin usean commitin historia. Palvelimen pysäyttämällä voit näyttää myös ymmärrettävän virheilmoituksen.

## Vaatimuslista: mistä kohta näkyy

| # | Näyttö sovelluksessa |
|---|---|
| 1 | SplitBill kirjaa ja jakaa yhteisiä kuluja. |
| 2 | Kolme näkymää ja yhteinen navigaatio: `index.html`. |
| 3 | `header`, `nav`, `main`, `section`, `article`, `footer`: `index.html` ja `script.js`. |
| 4–5 | Mobile-first, Grid ja Flexbox: `style.css`. Tarkista puhelin, tabletti ja tietokone selaimessa. |
| 6 | `color-scheme` ja `light-dark()`: `style.css`. |
| 7–8 | `label`, kenttien HTML-ominaisuudet ja selaimen oma validointi: `index.html`; `:user-invalid`: `style.css`. |
| 9–10 | Kategorian `datalist` ja laskuohjeen `details`/`summary`: `index.html`. |
| 11–12 | Muokkaus-`dialog` ja poistamisen Popover: `index.html` ja `script.js`. |
| 13–15 | `addEventListener()`, DOM-päivitys, `expenses`-taulukko ja `find()`/`sort()`/`reduce()`/`map()`: `script.js`. |
| 16–18 | `db.json` sekä GET, POST, PATCH ja DELETE `fetch()`-kutsuilla: `script.js`. |
| 19–20 | `loadExpenses()` päivittää näkymän CRUDin jälkeen; pyyntövirheet näkyvät viestialueella. |
| 21–22 | Erilliset HTML-, CSS- ja JS-tiedostot, kuvaavat funktiot, kenttien `label`-elementit, fokusmuotoilu ja näppäimistöllä toimivat hallintaelementit. Sovelluksessa ei ole kuvia. |
| 23–24 | GitHub-repositorio sisältää lähdekoodin, `db.json`-tiedoston ja useita työvaiheita kuvaavia committeja. |
| 25 | Tämä README sisältää tarkoituksen, ominaisuudet, tekniikat ja käynnistysohjeen. |
| 26 | Edellä oleva esittelyjärjestys näyttää CRUDin, tiedot, `fetch()`-kutsut ja commit-historian. |

## REST API

| Toiminto | Pyyntö |
|---|---|
| Lue kulut | `GET /expenses` |
| Lisää kulu | `POST /expenses` |
| Muokkaa kulu | `PATCH /expenses/:id` |
| Poista kulu | `DELETE /expenses/:id` |

API-osoite määritetään `script.js`-tiedoston alussa. `db.json` sisältää `expenses`-taulukon ja esimerkkikuluja.

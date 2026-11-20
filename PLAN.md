# Projektisuunnitelma – SplitBill

## Aihe

SplitBill on yhteisten kulujen jakosovellus. Käyttäjä tallentaa kulun (nimi, summa,
maksaja, osallistujien määrä, kategoria), muokkaa ja poistaa niitä sekä näkee
yhteenvedon, jossa jokaisen kulun osuus henkilöä kohden on valmiiksi laskettu.
Käyttötarkoitus: esimerkiksi opiskelijaporukan ruokalaskujen, junalippujen ja
yhteisten ostosten jako yhdessä paikassa.

## Työpari ja työnjako

Työpari: _[täytä työparin nimi tai "tehty yksin"]_

| Osio | Tekijä |
|---|---|
| HTML-rakenne ja lomakkeet | Ciekqqqq |
| CSS, teemat ja responsiivisuus | Ciekqqqq |
| JavaScript, REST-kutsut ja CRUD | Ciekqqqq |
| db.json, README ja testaus | Ciekqqqq |

## Ohjelmointityökalut ja -kielet

Kurssilla esiteltyjen lisäksi ei tule uusia kieliä tai kehyksiä. Käytössä:

- HTML5, CSS3, JavaScript (ES2020+)
- JSON Server 1.0.0-beta (REST API + staattisten tiedostojen tarjoilu)
- Node.js ja npm (vain riippuvuuksien asennukseen ja JSON Serverin käynnistykseen)
- Git ja GitHub versionhallintaan
- Selain (Chrome/Edge) ja VS Code

Ei Reactia, ei omaa Node.js-palvelinta, ei SQL-tietokantaa.

## Aikataulu

| Vaihe | Sisältö | Tavoite |
|---|---|---|
| 1 | Suunnitelma, aihe, tietomalli, db.json | viikko 1 |
| 2 | Semanttinen HTML-runko ja kolme näkymää | viikko 1 |
| 3 | CSS: mobile-first, Grid/Flexbox, teemat, validointitilat | viikko 2 |
| 4 | JSON Server käyntiin, GET-lataus ja renderöinti | viikko 2 |
| 5 | POST, PATCH ja DELETE + virheiden käsittely | viikko 3 |
| 6 | Dialog, popover, details, datalist, saavutettavuus | viikko 3 |
| 7 | Testaus (puhelin, tabletti, työpöytä, virhetilanteet) | viikko 4 |
| 8 | README, commit-historian viimeistely, esittely | viikko 4 |

## Riskit ja niiden eliminointi

| Riski | Eliminointi |
|---|---|
| JSON Server ei käynnisty tai portti 3000 on varattu | `npm run server` -komento testataan heti alussa; portti vaihdettavissa `package.json`-tiedostossa ja `API_URL`-vakiona |
| Data katoaa, koska CRUD tehdään vain selaimeen (localStorage) | Kaikki tallennus JSON Serveriin; `db.json` commitoidaan repositorioon |
| Palvelin ei vastaa esittelyssä | Virheilmoitus `aria-live`-alueella ja README:n käynnistysohjeet; sovellus ei kaadu |
| Ulkoasu hajoaa kapealla näytöllä | Mobile-first-tyylit, `minmax(min(100%, 270px), 1fr)` -grid, testaus 375 px:n leveydellä |
| Liian suuri työmäärä aikatauluun | Rajattu kolmeen näkymään ja yhteen tietokokoelmaan; ylimääräiset ideat jätetty pois |
| Git-historia jää yhteen committiin | Työ jaetaan vaiheisiin ja jokainen vaihe commitoidaan erikseen |
| Lomakkeen virheellinen syöte rikkoo datan | HTML:n oma validointi (`required`, `min`, `max`, `maxlength`) estää lähetyksen |

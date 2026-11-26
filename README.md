# SplitBill

SplitBillillä kirjaat yhteiset kulut ja näet, paljonko kukin maksaa. Kuluja voi lisätä, listata, muokata, poistaa ja järjestää. Yhteenveto näyttää yhteissumman ja osuuden henkilöä kohden.

Tekniikat: HTML, CSS, JavaScript, JSON Server, REST API, Git ja GitHub.

## Käynnistys

Asenna Node.js (v22.12 tai uudempi) ja suorita projektikansiossa:

```sh
npm ci
npm run server
```

Avaa selaimessa [127.0.0.1:3000](http://127.0.0.1:3000). JSON Server näyttää sivun ja tallentaa kulut `db.json`-tiedostoon.

## Projektisuunnitelma

- Aihe: yhteisten kulujen jakaminen.
- Työnjako: tein projektin yksin.
- Lisätyökalut: Node.js ja npm JSON Serverin käynnistämiseen.
- Aikataulu: viikko 1 rakenne, viikko 2 ulkoasu, viikko 3 CRUD, viikko 4 testaus ja esittely.
- Riskit: palvelinvirheestä näytetään ilmoitus ja latausta voi yrittää uudelleen. Ulkoasu tarkistetaan kolmella näyttöleveydellä.

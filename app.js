/* Testaa Fölin avoimen data rajapintaa osoitteessa data.foli.fi
** http://data.foli.fi/siri/sm/"pysäkintunniste" - Pysäkkikohtainen ennuste pysäkistä "pysäkintunniste"
*/

// Funktio pysäkin vaihtamiseksi
function vaihdaPysäkki() {
  window.clearInterval(); // Pysäyttää sivun automaattisen päivittämisen
  pysäkki = document.getElementById('vaihdapysakkiin').value;
  pysäkkiävaihdettu = true;
  initData();
}

// Asynkroninen funktio, joka selvittää pysäkin nimen sen ID-tunnisteen perusteella
async function haePysäkinNimi(id) {
  // const url = 'http://data.foli.fi/gtfs/stops';
  
  // URL-osoitteen muodostaminen
  var url = hostname + path_stopnames;
  
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.onload = function() {
    if (request.status === 200) {
      const data = JSON.parse(request.responseText);
      try {
        pysäkkinimihaettu = Object(data[id].stop_name);
        console.log('Pysäkin nimi löytyi: ' + pysäkkinimihaettu);
        entinenpysäkki = pysäkki;
      } catch {
        console.log('Pysäkin nimeä ei löytynyt');
        pysäkki = entinenpysäkki;
        document.getElementById('vaihdapysakkiin').value = '';
        window.alert('Syöttämääsi pysäkkiä ei löytynyt.'); // Avaa selaimeen Alert-ikkunan, mikäli pysäkkiä ei löydy.
      }
    } else {
      console.log('Palvelin saavutettavissa, mutta palauttaa virheen.');
    }
  }

  request.onerror = function() {
    console.error('Virhe haettaessa JSON:ia osoitteesta ' + url);
  };

  request.send();

}

// Alla parametrit yhteyden muodostamiseen fölin palvelimelle (oletuksena haetaan tiedot pysäkiltä numero 100)
var pysäkki = '100';
var pysäkkinimi = 'testi';
var hostname = 'http://data.foli.fi';
var path_stops = '/siri/sm/';
var path_stopnames = '/gtfs/stops';

var pysäkkiävaihdettu = true; // Onko käyttäjä vaihtanut pysäkkiä, jolloin pysäkin nimi pitää selvittää.
var entinenpysäkki = pysäkki;
var pysäkkinimihaettu;
let result;

// Tapahtumankäsittelijä Enter-napille: Tarvitaan, jottei koko sivua ladata uudelleen, kun Enteriä painetaan.
let tekstikenttä_vaihdapysäkkiin = document.getElementById('vaihdapysakkiin');
tekstikenttä_vaihdapysäkkiin.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    console.log('Enter painettu');
    document.getElementById('vaihtonappi').click();
  }
});

// Tekstikenttä, johon syötetään halutun pysäkin tunniste
var input = document.getElementById("vaihdapysäkkiin");

// Asynkroninen funktio, joka hakee fölin palvelimelta tiedot seuraavaksi saapuvista busseista
async function updateBusDataAsync() {
  console.log('Päivitetään pysäkin ' + pysäkki + ' tiedot.');
  
  if (pysäkkiävaihdettu) {
    haePysäkinNimi(pysäkki);
    pysäkkiävaihdettu = false;
  }

  // URL-osoitteen muodostaminen
  var url = hostname + path_stops + pysäkki;

  let response = await fetch(url);
  let myJson = await response.json();

  var date = new Date();
  var now = Math.round(date.getTime() / 1000); // Sekunnit keskiyöstä 1. Tammikuuta 1970
   
  var saapuvienlkm = Object.keys(myJson.result).length; // Kuinka monen pysäkille saapuvan bussin tiedot JSON-viestissä on (= parseData.result objektien lukumäärä)
    
  if (saapuvienlkm > 5) { // Näytetään kerrallaan maksimissaan viisi seuraavaa bussia vaikka palvelimella olisi tiedot useammasta
    saapuvienlkm = 5;
  }

  // Taulukoiden alustaminen
  let linja = [0, 0, 0, 0, 0];
  let kohde = [0, 0, 0, 0, 0];
  let aika = [0, 0, 0, 0, 0];
  linja.fill('--');
  kohde.fill('--');
  aika.fill('--');

  // Ilmoitetaan käyttäjälle mikäli pysäkkitiedoissa ei ole lähteviä busseja
  if (saapuvienlkm === 0) {
    linja[0] = 'Lähtöjä ei ole saatavilla.';
  }

  // Käydään läpi JSON-datassa olevat lähdöt ja tallennetaan taulukoihin linja[], kohde[] ja aika[]
  for (var j = 0; j < saapuvienlkm; j++) {
    // Tarkastus: jos arvioitu lähtöaika on menneisyydessä, siirrytään seuraavaan lähtöön (fölin palvelimelta saadaan satunnaisesti vanhentunutta tietoa).
    if (myJson.result[j].expecteddeparturetime < now) {
      j++;
    }
    linja[j] = myJson.result[j].lineref; // Bussilinja
    kohde[j] = myJson.result[j].destinationdisplay; // Määränpää
    aika[j] = Math.round((myJson.result[j].expecteddeparturetime - now) / 60); // Lasketaan kuinka monta minuuttia on arvioituun lähtöaikaan
    aika[j].toString();
    aika[j] = aika[j] + ' min';
  }

  // HTML-sivulla olevien elementtien päivittäminen
  var tags = ["pysäkki", "pysäkkinimi","linja0", "kohde0", "aika0", "linja1", "kohde1", "aika1", "linja2", "kohde2", "aika2",
              "linja3", "kohde3", "aika3", "linja4", "kohde4", "aika4"],
      corr = [pysäkki, pysäkkinimihaettu, linja[0], kohde[0], aika[0], linja[1], kohde[1], aika[1], linja[2], kohde[2], aika[2],
              linja[3], kohde[3], aika[3], linja[4], kohde[4], aika[4]];

  for (var i = 0; i < tags.length; i++) {
    document.getElementById(tags[i]).firstChild.nodeValue = corr[i];
  }
}

function initData () {
  updateBusDataAsync();
  window.setInterval(updateBusDataAsync, 10000); // Päivitetään ikkuna 10 sekunnin välein
}

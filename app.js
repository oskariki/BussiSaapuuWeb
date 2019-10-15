/*Testaa Fölin avoimen data rajapintaa osoitteessa data.foli.fi
**http://data.foli.fi/siri/sm/"pysäkintunniste" - Pysäkkikohtainen ennuste pysäkistä "pysäkintunniste"
*/

//funktio pysäkin vaihtamiseksi
function vaihdaPysäkki() {
  console.log("painettu" + pysäkki);
  window.clearInterval();
  pysäkki = document.getElementById("vaihdapysakkiin").value;
  console.log("painettu" + pysäkki);
  initData();
}

//asynkroninen funktio, joka selvittää pysäkin nimen sen ID-tunnisteen perusteella
async function haePysäkinNimi(id) {
  //const url = 'http://data.foli.fi/gtfs/v0/20191008-105302/stops';
  const url = 'http://data.foli.fi/gtfs/stops';
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.onload = function() {
    if (request.status === 200) {
      const data = JSON.parse(request.responseText);
      pysäkkinimihaettu = Object(data[id].stop_name);
      
    } else {
      console.log("Palvelin saavutettavissa, mutta palauttaa virheen.")
    }   
  }

  request.onerror = function() {
    console.error('An error occurred fetching the JSON from ' + url);
  };

  request.send();

}

//alla parametrit yhteyden muodostamiseen fölin palvelimelle (oletuksena haetaan tiedot pysäkiltä numero 100)
var pysäkki = '100';
var pysäkkinimi = 'testi';
var hostname = 'http://data.foli.fi';
var path = '/siri/sm/';

var pysäkkinimihaettu;
let result;

// Tapahtumankäsittelijä Enter-napille: Tarvitaan, jottei koko sivua ladata uudelleen, kun Enteriä painetaan.
let tekstikenttä_vaihdapysäkkiin = document.getElementById('vaihdapysakkiin');
tekstikenttä_vaihdapysäkkiin.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
      event.preventDefault();
      console.log("Enter painettu");
      document.getElementById("vaihtonappi").click();
  }
});

// tekstikenttä, johon syötetään halutun pysäkin tunniste
var input = document.getElementById("vaihdapysäkkiin");

//asynkroninen funktio, joka hakee fölin palvelimelta tiedot seuraavaksi saapuvista busseista
async function updateBusDataAsync() {
    console.log("Tämänhetkinen pysäkki: " + pysäkki);
    
    haePysäkinNimi(pysäkki);
    console.log(pysäkkinimihaettu);
    
    //url-osoitteen muodostaminen
    var url = hostname + path + pysäkki;

    const response = await fetch(url);
    const myJson = await response.json();

    var date = new Date();
    var now = Math.round(date.getTime() / 1000); //Sekunnit keskiyöstä 1. Tammikuuta 1970
   
    var saapuvienlkm = Object.keys(myJson.result).length; //Kuinka monen pysäkille saapuvan bussin tiedot JSON-viestissä on (= parseData.result objektien lukumäärä)
    
    if (saapuvienlkm > 5) { //Näytetään kerrallaan maksimissaan viisi seuraavaa bussia
      saapuvienlkm = 5;
    }

    let linja = [0,0,0,0,0];
    let kohde = [0,0,0,0,0];
    let aika = [0,0,0,0,0];

    linja.fill('--');
    kohde.fill('--');
    aika.fill('--');

    if(saapuvienlkm == 0) {
      linja[0] = 'Lähtöjä ei ole saatavilla.';
    }

    //Käydään läpi JSON-datassa olevat lähdöt ja tallennetaan taulukoihin linja[], kohde[] ja aika[]
    for (var j = 0; j < saapuvienlkm; j++) {
      //Tarkastus: jos arvioitu lähtöaika on menneisyydessä, siirrytään seuraavaan lähtöön (föli bugi/vanhentunut tieto).
      if (myJson.result[j].expecteddeparturetime < now) {
        j++;
      }
      linja[j] = myJson.result[j].lineref;
      kohde[j] = myJson.result[j].destinationdisplay;
      
      //Lasketaan kuinka monta minuuttia on arvioituun lähtöaikaan
      aika[j] = Math.round((myJson.result[j].expecteddeparturetime - now) / 60);
      aika[j].toString();
      aika[j] = aika[j] + " min"
    }
    
    console.log("Pysäkin nimi on " + pysäkkinimi);

    //html-sivulla olevien elementtien päivittäminen
    var tags = ["pysäkki", "pysäkkinimi","linja0", "kohde0", "aika0", "linja1", "kohde1", "aika1", "linja2", "kohde2", "aika2",
                "linja3", "kohde3", "aika3", "linja4", "kohde4", "aika4"],
        corr = [pysäkki, pysäkkinimihaettu, linja[0], kohde[0], aika[0], linja[1], kohde[1], aika[1], linja[2], kohde[2], aika[2],
                linja[3], kohde[3], aika[3], linja[4], kohde[4], aika[4]];

    for (var i = 0; i < tags.length; i++) {
      document.getElementById(tags[i]).firstChild.nodeValue = corr[i];
    }
    
}

function initData() {
  updateBusDataAsync();
  window.setInterval("updateBusDataAsync()", 10000);
}


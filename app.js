/*Testaa Fölin avoimen data rajapintaa osoitteessa data.foli.fi
**http://data.foli.fi/siri/sm/"pysäkintunniste" - Pysäkkikohtainen ennuste pysäkistä "pysäkintunniste"
*/

//TO ADD
//Dropdown lista, josta valita pysäkki
//Kts. esim https://www.codebyamir.com/blog/populate-a-select-dropdown-list-with-json



function vaihdaPysäkki() {
  console.log("painettu" + pysäkki);
  window.clearInterval();
  pysäkki = document.getElementById("vaihdapysakkiin").value;
  console.log("painettu" + pysäkki);
  initData();
  //console.log(pysäkki);
  //updateBusDataAsync();
}

async function haePysäkinNimi(id) {
  const url = 'http://data.foli.fi/gtfs/v0/20191008-105302/stops';
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.onload = function() {
    if (request.status === 200) {
      const data = JSON.parse(request.responseText);
      pysäkkinimihaettu = Object(data[id].stop_name);
      
      console.log("Haettu pysäkin nimi: " + pysäkkinimihaettu);
      
      /*
      for (let i = 0; i < 5; i++) {
        option = document.createElement('option');
        option.text = data[i].stop_name;
        option.value = data[i].stop_id;
        dropdown.add(option);
        console.log("pysäkit lisätty listaan");
      }
      */
      
    } else {
      console.log("Serveri saavutettu, mutta palauttaa errorin")
     // Reached the server, but it returned an error
    }   
  }

  request.onerror = function() {
    console.error('An error occurred fetching the JSON from ' + url);
  };

  request.send();

}

/*
async function haePysäkitListaanAsync() {
  console.log("aloitetaan pysäkkien haku");
  let dropdown = document.getElementById('locality-dropdown');
  dropdown.length = 0;

  let defaultOption = document.createElement('option');
  defaultOption.text = 'Valitse pysäkki';

  dropdown.add(defaultOption);
  dropdown.selectedIndex = 0;

  const url = 'http://data.foli.fi/gtfs/v0/20191008-105302/stops';
  //  const url = 'https://data.foli.fi/siri/sm';

  //const response = await fetch(url);
  //const myJson = await response.json();

  //var pysäkkienLkm = Object.keys(myJson.result).length;
  //console.log("pysäkit: " + myJson.1[0]);

  const request = new XMLHttpRequest();
  request.open('GET', url, true);


  
  request.onload = function() {
    if (request.status === 200) {
      const data = JSON.parse(request.responseText);
      //const data = request.responseText;
      let option;
      console.log(data);
      let pysäkkienLkm = Object.keys(data).length;
      console.log("pysäkkien lkm" + pysäkkienLkm);
      console.log("pysäkin 1 nimi: " + Object(data[1].stop_name));
      console.log("pysäkin 1 id numero: " + Object(data[1].stop_code));
      //console.log("testi: " + Object.keys(data));
      let pysäkki_nimi=[];
      let pysäkki_id=[];

      for (let i = 1; i < Object.keys(data).length; i++) {
        pysäkki_nimi[i] = Object(data[i].stop_name);
        pysäkki_id[i] = Object(data[i].stop_name);
      }


      
      for (let i = 0; i < 5; i++) {
        option = document.createElement('option');
        option.text = data[i].stop_name;
        option.value = data[i].stop_id;
        dropdown.add(option);
        console.log("pysäkit lisätty listaan");
      }
      
      
    } else {
      console.log("Serveri saavutettu, mutta palauttaa errorin")
     // Reached the server, but it returned an error
    }   
  }

  request.onerror = function() {
    console.error('An error occurred fetching the JSON from ' + url);
  };

  request.send();
  
}
*/

var pysäkki = '100';
var pysäkkinimi = 'testi';
var hostname = 'http://data.foli.fi';
var path = '/siri/sm/';
var pysäkkinimihaettu;
let result;

async function updateBusDataAsync() {
    console.log("Tämänhetkinen pysäkki: " + pysäkki);
    

    haePysäkinNimi(pysäkki);
    console.log(pysäkkinimihaettu);
    //console.log("result" + result);
    

    //alla parametrit yhteyden muodostamiseen fölin palvelimelle (haetaan tiedot pysäkiltä numero 100) /format :ajan formatointi
    //const options = { hostname: 'data.foli.fi', port: 80, path: '/siri/sm/' + pysäkki, headers: { 'User-Agent': 'BussiSaapuuTesti/1.0; (Windows/6.1; okokiv@gmail.com; no-public)' } };

    var url = hostname + path + pysäkki;

    //var url = 'https://data.foli.fi/siri/sm/100';
    //let response = fetch(url);

    const response = await fetch(url);
    const myJson = await response.json();
    //console.log(JSON.stringify(myJson));

    /*
    if (response.ok) { // if HTTP-status is 200-299
      // get the response body (the method explained below)
      let json = await response.json();
    } else {
    alert("HTTP-Erroria pukkaa: " + response.status);
    }
    */
    //let parsedData

    //parsedData = JSON.stringify(myJson); //Tehdään raakadatasta JavaScript-objekti
    //console.log(parsedData);

    
    var date = new Date();
    var now = Math.round(date.getTime() / 1000); //Sekunnit keskiyöstä 1. Tammikuuta 1970
    
    /*
    console.log("Sekunnit hetkestä 1970/01/01: " + now);
    console.log("Seuraavat pysäkille " + pysäkki + " saapuvat bussit:");
    console.log("_____________________");
    console.log("Linja            Aika");
    console.log("Määränpää");
    */

    var saapuvienlkm = Object.keys(myJson.result).length; //Kuinka monen pysäkille saapuvan bussin tiedot JSON-viestissä on (= parseData.result objektien lukumäärä)
    
   
    //var saapuvienlkm = Object.keys(parsedData.result).length; //Kuinka monen pysäkille saapuvan bussin tiedot JSON-viestissä on (= parseData.result objektien lukumäärä)
    if (saapuvienlkm > 5) {
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

    for (var j = 0; j < saapuvienlkm; j++) {
      linja[j] = myJson.result[j].lineref;
      kohde[j] = myJson.result[j].destinationdisplay;
      aika[j] = Math.round((myJson.result[j].expectedarrivaltime - now) / 60);
      aika[j].toString();
      aika[j] = aika[j] + " min"
    }
    //var linja = myJson.result[0].lineref;
    //var kohde = myJson.result[0].destinationdisplay;
    //var aika = Math.round((myJson.result[0].expectedarrivaltime - now) / 60);

    
    console.log("Pysäkin nimi on " + pysäkkinimi);

    var tags = ["pysäkki", "pysäkkinimi","linja0", "kohde0", "aika0", "linja1", "kohde1", "aika1", "linja2", "kohde2", "aika2",
                "linja3", "kohde3", "aika3", "linja4", "kohde4", "aika4"],
        corr = [pysäkki, pysäkkinimihaettu, linja[0], kohde[0], aika[0], linja[1], kohde[1], aika[1], linja[2], kohde[2], aika[2],
                linja[3], kohde[3], aika[3], linja[4], kohde[4], aika[4]];

    for (var i = 0; i < tags.length; i++) {
      document.getElementById(tags[i]).firstChild.nodeValue = corr[i];
    }
    
}



function initData() {
  //haePysäkitListaanAsync();

  updateBusDataAsync();
  
  window.setInterval("updateBusDataAsync()", 10000);
  //var pysäkki = document.getElementById("vaihdapysakkiin").value;
}


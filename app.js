const URL_CURRENT_WEATHER =
  "https://api.openweathermap.org/data/2.5/weather?appid=69518b1f8f16c35f8705550dc4161056&units=metric&q="; // concatenare cu Oras
const URL_FORECAST_WEATHER =
  "https://api.openweathermap.org/data/2.5/forecast?appid=69518b1f8f16c35f8705550dc4161056&units=metric&q="; // concatenare cu Oras
const URL_WEATHER_ICON_PREFIX = "http://openweathermap.org/img/w/"; // concatenare cu icon vreme si concatenare cu sufix .png

const inputOras = document.getElementById("input-oras");

const btnAfisareVreme = document.getElementById("afisare-vreme");
btnAfisareVreme.addEventListener("click", afiseazaVremea);

function afiseazaVremea() {
  fetch(URL_CURRENT_WEATHER + inputOras.value)
    .then((result) => result.json())
    .then((acum) => {
      if (acum.cod != "200") {
        alert(acum.cod + " " + acum.message);
      } else {
        document.getElementById("vreme").innerHTML = `
            <h1>Vremea acum</h1>
            <img src="${URL_WEATHER_ICON_PREFIX}${acum.weather[0].icon}.png" /><br/>
            Locatie: ${acum.name}, ${acum.sys.country}<br/>
            Latitudine: ${acum.coord.lat}, longitudine: ${acum.coord.lon}<br/>
            Descriere: ${acum.weather[0].description}<br/>
            Umiditate: ${acum.main.pressure}<br/>
            Presiune: ${acum.main.humidity}<br/>
            Temperatura curenta: ${acum.main.temp}<br/>
            Minima zilei: ${acum.main.temp_min}<br/>
            Maxima zilei: ${acum.main.temp_max}
        `;
      }
    });
}

const btnAfisarePrognoza = document.getElementById("afisare-prognoza");
btnAfisarePrognoza.addEventListener("click", afiseazaPrognoza);

function afiseazaPrognoza() {
  fetch(URL_FORECAST_WEATHER + inputOras.value)
    .then((result) => result.json())
    .then((data) => {
      if (data.cod != "200") {
        alert(data.cod + " " + data.message);
      } else {
        const zile = data.list.slice(0, 40); // Obținem doar primele 40 înregistrări (5 zile x 8 înregistrări pe zi)

        let continutTabel = "";

        let prima = zile.shift();

        if (convertTimestamp(prima.dt).ora == "03:00") {
          continutTabel += `<td></td>`;
          continutTabel += genereazaCell(prima);
          for (let i = 0; i < 6; i++) {
            prima = zile.shift();
            continutTabel += genereazaCell(prima);
          }
        } else if (convertTimestamp(prima.dt).ora == "06:00") {
          continutTabel += `<td></td><td></td>`;
          continutTabel += genereazaCell(prima);
          for (let i = 0; i < 5; i++) {
            prima = zile.shift();
            continutTabel += genereazaCell(prima);
          }
        } else if (convertTimestamp(prima.dt).ora == "09:00") {
          continutTabel += `<td></td><td></td><td></td>`;
          continutTabel += genereazaCell(prima);
          for (let i = 0; i < 4; i++) {
            prima = zile.shift();
            continutTabel += genereazaCell(prima);
          }
        } else if (convertTimestamp(prima.dt).ora == "12:00") {
          continutTabel += `<td></td><td></td><td></td><td></td>`;
          continutTabel += genereazaCell(prima);
          for (let i = 0; i < 3; i++) {
            prima = zile.shift();
            continutTabel += genereazaCell(prima);
          }
        } else if (convertTimestamp(prima.dt).ora == "15:00") {
          continutTabel += `<td></td><td></td><td></td><td></td><td></td>`;
          continutTabel += genereazaCell(prima);
          for (let i = 0; i < 2; i++) {
            prima = zile.shift();
            continutTabel += genereazaCell(prima);
          }
        } else if (convertTimestamp(prima.dt).ora == "18:00") {
          continutTabel += `<td></td><td></td><td></td><td></td><td></td><td></td>`;
          continutTabel += genereazaCell(prima);
          for (let i = 0; i < 1; i++) {
            prima = zile.shift();
            continutTabel += genereazaCell(prima);
          }
        } else if (convertTimestamp(prima.dt).ora == "21:00") {
          continutTabel += `<td></td><td></td><td></td><td></td><td></td><td></td><td></td>`;
          continutTabel += genereazaCell(prima);
        }

        continutTabel += `</tr>`;

        for (let i = 2; i <= 5; i++) {
          continutTabel += `<tr>`;
          for (let j = 1; j <= 8; j++) {
            prima = zile.shift();
            continutTabel += genereazaCell(prima);
          }
          continutTabel += `</tr>`;
        }
        document.getElementById("body-tabel").innerHTML = continutTabel;
      }
    });
}

function genereazaCell(ziOra) {
  return `
  <td>
       <img src="${URL_WEATHER_ICON_PREFIX}${
    ziOra.weather[0].icon
  }.png" /><br />
       Zi: ${convertTimestamp(ziOra.dt /*+ziOra.timestamp*/).data}<br />
       Ora: ${convertTimestamp(ziOra.dt /*+ziOra.timestamp*/).ora}<br />
       Temperatura: ${ziOra.main.temp}<br />
       Descriere: ${ziOra.weather[0].description}<br />
   </td>
`;
}

function convertTimestamp(timestamp) {
  const date = new Date(timestamp * 1000);

  // Obține componentele datei
  const zi = date.getDate();
  const luna = date.getMonth() + 1; // Luna începe de la 0, deci adăugăm 1
  const an = date.getFullYear();

  // Obține componentele orei
  const ora = date.getHours();
  const minute = date.getMinutes();

  // Formatul datei: zz.ll.aaaa
  const dataFormatata = `${zi.toString().padStart(2, "0")}.${luna
    .toString()
    .padStart(2, "0")}.${an}`;

  // Formatul orei: hh24:mi
  const oraFormatata = `${ora.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")}`;

  return { data: dataFormatata, ora: oraFormatata };
}

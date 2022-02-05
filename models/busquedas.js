const fs = require("fs");
const axios = require("axios");

class Busquedas {
  historial = [];
  dbPath = "./db/database.json";

  constructor() {
    this.leerDb();
  }

  get historialCapitalizado() {
      return this.historial.map(lugar=>{
        let palabras =lugar.split(' ');
        palabras=palabras.map(p=>p[0].toUpperCase()+p.substring(1));
        return palabras.join(' ')
      })
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }

  get paramsOpenWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      lang: "es",
      units: "metric",
    };
  }

  async ciudad(lugar = "") {
    // console.log('Ciudad:',lugar);
    try {
      const intance = axios.create({
        baseURL: `https://api.mapbox.com/`,
        params: this.paramsMapbox,
      });

      const { data } = await intance.get(
        `geocoding/v5/mapbox.places/${lugar}.json`
      );

      return data.features.map(({ id, place_name, center }) => ({
        id,
        place_name,
        lng: center[0],
        lat: center[1],
      }));
    } catch (error) {
      console.log(error);
    }
  }

  async climaCiudad(lat, lon) {
    try {
      const intance = axios.create({
        params: { ...this.paramsOpenWeather, lat, lon },
      });

      const { data } = await intance.get(
        `https://api.openweathermap.org/data/2.5/weather`
      );
      const { weather, main } = data;

      return {
        desc: weather[0].description,
        temp: main.temp,
        temp_max: main.temp_max,
        temp_min: main.temp_min,
      };
    } catch (error) {
      console.log(error);
    }
  }

  agregarHistorial(lugar = "") {
    if (this.historial.includes(lugar.toLocaleLowerCase())) {
      return;
    }
    this.historial=this.historial.splice(0,5);

    this.historial.unshift(lugar.toLowerCase());

    this.guardarDb();
  }

  guardarDb() {
    const payload = {
      historial: this.historial,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  leerDb() {
    if (!fs.existsSync(this.dbPath)) {
      return null;
    }
    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);
    this.historial = data.historial;
  }
}

module.exports = Busquedas;

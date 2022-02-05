require("dotenv").config();

const {
  leerInput,
  inquirerMenu,
  pausa,
  listarLugares,
} = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");

const main = async () => {
  let opt;
  const busquedas = new Busquedas();

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        //Mostrar Mensaje
        const lugar = await leerInput("Ciudad:");
        //Buscar el Lugar
        const lugares = await busquedas.ciudad(lugar);
        //Seleccionar el lugar
        const idSeleccionado = await listarLugares(lugares);
        if (idSeleccionado==='0')continue;

        

        const {
          place_name: nombre,
          lat,
          lng,
        } = lugares.find((l) => l.id === idSeleccionado);

        //guardar en db
        busquedas.agregarHistorial(nombre)
        //Clima
        const { desc, temp, temp_max, temp_min } = await busquedas.climaCiudad(
          lat,
          lng
        );
        //Mostrar Resultados
        console.clear()
        console.log("\n informacion de la ciudad \n".green);
        console.log("Ciudad:".green, nombre.white);
        console.log("Lat:".green, lat);
        console.log("Lng:".green, lng);
        console.log("Clima:".green,desc);
        console.log("Temperatura:".green,temp);
        console.log("Minima:".green,temp_min);
        console.log("Maxima:".green,temp_max);
        
        break;

        case 2:
           
            if(busquedas.historial.length>0) {
              busquedas.historialCapitalizado.forEach((lugar,i)=>{
                const idx=`${i+1}`.green;
                console.log(`${idx}. ${lugar} `);
              })
          }  
          
            
            
          break;
    }

    if (opt !== 0) await pausa();
  } while (opt != 0);
  {
  }
};

main();

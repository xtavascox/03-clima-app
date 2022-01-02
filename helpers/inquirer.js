const input = require("@inquirer/input");
const inquirer = require("inquirer");
require("colors");

const preguntas = [
  {
    type: "list",
    name: "opcion",
    message: "¿Que desea hacer?",
    choices: [
        {
            value:'1',
            name:`${'1.'.green} Crear Tarea`
        },
        {
            value:'2',
            name:`${'2'.green} Listar Tarea`
        },
        {
            value:'3',
            name:`${'3'.green} Listar Tareas Completadas`
        },
        {
            value:'4',
            name:`${'4'.green} Listar Tareas Pendientes`
        },
        {
            value:'5',
            name:`${'5'.green} Completar Tareas`
        },
        {
            value:'6',
            name:`${'6'.green} Borrar tareas`
        },
        {
            value:'0',
            name:`${'0'.green}. Salir`
        }
    ],
  },
];


const inquirerMenu = async () => {
 console.clear();
  console.log("===========================".green);
  console.log("  Seleccione una opcion".green);
  console.log("===========================\n".green);

  const {opcion} = await inquirer.prompt(preguntas);

  return opcion;
};

const pausa= async()=>{
    const question=[
        {
            type:'input',
            name:'enter',
            message:`Presione ${'ENTER'.green} para continuar`
        }
    ]
    await inquirer.prompt(question)
 
}

const leerInput=async(message)=>{
    const question=[
        {
            type:'input',
            name:'desc',
            message,
            validate(value){
                if(value.length===0){
                    return 'Por favor ingrese un valor'
                }
                return true
            }
        }
    ]
    const {desc}=await inquirer.prompt(question)
    return desc
}

const listadoTareaBorrar=async(tareas=[])=>{
    const choices =tareas.map(({id,desc},i)=>{
        const idx=`${i+1}.`.green;
        
        return{
            value:id,
            name:`${idx} ${desc}`
        }
    })
    choices.unshift({
        value:'0',
        name:'0.'.green+' Cancelar '
    })
    const preguntas =[
        {
            type:'list',
            name:'id',
            message:'Borrar',
            choices
        }
    ]
    const {id}=await inquirer.prompt(preguntas)

    return id
}

const confirmar=async (message)=>{
    const question =[
        {
            type:'confirm',
            name:'ok',
            message
        }
    ]
    const {ok}=await inquirer.prompt(question)
    return ok
}
const mostrarListadoCheckList=async(tareas=[])=>{
    const choices =tareas.map(({id,desc,completado},i)=>{
        const idx=`${i+1}.`.green;
        
        return{
            value:id,
            name:`${idx} ${desc}`,
            checked:(completado)?true:false
        }
    })
    
    const pregunta =[
        {
            type:'checkbox',
            name:'ids',
            message:'Selecciones',
            choices
        }
    ]
    const {ids}=await inquirer.prompt(pregunta)

    return ids
}

module.exports = {
  inquirerMenu,
  pausa,
  leerInput,
  listadoTareaBorrar,
  confirmar,
  mostrarListadoCheckList
};

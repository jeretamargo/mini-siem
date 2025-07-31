import dotenv from 'dotenv'
import pkg from 'pg' //el paquete pg bo es compatible con es modules a si q hay q llevar todas sus propiedades a un objeto pkg y luego desestructurar la clase que queremos usar
const {Pool} = pkg
dotenv.config() //carga las variables de entorno

//Declara variables de entorno de la bd 

export const db_pool =  new Pool({
    host:process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,  
    database: process.env.DB_NAME
})



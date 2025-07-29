import dotenv from 'dotenv'
import {pool} from 'pg'
dotenv.config() //carga las variables de entorno

//Declara variables de entorno de la bd 

const pool = new Pool({
    DB_HOST:process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER, 
    DB_PW: process.env.DB_PASSWORD,  
    DB_NAME: process.env.DB_NAME
})

module.exports = pool;

import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import {db_pool} from './db.js'

dotenv.config() //Carga las variables de entorno del archivo .env

const app = express(); //Instancia la aplicacion en una constante con nombre"App"
const PORT = process.env.PORT || 3001; // Declara PORT como el valor dentro del archivo .env, si no llegase a estar disponible, se asigna el puerto 3001

//MIDDLEWARE
app.use(cors()); //habilitamos el middleware cors habilitando todos los puertos (inseguro pero rapido para empezar)
app.use(express.json());//Habilitamos el middleware que permite recibir y procesar datos json en el cuerpo de las peticiones

app.get('/', (req, res)=>{ //primer endpoint de prueba, loguea el metodo http, de donde viene y responde texto plano
    console.log(`Request  ${req.method} from: ${req.ip}` )
    res.send("Holaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
})

//prueba de la conexion con la bd
app.get('/bd_test', async (req, res) => {
    try{
        const result = await db_pool.query('SELECT NOW()')
        res.json({success: true, time:result.rows[0]})
        console.log(`Request  ${req.method} from: ${req.ip}` )
    }catch(err){
        console.log(err)
    }
})



app.listen(PORT, () =>{ //loguea el puerto de escucha recien se arranca el server
    console.log(`Backend funcionando y escuchando en: ${PORT}`)
})
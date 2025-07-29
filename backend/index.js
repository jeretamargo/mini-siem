import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config() //Carga las variables de entorno del archivo .env

const app = express(); //Instancia la aplicacion en una constante con nombre"App"
const PORT = process.env.PORT || 3001; // Declara PORT como el valor dentro del archivo .env, si no llegase a estar disponible, se asigna el puerto 3001

//MIDDLEWARE
app.use(cors()); //habilitamos el middleware cors habilitando todos los puertos (inseguro pero rapido para empezar)
app.use(express.json());//Habilitamos el middleware que permite recibir y procesar datos json en el cuerpo de las peticiones

app.get('/', (req, res)=>{
    console.log(`Request  ${req.method} from: ${req.ip}` )
    res.send("Holaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
})

app.listen(PORT, () =>{
    console.log(`Backend funcionando y escuchando en: ${PORT}`)
})
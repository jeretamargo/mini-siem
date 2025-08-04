import dotenv from "dotenv";
import pkg from "pg"; //el paquete pg no es compatible con es modules a si q hay q llevar todas sus propiedades a un objeto pkg y luego desestructurar la clase que queremos usar
const { Pool } = pkg;
dotenv.config(); //carga las variables de entorno

//Declara variables de entorno de la bd

export const db_pool = new Pool({
  host: process.env.host,
  port: process.env.port,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

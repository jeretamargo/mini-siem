import express from "express";
import { db_pool } from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const Router = express.Router(); // se instancia el router

function existingUser(field) {
  return db_pool.query("SELECT * FROM users WHERE username = $1", [field]);
}

function existingMail(field) {
  return db_pool.query("SELECT * FROM users WHERE email = $1", [field]);
}

function jwt_data_retrive(username) {
  const jwt_data_query = db_pool.query(
    "SELECT id, role FROM users WHERE username = $1",
    [username]
  );
  return jwt_data_query;
  //console.log(jwt_data_query.rows[0].id);
  //console.log(jwt_data_query.rows[0].role);
}
Router.post("/register", async (req, res) => {
  //se crea el endpoint register (que va a estar dentro de /auth)
  try {
    const { username, email, password, role } = req.body; //se desestructura el body de la request para sacar los parametros
    console.log("paso1");

    if (!username || !email || !password) {
      //se validan que esten completos
      return res.status(400).json({ error: "Campos sin completar" });
    }

    console.log("paso2"); // se devuelve error si existe el user o el mail (sino continua sin error)
    const userExists = await existingUser(username);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ error: "Usuario existente" });
    }
    const mailExists = await existingMail(email);
    if (mailExists.rows.length > 0) {
      return res.status(409).json({ error: "Email existente" });
    }
    console.log("paso3"); //se instancia una constante para indicar la cantidad de vueltas de salteo
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password.toString(), saltRounds); //se hashea el password y se le agrega las vueltas de salteo

    console.log("paso4"); //se crea la query a la db para crear al user
    const newUser = await db_pool.query(
      "INSERT INTO users (username, email, password_hash, role) VALUES ($1,$2,$3,$4) RETURNING id, username, email, role, created_at",
      [username, email, passwordHash, role || "analyst"]
    );
    console.log("paso5"); //finalmente se le responde al cliente con mensaje de exito con codigo 201 (creado)y el user creado, de lo contrario se maneja el codigo con error 500(internal server error)

    res
      .status(201)
      .json({ message: "usuario registrado con exito", user: newUser.rows[0] });
    console.log("paso6");
  } catch (err) {
    console.log(`Error en /register: ${err}`);
    res.status(500).json({ error: "Error interno en el servidor" });
  }
});

Router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("paso1");
    if (!username || !password) {
      return res.status(400).json({ Error: "Campos incompletos" });
    }
    console.log("paso2");
    const userExist = await existingUser(username);
    if (userExist.rows.length === 0) {
      return res.status(400).json({ Error: "Usuario inexistente" });
    }
    console.log("paso3");

    const pw_query = await db_pool.query(
      "SELECT password_hash FROM users WHERE username = $1",
      [username]
    );
    const hash = pw_query.rows[0].password_hash;

    //hash = hash.toString();

    console.log("paso4");
    bcrypt.compare(password.toString(), hash.toString(), async (err, data) => {
      if (err) {
        throw err;
      }
      if (data) {
        const jwt_data = await jwt_data_retrive(username.toString());

        const id = jwt_data.rows[0].id;
        const role = jwt_data.rows[0].role;

        const token = jwt.sign({ id: id, role: role }, process.env.JWT_SECRET);
        return res
          .status(200)
          .json({ success: true, message: "Acceso Concedido", token });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Contraseña Incorrecta" });
      }
    });
  } catch (err) {
    res.status(500).json({ Error: err });
    console.log(err);
  }
});

export default Router;

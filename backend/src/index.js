const express = require("express");
const cors = require("cors");
const importarDatos = require("../data/insert_leves.js");
//const bodyParser = require("body-parser");

const { connectDB, sequelize_loggin, sequelize_game } = require("./config/db");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Sincroniza la base de datos.
 */
const sync_database = async () => {
  try {
    await sequelize_loggin.sync({ force: true });
    console.log("[ + ] Base de datos de loggin sincronizada correctamente");
    
    await sequelize_game.sync({ force: true });
    console.log("[ + ] Base de datos del juego sincronizada correctamente");

    await importarDatos();
  } catch (error) {
    console.error("[ - ] Error sincronizando la base de datos de loggin:", error);
    process.exit(1);
  }
  
};

connectDB().then(sync_database);

// Middleware para leer JSON
app.use(express.json());

// Middleware para permitir CORS
app.use(cors());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡Servidor funcionando! 🚀");
});

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const paymentRoutes = require("./routes/paymentRoutes");
app.use("/payment", paymentRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


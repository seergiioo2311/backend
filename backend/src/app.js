const express = require("express");
const cors = require("cors");
const { importUsers, importLevels, importAchievements, importUserAch, importItems } = require("../data/insert_data.js");

const { connectDB, sequelize_loggin, sequelize_game } = require("./config/db");

const { insertUsers } = require("../data/insertUsers.js")

require("dotenv").config();

const app = express();

/**
 * Sincroniza la base de datos.
 */
const sync_database = async () => {
  try {
    await sequelize_loggin.sync({ force: true });
    
    await sequelize_game.sync({ force: true });
    
    await importItems();
    await importUsers();
    await importLevels();
    await importAchievements();
    await importUserAch();
    

  } catch (error) {
    console.error("[ - ] Error sincronizando la base de datos de loggin:", error);
    process.exit(1);
  }
  
};

async function connectData() {
  await connectDB().then(sync_database);
}
// connectDB().then(sync_database);

// Middleware para leer JSON
app.use(express.json());

// Middleware para permitir CORS
app.use(cors());

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡Servidor funcionando! 🚀");
});

// Rutas de autenticación
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

// Rutas de usuario
const paymentRoutes = require("./routes/paymentRoutes");
app.use("/payment", paymentRoutes);

// Rutas de la pantalla principal
const mainScreenRoutes = require("./routes/mainScreenRoutes");
app.use("/main-screen", mainScreenRoutes);

// Rutas de amigos
const friendRoutes = require("./routes/friendRoutes");
app.use("/friends", friendRoutes);

const achievementRoutes = require("./routes/achievementsRoutes");
app.use("/achievements", achievementRoutes);

const itemRoutes = require("./routes/itemRoutes");
app.use("/items", itemRoutes);

const messagesRoutes = require("./routes/messagesRoutes");
app.use("/messages", messagesRoutes);

module.exports = app;

const express = require("express");
const cors = require("cors");
//const bodyParser = require("body-parser");
const { connectDBUsers, sequelize_users } = require("./config/db");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

const sync_database = async () => {
  try {
    await sequelize_users.sync({ alter: true });
    console.log("[ + ] Base de datos sincronizada correctamente");
  } catch (error) {
    console.error("[ - ] Error sincronizando la base de datos:", error);
    process.exit(1);
  }
};

connectDBUsers().then(sync_database);

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


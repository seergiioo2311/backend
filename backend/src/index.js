const express = require("express");
const cors = require("cors");

const { connectDB, sequelize_loggin } = require("./config/db");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Sincroniza la base de datos.
 */
const sync_database = async () => {
  try {
    await sequelize_loggin.sync({ alter: true });
    console.log("[ + ] Base de datos sincronizada correctamente");
  } catch (error) {
    console.error("[ - ] Error sincronizando la base de datos:", error);
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


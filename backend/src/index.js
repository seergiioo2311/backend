const express = require("express");
const cors = require("cors");
const { importUsers, importLevels, importShops, importAchievements, importUserAch, importItems, createSP } = require("../data/insert_data.js");

const { connectDB, sequelize_loggin, sequelize_game } = require("./config/db");

const { insertUsers } = require("../data/insert_users.js");
const { insertRequests } = require("../data/insert_requests.js");
const { insertFriends } = require("../data/insert_friends.js");

const { triggersSeasonPass } = require("../data/triggers/triggers-season-pass.js");

const authMiddleware = require("./middlewares/authMiddleware");
const messageService = require("./services/messagesService.js")

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

    await importItems();
    await importAchievements();
    await importLevels();
    await insertUsers(); // Ejecutar el script para insertar usuarios
    await insertRequests();
    await insertFriends(); // Descomentar para ver los amigos en vez de las solicitudes
    
    //Insertamos los datos en la base de datos
    await importUsers();
    await importShops();
    //await importUserAch();
    await createSP(); // Crear el pase de temporada
    await triggersSeasonPass(); // Crear los triggers para el pase de temporada
  } catch (error) {
    console.error("[ - ] Error sincronizando la base de datos de loggin:", error);
    process.exit(1);
  }
  
};

const http = require("http");
const jwt = require("jsonwebtoken");
const WebSocket = require("ws"); // Add this import
const wss = new WebSocket.Server({ port: 8080 });

console.log('Servidor WebSocket iniciado en puerto 8080');

// Colección para almacenar conexiones activas
const connections = new Map();

// Crear servidor HTTP explícitamente

// Manejo de conexiones WebSocket
wss.on('connection', (ws, req) => {
  // Obtener parámetros de la URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  const userId = url.searchParams.get('userId');
  const friendId = url.searchParams.get('friendId');
  const token = url.searchParams.get('token');
  
  // Validar token si es necesario (opcional aquí ya que se puede validar en un middleware)
  
  // Guardar la conexión
  if (!connections.has(userId)) {
    connections.set(userId, new Map());
  }
  connections.get(userId).set(friendId, ws);
  
  console.log(`Usuario ${userId} conectado al chat con ${friendId}`);

  // Manejar mensajes recibidos
  ws.on('message', (message) => {
    try {
      const msgData = JSON.parse(message.toString());
      
      // Guardar el mensaje en la base de datos
      saveMessageToDatabase(msgData);
      
      // Enviar mensaje al destinatario si está conectado
      if (connections.has(msgData.id_friend_receptor)) {
        const recipientWs = connections.get(msgData.id_friend_receptor).get(msgData.id_friend_emisor);
        if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
          recipientWs.send(message.toString());
        }
      }
      
    } catch (error) {
      console.error('Error al procesar mensaje:', error);
    }
  });
  
  // Manejar desconexión
  ws.on('close', () => {
    if (connections.has(userId)) {
      connections.get(userId).delete(friendId);
      if (connections.get(userId).size === 0) {
        connections.delete(userId);
      }
    }
    console.log(`Usuario ${userId} desconectado del chat con ${friendId}`);
  });
});

// Función para guardar mensajes en la base de datos
async function saveMessageToDatabase(message) {
  try {
    // Verificar que el mensaje tenga formato adecuado
    if (!message || typeof message !== 'object') {
      // Intentar parsear si es una cadena
      if (typeof message === 'string') {
        try {
          message = JSON.parse(message);
        } catch (parseError) {
          console.error('Error al parsear el mensaje JSON:', parseError);
          return { error: 'Formato de mensaje inválido' };
        }
      } else {
        console.error('Formato de mensaje inválido');
        return { error: 'Formato de mensaje inválido' };
      }
    }

    // Extraer los campos necesarios del mensaje
    const { id, id_friend_emisor, id_friend_receptor, content, date } = message;
    
    // Validar que todos los campos requeridos estén presentes
    if (!id || !id_friend_emisor || !id_friend_receptor || !content || !date) {
      console.error('Campos requeridos faltantes en el mensaje', message);
      return { error: 'Campos requeridos faltantes en el mensaje' };
    }

    console.log('Guardando mensaje en la base de datos:', message);
    
    // Llamar a la función addMessage para guardar el mensaje en la base de datos
    const result = await messageService.addMessage(
      id,
      id_friend_emisor,
      id_friend_receptor,
      content,
      date
    );
    
    return result;
  } catch (error) {
    console.error('Error al guardar mensaje en la base de datos:', error);
    return { error: error.message };
  }
}

connectDB().then(sync_database);

// Middleware para leer JSON
app.use(express.json());

// Middleware para permitir CORS
app.use(cors());

// Middleware de autenticación
app.use(authMiddleware);

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


const privateGameRoutes = require("./routes/privateRoutes");
app.use("/private", privateGameRoutes);

// Rutas de la tienda
const shopRoutes = require("./routes/shopRoutes");
app.use("/shop", shopRoutes); // Asegúrate de que las rutas de la tienda estén registradas

// Rutas del pase de batalla
const seasonPassRoutes = require("./routes/seasonPassRoutes");
app.use("/season-pass", seasonPassRoutes);

// Rutas del contact support
const contactSupportRoutes = require("./routes/contactSupportRoutes");
app.use("/contact-support", contactSupportRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


const { QueryTypes } = require('sequelize');
const { Op } = require("sequelize");  // Asegúrate de importar 'Op' desde Sequelize
const { sequelize_game } = require('../config/db.js');
const { Message } = require("../models/Message.js");
const User = require("../models/User.js");
const { FRIEND_STATUS } = require("../models/Friends.js");

//TODO: Queda hacer el testing 

/**
 * @description Obtiene todos los entre dos usuarios
 * @param {uuid} userIdEmisor - El id del usuario emisor
 * @param {uuid} userIdReceptor - El id del usuario receptor
 * @returns {Json} - Un objeto con los mensajes
 */
async function getMessages(userIdEmisor, userIdReceptor) {
  try {
    console.log("🔍 Buscando mensajes para los usuarios con ID:", userIdEmisor, userIdReceptor);  // Mensaje de depuración

    const messages = await Message.findAll({
        where: {
          [Op.or]: [
            { id_friend_emisor: userIdEmisor, id_friend_receptor: userIdReceptor },
            { id_friend_emisor: userIdReceptor, id_friend_receptor: userIdEmisor }
          ]
        },
        order: [['date', 'ASC']]  // Ordenar los mensajes por fecha de envío, de más antiguo a más reciente
      });
  
      console.log("🔍 Mensajes encontrados:", messages);  // Mensaje de depuración
  
      return messages;
  } catch (error) {
    console.error("❌ Error al obtener los mensajes:", error);  // Mensaje de error detallado
    return { message: "Error al obtener los mensajes." };
  }
}



/**
 * @description Agrega un mensaje entre dos usuarios
 * @param {date} id - Id del mensaje
 * @param {uuid} userIdEmisor - El id del usuario emisor
 * @param {uuid} userIdReceptor - El id del usuario receptor
 * @param {date} date - Fecha del mensaje
 * @param {string} messageContent - El contenido del mensaje
 * @returns {Json} - Un objeto con un mensaje de éxito o error
 * @throws {Error} - Si no se encuentra o ocurre algún error
 */
async function addMessage(id, userIdEmisor, userIdReceptor, messageContent, date) {
  try {
    // Crear un nuevo mensaje entre los dos usuarios en la tabla Chat
    const newMessage = await Message.create({
      id: id,
      id_friend_emisor: userIdEmisor,
      id_friend_receptor: userIdReceptor,
      content: messageContent,
      date: date  // Usar la fecha y hora actuales para el envío del mensaje
    });

    console.log("✅ Mensaje enviado con éxito:", newMessage);

    return { message: "Mensaje enviado correctamente.", data: newMessage };
  } catch (error) {
    return { message: error.message };
  }
}

/**
 * @description Comprueba si un usuario esta registrado en la base de datos
 * @param {number} userId - El id del usuario
 * @returns {Json} - Un objeto con un mensaje de éxito o error
 * @throws {Error} - Si no se encuentra
 */ 
async function checkUser(userId) {
  const user = await User.findOne({
    where: {id: userId}
  });

  if(user) {
    return {message: "Usuario encontrado"};
  }
  else {
    return {message: "Usuario no encontrado"};
  }
}


module.exports = { getMessages, addMessage, checkUser };
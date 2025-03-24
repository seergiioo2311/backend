const { QueryTypes } = require('sequelize');
const { Op } = require("sequelize");  // Asegúrate de importar 'Op' desde Sequelize
const { sequelize_game } = require('../config/db');
const { Friends } = require("../models/Friends.js");
const User = require("../models/User.js");
const { FRIEND_STATUS } = require("../models/Friends.js");

//TODO: Queda hacer el testing 

/**
 * @description Obtiene todos los amigos de un usuario (status: "Accepted")
 * @param {number} userId - El id del usuario
 * @returns {Json} - Un objeto con los amigos
 */
async function getFriends(userId) {
  try {
    console.log("🔍 Buscando amigos para el usuario con ID:", userId);  // Mensaje de depuración

    const friends = await Friends.findAll({
      where: {
        status: FRIEND_STATUS.ACCEPTED, // Solo buscamos amigos con estado aceptado
        [Op.or]: [  // Usa Op.or directamente
          { id_friend_1: userId },
          { id_friend_2: userId }
        ]
      },
      include: [
        {
          model: User,
          as: 'User1', // Alias para el primer amigo
          attributes: ['username', 'id', 'lastConnection']
        },
        {
          model: User,
          as: 'User2', // Alias para el segundo amigo
          attributes: ['username',  'id', 'lastConnection']
        }
      ]
    });

    console.log("🔍 Amigos encontrados:", friends);  // Mensaje de depuración

    return friends;
  } catch (error) {
    console.error("❌ Error al obtener los amigos:", error);  // Mensaje de error detallado
    return { message: "Error al obtener los amigos." };
  }
}

/**
 * @description Obtiene todas las solicitudes de amistad (status: "Pending")
 * @param {number} userId - El id del usuario
 * @returns {Json} - Un objeto con las solicitudes de amistad
 */
async function getSolicitudes(userId) {
  try {
    const friendRequests = await Friends.findAll({
      where: {
        status: FRIEND_STATUS.PENDING, // Solo buscamos las solicitudes pendientes
        [Op.or]: [
          { id_friend_1: userId },
          { id_friend_2: userId }
        ]
      },
      include: [
        {
          model: User,
          as: 'User1', // Alias para el primer amigo
          attributes: ['username', 'id', 'lastConnection']
        },
        {
          model: User,
          as: 'User2', // Alias para el segundo amigo
          attributes: ['username', 'id', 'lastConnection']
        }
      ]
    });

    return friendRequests;
  } catch (error) {
    console.error("❌ Error al obtener las solicitudes de amistad:", error);
    return { message: "Error al obtener las solicitudes de amistad." };
  }
}


/**
 * @description Agrega un amigo a un usuario (cambia el estado de la amistad a true)
 * @param {number} userId1 - El id del usuario
 * @param {number} userId2 - El id del amigo
 * @returns {Json} - Un objeto con un mensaje de éxito o error
 * @throws {Error} - Si no se encuentra
 */
async function addFriend(userID1, userID2) {
  try {
    // Actualizar la relación de amistad de userID1 y userID2
    const updatedFriend1 = await Friends.update(
      { status: "Accepted" }, // Actualizamos el status a true
      {
        where: {
          id_friend_1: userID2,
          id_friend_2: userID1,
        },
      }
    );

    // Si no se actualizó ningún registro, significa que no existen relaciones
    if (updatedFriend1[0] === 0) {
      throw new Error("La relacione de amistad no existe.");
    }

    return { message: "Amistad añadida correctamente." };
  } catch (error) {
    return { message: error.message };
  }
}


/**
 * @description Agrega un amigo a un usuario
 * @param {number} userId - El id del usuario
 * @param {number} friendId - El id del amigo
 * @returns {Json} - Un objeto con un mensaje de éxito o error
 * @throws {Error} - Si no se encuentra
 */
async function addSolicitud(userID1, userID2) {
  try {
    // Verificar si ambos usuarios existen
    console.log("userID1:", userID1);
    const user1 = await User.findByPk(userID1);
    const user2 = await User.findByPk(userID2);

    if (!user1 || !user2) {
      return { message: "Uno de los usuarios no existe." };
    }

    // Verificar si ya existe una solicitud de amistad entre los dos usuarios
    const existingFriendship = await Friends.findOne({
      where: {
        [Op.or]: [
          { id_friend_1: userID1, id_friend_2: userID2 },
          { id_friend_1: userID2, id_friend_2: userID1 }
        ]
      }
    });

    if (existingFriendship) {
      return { message: "Ya existe una solicitud de amistad entre estos usuarios." };
    }

    // Si ambos usuarios existen, procedemos a crear las solicitudes de amistad
    const friend1 = await Friends.create({
      id_friend_1: userID1,
      id_friend_2: userID2,
      status: "Pending", // Estado de la solicitud
    });

    if (!friend1) {
      return { message: "Ya son amigos." };
    }
    
    return { message: "Solicitud enviada." };
  } catch (error) {
    return { message: error.message };
  }
}

/**
 * @description Rechaza una solicitud de amistad
 * @param {number} userId1 - El id del usuario
 * @param {number} userId2 - El id del amigo
 * @returns {Json} - Un objeto con un mensaje de éxito o error
 * @throws {Error} - Si no se encuentra
 */
async function denySolicitud(userID1, userID2) {
  try {
    // Actualizar la relación de amistad de userID1 y userID2
    const updatedFriend1 = await Friends.update(
      { status: "Denied" }, // Actualizamos el status a true
      {
        where: {
          id_friend_1: userID2,
          id_friend_2: userID1,
        },
      }
    );

    // Si no se actualizó ningún registro, significa que no existen relaciones
    if (updatedFriend1[0] === 0) {
      throw new Error("La relacione de amistad no existe.");
    }

    return { message: "Amistad añadida correctamente." };
  } catch (error) {
    return { message: error.message };
  }
}

/**
 * @description Elimina un amigo de un usuario
 * @param {number} userId - El id del usuario
 * @param {number} friendId - El id del amigo
 * @returns {Json} - Un objeto con un mensaje de éxito o error
 * @throws {Error} - Si no se encuentra
 */
async function delFriend(userID1, userID2) {
  try {
    const friend = await Friends.destroy({
      where: {
        [Op.or]: [
          { id_friend_1: userID1, id_friend_2: userID2 },
          { id_friend_1: userID2, id_friend_2: userID1 }
        ]
      }
    });
    return {message: "Amigo eliminado"};
  }
  catch (error) {
    return {message: error.message};
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

async function checkConnection(username) {
  const user = await User.findOne({
    where: {username: username}
  });
  if(user.status) {
    return {message: "Usuario online"};
  }
  else {
    return {message: "Usuario offline"}
  }
}

module.exports = { getFriends, addFriend, delFriend, checkUser, checkConnection };

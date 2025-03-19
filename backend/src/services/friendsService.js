const Friends = require("../models/Friend.js");
const User = require("../models/User.js");

//TODO: Queda hacer el testing 

/**
 * @description Obtiene los amigos de un usuario
 * @param {number} userId - El id del usuario
 * @returns {Json} - Un objeto con los amigos del usuario
 */
async function getFriends(userId) {
    const friends = await Friends.findAll({
        where: {id_friend_1: userId},
        include: [
          {
            model: User,
            as: "friends",
            attributes: ["name", "lastConnection"]
          }
        ]
    });
    return friends;
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
      { status: true }, // Actualizamos el status a true
      {
        where: {
          id_friend_1: userID1,
          id_friend_2: userID2,
        },
      }
    );

    // Actualizar la relación de amistad de userID2 y userID1
    const updatedFriend2 = await Friends.update(
      { status: true }, // Actualizamos el status a true
      {
        where: {
          id_friend_1: userID2,
          id_friend_2: userID1,
        },
      }
    );

    // Si no se actualizó ningún registro, significa que no existen relaciones
    if (updatedFriend1[0] === 0 || updatedFriend2[0] === 0) {
      throw new Error("Las relaciones de amistad no existen.");
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
    const friend1 = await Friends.create({
      id_friend_1: userID1,
      id_friend_2: userID2,
      status: false,
    });
    const friend2 = await Friends.create({
      id_friend_1: userID2,
      id_friend_2: userID1,
      status: false,
    });
    return {message: "Solicitud enviada"};
  }
  catch (error) {
    return {message: error.message};
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
    const friend1 = await Friends.destroy({
      where: {
        id_friend_1: userID1,
        id_friend_2: userID2
      }
    });
    const friend2 = await Friends.destroy({
      where: {
        id_friend_1: userID2,
        id_friend_2: userID1
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
async function checkUser(username) {
  const user = await User.findOne({
    where: {name: username}
  });

  if(user) {
    return {message: "Usuario encontrado"};
  }
  else {
    return {message: "Usuario no encontrado"};
  }
}

module.exports = { getFriends, addFriend, addSolicitud, delFriend, checkUser };

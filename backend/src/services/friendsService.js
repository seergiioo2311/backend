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
 * @description Agrega un amigo a un usuario
 * @param {number} userId - El id del usuario
 * @param {number} friendId - El id del amigo
 * @returns {Json} - Un objeto con un mensaje de éxito o error
 * @throws {Error} - Si no se encuentra
 */
async function addFriend(userID1, userID2) {
  try {
    const friend1 = await Friends.create({
      id_friend_1: userID1,
      id_friend_2: userID2
    });
    const friend2 = await Friends.create({
      id_friend_1: userID2,
      id_friend_2: userID1
    });
    return {message: "Amigo añadido"};
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

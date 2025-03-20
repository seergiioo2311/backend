const friendsService = require("../services/friendsService.js");

/**
 * @description Obtiene los amigos de un usuario
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve los amigos del usuario
 * @throws {Error} - Maneja errores internos del servidor
 */
const get_friends = async (req, res) => {
  try {
    const user = req.params.id;
    const result = await friendsService.checkUser(user);
    
    //Si el usuario no existe en la base de datos
    if (!result) {
      throw new Error("User not found");
    }

    const friends = await friendsService.getFriends(user);
    res.status(200).json(friends);
  }
  catch(error) {
    res.status(500).json({message: error.message});
  }
}

/**
 * @description Agrega un amigo a un usuario
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve un mensaje de éxito o error
 * @throws {Error} - Maneja errores internos del servidor
 */
const add_friend = async (req, res) => {
  try {
    const user1 = req.params.id;
    const user2 = req.body.id;
    
    const status1 = await friendsService.checkUser(user1);
    const status2 = await friendsService.checkUser(user2);
    
    // En caso de que alguno de los usuarios no exista
    if(!status1 || !status2) {
      throw new Error("User not found");
    }

    const result = await friendsService.addFriend(user1, user2);
    res.status(200).json(result);
  }
  catch(error) {
    res.status(500).json({message: error.message});
  }
}

/**
 * @description Envia una solicitud de amigo
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve un mensaje de éxito o error
 * @throws {Error} - Maneja errores internos del servidor
 */
const add_solicitud = async (req, res) => {
  try {
    // Imprimimos el ID de los usuarios recibidos desde los parámetros y el cuerpo de la solicitud
    console.log("🔍 Parámetros recibidos:");
    console.log("user1 (ID del primer usuario):", req.params.id);
    console.log("user2 (ID del segundo usuario):", req.body.id);

    const user1 = req.params.id;
    const user2 = req.body.id;
    
    // Verificamos el estado de ambos usuarios
    console.log("🔄 Verificando usuarios...");
    const status1 = await friendsService.checkUser(user1);
    const status2 = await friendsService.checkUser(user2);

    console.log("🔍 Estado del usuario 1:", status1);
    console.log("🔍 Estado del usuario 2:", status2);
    
    // En caso de que alguno de los usuarios no exista
    if (!status1 || !status2) {
      console.error("❌ Error: Usuario(s) no encontrado(s)");
      throw new Error("User not found");
    }

    // Intentamos agregar la solicitud de amistad
    console.log("🔄 Enviando solicitud de amistad...");
    const result = await friendsService.addSolicitud(user1, user2);
    console.log("✅ Resultado de la solicitud de amistad:", result);
    
    // Respondemos con el resultado
    res.status(200).json(result);
  }
  catch (error) {
    // Si hay un error, lo imprimimos en la consola
    console.error("❌ Error en el servidor:", error);
    res.status(500).json({ message: error.message });
  }
}

/**
 * @description Elimina un amigo de un usuario
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve un mensaje de éxito o error
 * @throws {Error} - Maneja errores internos del servidor
 */
const del_friend = async (req, res) => {
  try {
    const user1 = req.params.id;
    const user2 = req.body.id;
    const result = await friendsService.delFriend(user1, user2);
    res.status(200).json(result);
  }
  catch(error) {
    res.status(500).json({message: error.message});
  }
}

/**
 * @description Comprueba si un usuario está registrado en la base de datos
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve un mensaje de éxito o error
 * @throws {Error} - Maneja errores internos del servidor
 */
const check_user = async (req, res) => {
  try {
    const user = req.body.username;
    const result = await friendsService.checkUser(user);
    res.status(200).json(result);
  }
  catch(error) {
    res.status(500).json({message: error.message});
  }
}

module.exports = { get_friends, add_friend, add_solicitud, del_friend, check_user };

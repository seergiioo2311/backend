const messagesService = require("../services/messagesService.js");

/**
 * @description Obtiene los chats con un usuario
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve los mensajes con un usuario
 * @throws {Error} - Maneja errores internos del servidor
 */
const get_messages = async (req, res) => {
  try {
    const user1 = req.params.idEmisor;
    const user2 = req.params.idReceptor;
    
    const status1 = await messagesService.checkUser(user1);
    const status2 = await messagesService.checkUser(user2);
    
    // En caso de que alguno de los usuarios no exista
    if(!status1 || !status2) {
      throw new Error("User not found");
    }

    const messages = await messagesService.getMessages(user1, user2);
    res.status(200).json(messages);
  }
  catch(error) {
    res.status(500).json({message: error.message});
  }
}


/**
 * @description Agrega un mensaje entre dos usuario
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve un mensaje de éxito o error
 * @throws {Error} - Maneja errores internos del servidor
 */
const add_message = async (req, res) => {
  try {

    const { id, id_friend_emisor, id_friend_receptor, content, date } = req.body;
    
    const status1 = await messagesService.checkUser(id_friend_emisor);
    const status2 = await messagesService.checkUser(id_friend_receptor);
    
    // En caso de que alguno de los usuarios no exista
    if(!status1 || !status2 || !content || content.trim() === "") {
      throw new Error("User not found");
    }

    const result = await messagesService.addMessage(id, id_friend_emisor, id_friend_receptor, content, date);
    res.status(200).json(result);
  }
  catch(error) {
    res.status(500).json({message: error.message});
  }
}

/**
 * @description Comrpueba si hay mensajes no vistos
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve un mensaje de éxito o error
 * @throws {Error} - Maneja errores internos del servidor
 */
const has_not_viewed_messages = async (req, res) => {   
  try {
    const idEmisor = req.params.idEmisor;
    const idReceptor = req.params.idReceptor;
    const status1 = await messagesService.checkUser(idReceptor);
    const status2 = await messagesService.checkUser(idEmisor);
    
    // En caso de que alguno de los usuarios no exista
    if(!status1 || !status2) {
      throw new Error("Users not found");
    }

    const result = await messagesService.hasNotViewedMessages(idEmisor, idReceptor);
    if (result) {
      res.status(200).json(result);
    }
  }
  catch(error) {
    res.status(500).json({message: error.message});
  }
}

/**
 * @description Obtiene el último mensaje entre dos usuarios 
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express 
 * @returns {Response} - Devuelve el último mensaje entre dos usuarios 
 * @throws {Error} - Maneja errores internos del servidor
 */ 
const getLastMessage = async (req, res) => {
  try {
    const { idEmisor, idReceptor } = req.params;
    const lastMessage = await messagesService.getLastMessage(idEmisor, idReceptor);
    res.status(200).json(lastMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { get_messages, add_message, has_not_viewed_messages, getLastMessage };

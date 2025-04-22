const itemService = require('../services/itemService');

/**
 * @description Asigna un item a un usuario.
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve un mensaje de éxito si se asigna el item y uno de error en caso de error
 * @throws {Error} - Maneja errores internos del servidor
 */
const assignItem = async (req, res) => {
  try {
    const user_id = req.body.userId;
    const item_id = req.body.itemId;

    console.log("User ID: ", user_id);
    console.log("Item ID: ", item_id);

    const result1 = await itemService.checkUser(user_id);
    const result2 = await itemService.checkItem(item_id);

    //Si el usuario no existe en la base de datos
    if (!result1 || !result2) {
      console.log("Usuario o items no encontrados");
      throw new Error("User not found");
    }


    const userItem = await itemService.assignItem(user_id, item_id);
    if (userItem) {
      console.log("Item asignado correctamente", userItem);
      res.status(200).json({ message: "Item asignado correctamente" });
    }
    else {
      res.status(404).json({ message: "El id de item o el id de usuario son incorrectos" });
    }
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @description Obtiene todos los items de un usuario.
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve un array con todos los items del usuario y uno de error en caso de error 
 * @throws {Error} - Maneja errores internos del servidor
 */
const getAllItems = async (req, res) => {
  try {
    const user_id  = req.params.id;
    const result = await itemService.checkUser(user_id);

    //Si el usuario no existe en la base de datos
    if (!result) {
      console.log("Usuario no encontrado");
      throw new Error("User not found");
    }
    const items = await itemService.getAllItems(user_id);
    res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { assignItem, getAllItems };

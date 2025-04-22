const shopService = require('../services/shopService');
const User = require('../models/User');

/**
 * @description Obtiene los items de una tienda
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve el conjunto de items de una tienda
 * @throws {Error} - Maneja errores internos del servidor
 */
const get_items = async (req, res) => {
  try{
    const shop_id = req.params.shop_id;
    const items = await shopService.getItems(shop_id);
    
    if(items) {
      res.status(200).json(items);
    }
    else{
      res.status(404).json({message: "No se han encontrado items."})
    }
  }
  catch(error) {
    res.status(500).json({message: error.message});
  }
}

/**
 * @description Devuelve el nombre de la tienda
 * @param {Request} req - Request de Express
 * @param {Response} res - Response de Express
 * @returns {Response} - Devuelve el nombre de la tienda
 * @throws {Error} - Maneja errores internos del servidor
 */
const get_name = async(req, res) => {
  try {
    const shop_id = req.params.shop_id;
    const shop_name = await shopService.getShopName(shop_id);
    if(shop_name) {
      res.status(200).json(shop_name);
    }
    else{
      res.status(404).json({message: "No se han encontrado la tienda."})
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

/**
 * @description Asocia un item a un usuario 
 * @param {Request} req - Request de Express 
 * @param {Response} res - Response de Express 
 * @returns {Response} - Devuelve un mensaje de éxito o error 
 * @throws {Error} - Maneja errores internos del servidor
 */ 
const itemPurchased = async (req, res) => {
  try {
    const item_id = req.body.item_id;
    let user_name = req.body.user_name; 
    user_name = await User.findOne({ where: { username: user_name } });
    if (!user_name) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    const result = await shopService.itemPurchasedInShopByUser(item_id, user_name.dataValues.id);
    if (result) {
      res.status(200).json({ message: "Item asociado al usuario correctamente." });
    } else {
      res.status(404).json({ message: "No se ha podido asociar el item al usuario." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @description Consulta si un usuario tiene desbloqueado el pase de temporada
 * @param {Request} req - Request de Express 
 * @param {Response} res - Response de Express 
 * @returns {Response} - Devuelve un mensaje de éxito o error 
 * @throws {Error} - Maneja errores internos del servidor
 */ 
const hasSP = async (req, res) => {
  try {
    const user_id = req.params.id;
    const user_name = await User.findOne({ where: { id: user_id } });
    if (!user_name) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    const result = await shopService.hasSP(user_id);
    console.log(result);
    if (result.success) {
      res.status(200).json( result );
    } else {
      res.status(404).json({ message: "Error" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

/**
 * @description Desbloquea el pase de temporada para un usuario
 * @param {Request} req - Request de Express 
 * @param {Response} res - Response de Express 
 * @returns {Response} - Devuelve un mensaje de éxito o error 
 * @throws {Error} - Maneja errores internos del servidor
 */ 
const purchasedSP = async (req, res) => {
  try {
    const user_id = req.body.user_id;
    const user_name = await User.findOne({ where: { id: user_id } });
    if (!user_name) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }
    const result = await shopService.unlockSeasonPassForUser(user_id);
    console.log(result);
    if (result) {
      res.status(200).json({ message: "SP asociado al usuario correctamente." });
    } else {
      res.status(404).json({ message: "No se ha podido asociar el SP al usuario." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { get_items, get_name, itemPurchased, hasSP, purchasedSP };

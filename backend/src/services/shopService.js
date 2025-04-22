const Shop = require("../models/Shop.js");
const User_item = require("../models/User_item.js");
const SP_for_user = require("../models/SP_for_user.js");
const SeasonPass = require("../models/SeasonPass.js");
const { Json } = require("sequelize/lib/utils");
const { where } = require("sequelize");
const { QueryTypes } = require('sequelize');
const { sequelize_game } = require("../config/db");
const { Op } = require("sequelize"); // Asegúrate de importar Op

/**
 * @description Obtiene los items que están registrados en una tienda
 * @param {number} shopId - El id de la tienda
 * @returns {Json} - Un objeto con los items de la tienda
 */
async function getItems(shopId) {
  try {
    const results = await sequelize_game.query(
    `
    SELECT i.name AS name_item, i.type AS item_type, si.item_price as item_price, i.id AS id_item
    FROM "Items" i
    JOIN "Shop_items" si ON si.id_item = i.id
    WHERE si.id_shop = :shopId
    `, {
      type: QueryTypes.SELECT,
      replacements: { shopId }
    });
    return results;
  } catch (error) {
    return {message: error.message}
  }
}

/**
 * @description Obtiene el nombre de una tienda por su id
 * @param {number} shopId - El id de la tienda
 * @returns {string} - El nombre de la tienda o null si no existe
 */
async function getShopName(shopId) {
  const shop_name = await Shop.findByPk(shopId, {
    attributes: ['name'] // Selecciona solo el campo 'name'
  });
  return shop_name ? shop_name.dataValues.name : null; // Retorna solo el nombre o null si no existe
}

// Hacer función para actualizar la relación User_item cuando un usuario compra un item en la tienda
async function itemPurchasedInShopByUser (idItem, idUser) {
  try {
    const results = await User_item.update({
      unlocked: true,
      reclaimed: true
    }, {
      where: { id_user: idUser, id_item: idItem }
    });
    return results;
  } catch (error) {
    return {message: error.message}
  }
}

/**
 * @description Consulta si un usuario tiene desbloqueado el pase de temporada
 * @param {number} userId - El id del usuario
 * @returns {Json} - Un objeto con los items de la tienda
 */
async function hasSP(userId) {
  try {
    // Obtenemos la temporada actual (asumiendo que hay un método para obtenerla)
    const currentSeason = await SeasonPass.findOne({
      where: { 
        start: { [Op.lte]: new Date() }, // start <= new Date()
        end: { [Op.gte]: new Date() }   // end >= new Date()
      },
      order: [['createdAt', 'DESC']]
    });
    
    if (!currentSeason) {
      return { 
        success: false, 
        hasSeasonPass: false, 
        message: "No hay una temporada activa actualmente" 
      };
    }
    
    // Consultar si el usuario tiene desbloqueado el pase de temporada
    const userSeasonPass = await SP_for_user.findOne({
      where: {
        id_user: userId,
        id_season: currentSeason.id
      }
    });
    
    // Si no existe un registro, o si existe pero unlocked es false, el usuario no tiene el pase
    if (!userSeasonPass) {
      return { 
        success: true, 
        hasSeasonPass: false,
        seasonInfo: {
          id: currentSeason.id,
          name: currentSeason.name,
          startDate: currentSeason.startDate,
          endDate: currentSeason.endDate
        }
      };
    }
    
    // Si el registro existe y unlocked es true, el usuario tiene el pase
    return { 
      success: true, 
      hasSeasonPass: userSeasonPass.unlocked,
      seasonInfo: {
        id: currentSeason.id,
        name: currentSeason.name,
        startDate: currentSeason.startDate,
        endDate: currentSeason.endDate
      }
    };
    
  } catch (error) {
    console.error("Error al verificar el pase de temporada:", error);
    throw new Error("Error al verificar el pase de temporada");
  }
}

/**
 * @description Desbloquea el pase de temporada para un usuario
 * @param {number} userId - El id del usuario
 * @returns {Promise<SP_for_user>} -  Promesa con el resultado de la operación
 */
async function unlockSeasonPassForUser(userId) {
  try {
    // Obtenemos la temporada actual activa
    const currentSeason = await SeasonPass.findOne({
      where: {  start: { [Op.lte]: new Date() }, // start <= new Date()
                end: { [Op.gte]: new Date() }}, // end >= new Date(),
      order: [['createdAt', 'DESC']]
    });

    if (!currentSeason) {
      throw new Error("No hay una temporada activa actualmente");
    }

    const result = await SP_for_user.create({
        id_user: userId,
        id_season: currentSeason.id,
        unlocked: true
    });
    return result;
  } catch (error) {
    console.error("Error al desbloquear el pase de temporada:", error);
    throw new Error("Error al desbloquear el pase de temporada");
  }
}



module.exports = { getItems, getShopName, itemPurchasedInShopByUser, hasSP, unlockSeasonPassForUser };

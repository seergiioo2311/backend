const Shop = require("../models/Shop.js");
const Shop_item = require("../models/Shop_item.js");
const Item = require("../models/Item.js");
const User_item = require("../models/User_item.js");
const User = require("../models/User.js");
const { Json } = require("sequelize/lib/utils");
const { where } = require("sequelize");
const { QueryTypes } = require('sequelize');
const { sequelize_game } = require("../config/db");

/**
 * @description Obtiene los items que están registrados en una tienda
 * @param {number} shopId - El id de la tienda
 * @returns {Json} - Un objeto con los items de la tienda
 */
async function getItems(shopId) {
  try {
    const results = await sequelize_game.query(
    `
    SELECT i.name AS name_item, i.type AS item_type, si.item_price as item_price
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

// Hacer función de insertar item en la relación User_item 
async function itemPurchasedInShopByUser (idItem, idUser) {
  try {
    results = await User_item.create({ id_item: idItem, id_user: idUser });
    return results;
  } catch (error) {
    return {message: error.message}
  }
}

module.exports = { getItems, getShopName, itemPurchasedInShopByUser };

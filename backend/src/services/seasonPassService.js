const { sequelize_game } = require("../config/db");
const { Json } = require("sequelize/lib/utils");
const { where } = require("sequelize");
const { QueryTypes } = require('sequelize');
const { UPDATE } = require("sequelize/lib/query-types");

/**
 * @description Obtiene la información de todos los items, junto con el nivel requerido, que están registrados en un pase de temporada
 * @param {number} idSeasonPass - El id del pase de temporada
 * @returns - Un objeto con los items del pase de temporada
 */
async function getItemsFromSeasonPass(idSeasonPass) {
  try {
    const results = await sequelize_game.query(
    `
    SELECT si.level_required, i.id, i.name, i.type
    FROM "SeasonPasses" sp
    JOIN "SP_items" si ON si.id_season = sp.id
    JOIN "Items" i ON i.id = si.id_item
    WHERE sp.id = :idSeasonPass 
    `, {
      type: QueryTypes.SELECT,
      replacements: { idSeasonPass }
    });
    return results;
  } catch (error) {
    return {message: error.message}
  }
}

/**
 * @description Obtiene la información de todos los items, junto con el nivel requerido, que están registrados en el sistema
 * @returns - Un objeto con los items de los niveles
 */
async function getItemsFromLevels() {
  try {
    const results = await sequelize_game.query(
      `
      SELECT il.id_level, i.id, i.name, i.type
      FROM "Items" i, "Item_levels" il
      WHERE i.id = il.id_item
      `, {
        type: QueryTypes.SELECT
      }
    );
    return results;
  } catch (error) {
    return {message: error.message}
  }
}

async function unlockSeasonPassForUser (idSeasonPass, idUser) {
  try {
    const results = sequelize_game.query(
      `
      UPDATE "SP_FOR_USERS" SET unlocked = true WHERE id_season = :idSeasonPass AND id_user = :idUser
      `, {
        QueryTypes: UPDATE,
        replacements: {idSeasonPass, idUser}
      }
    );
    return results;
  } catch (error) {
    return {message: error.message}
  }
}

module.exports = { getItemsFromSeasonPass, getItemsFromLevels, unlockSeasonPassForUser };
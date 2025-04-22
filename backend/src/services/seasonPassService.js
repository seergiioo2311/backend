const { sequelize_game } = require("../config/db");
const { Json } = require("sequelize/lib/utils");
const { where } = require("sequelize");
const { QueryTypes } = require('sequelize');
const { UPDATE } = require("sequelize/lib/query-types");
const  User  = require("../models/User.js");
const  UserLevel  = require("../models/User_level.js");
const Level = require("../models/Level.js");
const SP_for_user = require("../models/SP_for_user.js");
const SeasonPass = require("../models/SeasonPass.js");

/**
 * @description Obtiene la información de todos los items, junto con el nivel requerido, que están registrados en un pase de temporada
 * @param {number} idSeasonPass - El id del pase de temporada
 * @returns - Un objeto con los items del pase de temporada
 */
async function getItemsFromSeasonPass(idSeasonPass, idUser) {
  try {
    const results = await sequelize_game.query(
      `
      SELECT si.level_required, ui.unlocked, ui.reclaimed, i.id, i.name, i.type
      FROM "SeasonPasses" sp
      JOIN "SP_items" si ON si.id_season = sp.id
      JOIN "Items" i ON i.id = si.id_item
      JOIN "User_items" ui ON ui.id_item = i.id
      WHERE sp.id = :idSeasonPass AND ui.id_user = :idUser
      ORDER BY si.level_required ASC
      `, {
        type: QueryTypes.SELECT,
        replacements: { idSeasonPass, idUser }
      }
    );
    return results;
  } catch (error) {
    return { message: error.message };
  }
}

/**
 * @description Obtiene la información de todos los items, junto con el nivel requerido, que están registrados en el sistema
 * @returns - Un objeto con los items de los niveles
 */
async function getItemsFromLevels(idUser) {
  try {
    const results = await sequelize_game.query(
      `
      SELECT il.id_level, ui.unlocked, ui.reclaimed, i.id, i.name, i.type
      FROM "Items" i
      JOIN "Item_levels" il ON i.id = il.id_item
      JOIN "User_items" ui ON ui.id_item = i.id
      WHERE ui.id_user = :idUser
      ORDER BY il.id_level ASC
      `, {
        type: QueryTypes.SELECT,
        replacements: { idUser: idUser }
      }
    );
    return results;
  } catch (error) {
    return {message: error.message}
  }
}

/**
 * @description Obtiene el nivel de un usuario
 * @param {uuid} userId - El id del usuario
 * @returns {Json} - Un objeto con el nivel del usuario o un error
 * @throws {Error} - Si no se encuentra
 */
async function getUserLevel(userId) {
  const user = await User.findOne({
    where: {id: userId}
  });

  if(user) {
    const result = await UserLevel.findOne({
      where: {user_id: userId}
    });
    if(result) {
      console.log(result.user_level);
      return {level: result.user_level};
    } else {
      return {message: "No se ha encontrado el nivel del usuario"};
    }
  }
  else {
    return {message: "Usuario no encontrado"};
  }
} 

/**
 * @description Obtiene la experiencia del usuario
 * @param {uuid} userId - El id del usuario
 * @returns {Json} - Un objeto con la experiencia del usuario o un error
 * @throws {Error} - Si no se encuentra
 */
async function getUserExperience(userId) {
  const result = await User.findOne({
    where: {id: userId}
  });

  if(result) {
    if(result) {
      console.log(result.experience);
      return {experience: result.experience};
    } else {
      return {message: "No se ha encontrado la experiencia del usuario"};
    }
  }
  else {
    return {message: "Usuario no encontrado"};
  }
} 

/**
 * @description Obtiene la experiencia necesaria para subir de nivel
 * @param {number} level - El nivel del usuario
 * @returns {Json} - Un objeto con la experiencia necesaria para subir de nivel o un error
 * @throws {Error} - Si no se encuentra
 */
async function getExperienceToNextLevel(level) {
  const result = await Level.findOne({
    where: {level_number: level}
  });   
  if(result) {
    console.log(result.experience_required);
    return {experience: result.experience_required};
  }
  else {
    return {message: "Nivel no encontrado"};
  }
} 

/**
 * @description Obtiene un booleano para saber si el usuario ha desbloqueado el pase de batalla
 * @param {uuid} userId - El id del usuario
 * @param {number} seasonPassId - El id del pase de temporada
 * @returns {Json} - Un objeto con un booleano y un mensaje de error
 * @throws {Error} - Si no se encuentra
 */
async function hasUserSP(userId, seasonPassId) {
  const result = await SP_for_user.findOne({
    where: {id_user: userId
    , id_season: seasonPassId}
  });
  if(result) {
    console.log(result.unlocked);
    return {unlocked: result.unlocked};
  }
  else {
    return {message: "Usuario no encontrado"};
  }
} 

/**
 * @description Comprueba si un usuario esta registrado en la base de datos
 * @param {uuid} userId - El id del usuario
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

/**
 * @description Comprueba si un pase de temporada esta registrado en la base de datos
 * @param {number} seasonPassId - El id del pase de temporada
 * @returns {Json} - Un objeto con un mensaje de éxito o error
 * @throws {Error} - Si no se encuentra
 */ 
async function checkSeasonPass(seasonPassId) {
  const user = await SeasonPass.findOne({
    where: {id: seasonPassId}
  });

  if(user) {
    return {message: "Pase de temporada encontrado"};
  }
  else {
    return {message: "Pase de temporada no encontrado"};
  }
}


module.exports = { getItemsFromSeasonPass, getItemsFromLevels, getUserLevel, getUserExperience, getExperienceToNextLevel, hasUserSP, checkUser, checkSeasonPass };
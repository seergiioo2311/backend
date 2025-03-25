const User = require('../models/User');
const { Item } = require('../models/Item');
const UserItem = require('../models/User_item');
const { validate, version } = require('uuid');

/**
  * @description Asigna un item a un usuario.
  * @param {UUID} userId - ID del usuario.
  * @param {number} itemId - ID del item.
  * @returns {Promise<UserItem>} - Promesa con el item asignado.
  * @throws {Error} - Error en caso de que el usuario o el item no existan.
  */
async function assignItem(userId, itemId) {
    try {
        if (!validate(userId) || version(userId) !== 4) {
            throw new Error('ID de usuario inválido');
        }

        const user = await User.findByPk(userId);
        const item = await Item.findByPk(itemId);
        
        if (!user || !item) {
            throw new Error('Usuario o item no encontrado');
        }
        const userItem = await UserItem.create({ id_user: userId, id_item: itemId });
        return userItem;
    } catch (error) {
        throw error;
    }
}

/**
  * @description Obtiene todos los items de un usuario. 
  * @param {UUID} userId - ID del usuario.
  * @returns {Promise<UserItem[]>} - Promesa con todos los items del usuario.
  * @throws {Error} - Error en caso de que el usuario no exista.
  */ 
async function getAllItems(user_id) {
    try {
        if (!validate(user_id) || version(user_id) !== 4) {
            throw new Error('ID de usuario inválido');
        }
        const user = await User.findByPk(user_id);
        if (!user) {
            throw new Error('Usuario no encontrado');
        }
        const items = await UserItem.findAll({where: { id_user: user_id }});
        return items;
    }
    catch (error) {
        throw error;
    }
}

module.exports = { assignItem, getAllItems };

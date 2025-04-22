const { ContactSupport, TYPE_ISSUE } = require('../models/contactSupport');
const { Op } = require('sequelize');
const axios = require('axios');
const { Json } = require('sequelize/lib/utils');


async function newMessage(title, email, description, type) {
    try {
        const newMessage = await ContactSupport.create({
            title: title,
            email: email,
            description: description,
            type: type
        });
        return newMessage;
    } catch (error) {
        console.error(error);
        throw new Error(`Error creando mensaje: ${error.message}`);
    }
}

async function getAllMessages() {
    try {
        const messages = await ContactSupport.findAll({
            order: [['createdAt', 'DESC']]
        });
        return messages;
    } catch (error) {
        console.error(error);
        throw new Error(`Error obteniendo mensajes: ${error.message}`);
    }
}

async function getMesageById(id) {
    try {
        const message = await ContactSupport.findOne({
            where: { id: id }
        });
        return message;
    } catch (error) {
        console.error(error);
        throw new Error(`Error obteniendo mensaje: ${error.message}`);
    }
}

async function responseMessage(id, response) {
    try {
        const message = await ContactSupport.findOne({
            where: { id: id }
        });

        if (!message) {
            throw new Error('Mensaje no encontrado');
        }

        message.resolved = true;
        message.response = response;
        await message.save();

        return message;
    } catch (error) {
        console.error(error);
        throw new Error(`Error resolviendo mensaje: ${error.message}`);
    }
}

async function getMessagesUnresolved() {
    try {
        const messages = await ContactSupport.findAll({
            where: {
                resolved: false
            },
            order: [['createdAt', 'DESC']]
        });
        return messages;
    } catch (error) {
        throw new Error(`Error obteniendo mensajes no resueltos: ${error.message}`);
    }
}

async function getMessagesResolved() {
    try {
        const messages = await ContactSupport.findAll({
            where: {
                resolved: true
            },
            order: [['createdAt', 'DESC']]
        });
        return messages;
    } catch (error) {
        throw new Error(`Error obteniendo mensajes resueltos: ${error.message}`);
    }
}

async function getMessagesByType(type) {
    try {
        const messages = await ContactSupport.findAll({
            where: {
                type: type
            },
            order: [['createdAt', 'DESC']]
        });
        return messages;
    } catch (error) {
        throw new Error(`Error obteniendo mensajes por tipo: ${error.message}`);
    }
}

async function deleteMessage(id) {
    try {
        const message = await ContactSupport.findOne({
            where: { id: id }
        });

        if (!message) {
            throw new Error('Mensaje no encontrado');
        }

        await message.destroy();
        return message;
    } catch (error) {
        console.error(error);
        throw new Error(`Error eliminando mensaje: ${error.message}`);
    }
}

module.exports = { newMessage, getAllMessages, getMesageById, responseMessage, getMessagesUnresolved, getMessagesResolved, getMessagesByType, deleteMessage };
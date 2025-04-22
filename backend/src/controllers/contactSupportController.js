const contactSupportService = require('../services/contactSupportService');

const newMessage = async (req, res) => {
    try {
        const { title, email, description, type } = req.body;
        const message = await contactSupportService.newMessage(title, email, description, type);
        if (!message) {
            return res.status(404).json({ message: "Error creando el mensaje" });
        }
        else {
            res.status(201).json(message);
        }
        } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllMessages = async (req, res) => {
    try {
        const messages = await contactSupportService.getAllMessages();
        if (!messages) {
            return res.status(404).json({ message: "Error obteniendo los mensajes" });
        }
        else {
            res.status(200).json(messages);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getMesageById = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await contactSupportService.getMesageById(id);
        if (!message) {
            return res.status(404).json({ message: "Error obteniendo el mensaje" });
        }
        else {
            res.status(200).json(message);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const reponseMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { response } = req.body;
        const message = await contactSupportService.responseMessage(id, response);
        if (!message) {
            return res.status(404).json({ message: "Error resolviendo el mensaje" });
        }
        else {
            res.status(200).json(message);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getMessagesUnresolved = async (req, res) => {
    try {
        const messages = await contactSupportService.getMessagesUnresolved();
        if (!messages) {
            return res.status(404).json({ message: "Error obteniendo los mensajes" });
        }
        else {
            res.status(200).json(messages);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getMessagesResolved = async (req, res) => {
    try {
        const messages = await contactSupportService.getMessagesResolved();
        if (!messages) {
            return res.status(404).json({ message: "Error obteniendo los mensajes" });
        }
        else {
            res.status(200).json(messages);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getMessagesByType = async (req, res) => {
    try {
        const { type } = req.params;
        const messages = await contactSupportService.getMessagesByType(type);
        if (!messages) {
            return res.status(404).json({ message: "Error obteniendo los mensajes" });
        }
        else {
            res.status(200).json(messages);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await contactSupportService.deleteMessage(id);
        if (!message) {
            return res.status(404).json({ message: "Error eliminando el mensaje" });
        }
        else {
            res.status(200).json(message);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { newMessage, getAllMessages, getMesageById, reponseMessage, getMessagesUnresolved, getMessagesResolved, getMessagesByType, deleteMessage };

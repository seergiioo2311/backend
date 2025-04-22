// File: routes/contactSupportRoutes.js
// Fichero que define las rutas de las funcionalidades para contactar con el soporte
const express = require('express');
const { newMessage, getAllMessages, getMesageById, reponseMessage, getMessagesUnresolved, getMessagesResolved, getMessagesByType, deleteMessage } = require("../models/contactSupport.js");
const router = express.Router();

router.post('/new', newMessage); // Crear un nuevo mensaje
router.get('/all', getAllMessages); // Obtener todos los mensajes
router.get('/:id', getMesageById); // Obtener un mensaje por su id
router.post('/reponse/:id', reponseMessage); // Responder a un mensaje
router.get('/unresolved', getMessagesUnresolved); // Obtener mensajes sin resolver
router.get('/resolved', getMessagesResolved); // Obtener mensajes resueltos
router.get('/type/:type', getMessagesByType); // Obtener mensajes por tipo
router.delete('/delete/:id', deleteMessage); // Eliminar un mensaje por su id

module.exports = router;
// File: routes/contactSupportRoutes.js
// Fichero que define las rutas de las funcionalidades para contactar con el soporte
const express = require('express');
const { newMessage, getAllMessages, getMesageById, reponseMessage, getMessagesUnresolved, getMessagesResolved, getMessagesByType, deleteMessage, deleteUser, getUsers, getNumUsers } = require("../controllers/contactSupportController.js");
const router = express.Router();

router.post('/new', newMessage); // Crear un nuevo mensaje
router.get('/all', getAllMessages); // Obtener todos los mensajes
router.get('/getMessageById/:id', getMesageById); // Obtener un mensaje por su id
router.post('/response/:id', reponseMessage); // Responder a un mensaje
router.get('/unresolved', getMessagesUnresolved); // Obtener mensajes sin resolver
router.get('/resolved', getMessagesResolved); // Obtener mensajes resueltos
router.get('/type/:type', getMessagesByType); // Obtener mensajes por tipo
router.delete('/delete/:id', deleteMessage); // Eliminar un mensaje por su id
router.post('/delete-user/:id', deleteUser); // Eliminar un usuario por su id
router.get('/get-users/:username', getUsers); // Obtener usuarios para el buscador
router.get('/get-num-users', getNumUsers); // Obtener el número de usuarios

module.exports = router;
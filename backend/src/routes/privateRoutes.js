// File: routes/privateRoutes.js
// Fichero que define las rutas de las partidas privadas
const express = require('express');
const { createPrivateGame, getPrivateGame, getPrivateEndPoint, deletePrivateGame, getPlayers } = require('../controllers/privateGames');
const router = express.Router();

router.post('/create', createPrivateGame);
router.get('/', getPrivateGame);
router.post('/join', getPrivateEndPoint);
router.delete('/delete/:id', deletePrivateGame);
router.get('/players/:gameId', getPlayers);

module.exports = router;

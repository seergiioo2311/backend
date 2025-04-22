// File: routes/privateRoutes.js
// Fichero que define las rutas de las partidas privadas
const express = require('express');
const { createPrivateGame, getPrivateGame, getPrivateEndPoint, deletePrivateGame, getPlayers, getPrivateGameWithId } = require('../controllers/privateGames');
const router = express.Router();

router.post('/create', createPrivateGame);
router.get('/', getPrivateGame);
router.post('/join', getPrivateEndPoint);
router.delete('/delete/:id', deletePrivateGame);
router.get('/players/:gameId', getPlayers);
router.get('/:gameId', getPrivateGameWithId);

module.exports = router;

// File: routes/privateRoutes.js
// Fichero que define las rutas de las partidas privadas
const express = require('express');
const { createPrivateGame, getPrivateGame, getPrivateEndPoint, deletePrivateGame, getPlayers, isReady, getAllPlayers, getLink, uploadValues, 
      getPrivateGamesUnfinished } = require('../controllers/privateGames');
const router = express.Router();

router.post('/create', createPrivateGame);
router.get('/', getPrivateGame);
router.post('/join', getPrivateEndPoint);
router.delete('/delete/:id', deletePrivateGame);
router.get('/players/:gameId', getPlayers);
router.post('/ready/:gameId/:userId', isReady);
router.get('/allPlayers/:gameId', getAllPlayers);
router.get('/link/:gameId', getLink);
router.post('/uploadValues/:gameId/:userId/:status/:n_divisions/:x_pos/:y_pos/:score', uploadValues)
router.get('/unfinished/:userId', getPrivateGamesUnfinished);

module.exports = router;

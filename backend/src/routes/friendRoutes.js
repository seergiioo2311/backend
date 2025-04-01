const express = require('express');
const {get_friends, get_solicitudes, add_friend, add_solicitud, deny_solicitud, del_friend, check_user} = require('../controllers/friendsController');

const router = express.Router();

router.get('/get_friends/:id', get_friends);
router.get('/get_solicitudes/:id', get_solicitudes);
router.post('/add_friend/:id', add_friend);
router.post('/add_solicitud/:id', add_solicitud);
router.post('/deny_solicitud/:id', deny_solicitud);
router.delete('/del_friend/:id', del_friend);
router.get('/:id/check_user', check_user);

module.exports = router;

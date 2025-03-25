const express = require('express');

const { get_user, get_id, update_connection, update_user } = require('../controllers/mainScreenController');

const router = express.Router();

router.get('/get-user/:id', get_user);
router.get('/get-id/:username', get_id);
router.put('/update-connection/:id', update_connection);
router.put('/update-user/:id', update_user);

 module.exports = router;  
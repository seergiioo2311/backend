const express = require('express');

const { get_user, get_id, update_connection } = require('../controllers/mainScreenController');

const router = express.Router();

router.get('/get-user/:id', get_user);
router.get('/get-id/:username', get_id);
router.put('/update-connection/:id', update_connection);

 module.exports = router;

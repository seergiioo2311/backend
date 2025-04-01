const express = require('express');

const { get_user, update_connection } = require('../controllers/mainScreenController');

const router = express.Router();

router.get('/get-user/:id', get_user);
router.put('/update-connection/:id', update_connection);

module.exports = router;

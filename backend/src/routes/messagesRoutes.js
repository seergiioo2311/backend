const express = require('express');
const {get_messages, add_message} = require('../controllers/messageController');

const router = express.Router();

router.get('/get_messages/:idEmisor/:idReceptor', get_messages);
router.post('/add_message', add_message);

module.exports = router;
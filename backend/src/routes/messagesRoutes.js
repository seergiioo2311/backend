const express = require('express');
const {get_messages, add_message, has_not_viewed_messages, get_last_message} = require('../controllers/messageController');

const router = express.Router();

router.get('/get_messages/:idEmisor/:idReceptor', get_messages);
router.post('/add_message', add_message);
router.get('/has_not_viewed_messages/:idEmisor/:idReceptor',has_not_viewed_messages);
router.get('/get-last/:idEmisor/:idReceptor', get_last_message);

module.exports = router;

const express = require('express');
const {get_friends, add_friend, del_friend, check_user} = require('../controllers/friendsController');

const router = express.Router();

router.get('/friends/:id', get_friends);
router.post('/friends/:id', add_friend);
router.delete('/friends/:id', del_friend);
router.get('/friends/:id/check_user', check_user);

module.exports = router;

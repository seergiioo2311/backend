const express = require('express');
const {get_achievements, get_unachieved_achievements, unlock_achievement} = require('../controllers/achievementsController');

const router = express.Router();

router.get('/achievements/:id', get_achievements);
router.get('/unachieved-achievements/:id', get_unachieved_achievements);
router.post('/unlock-achievement', unlock_achievement);

module.exports = router;

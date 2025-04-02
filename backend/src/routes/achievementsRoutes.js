const express = require('express');
const {get_achievements, unlock_achievement, update_achievement} = require('../controllers/achievementsController');

const router = express.Router();

router.get('/achievements/:id', get_achievements);
router.post('/unlock-achievement', unlock_achievement);
router.post('/update-achievement', update_achievement);

module.exports = router;

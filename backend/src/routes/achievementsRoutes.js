const express = require('express');
const {get_achievements, get_unachieved_achievements} = require('../controllers/achievementsController');

const router = express.Router();

router.get('/achievements/:id', get_achievements);
router.get('/unachieved-achievements/:id', get_unachieved_achievements);

module.exports = router;

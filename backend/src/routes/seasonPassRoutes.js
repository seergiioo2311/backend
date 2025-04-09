const express = require('express');

const { get_items_from_season_pass, get_items_from_levels, unlock_season_pass_for_user } = require("../controllers/seasonPassController");

const router = express.Router();

router.get('/season-pass/getItemsFromSeasonPass/:idSeasonPass', get_items_from_season_pass);
router.get('/season-pass/getItemsFromLevels', get_items_from_levels);
router.get('/season-pass/unlockSeasonPass/:idSeasonPass/:idUser', unlock_season_pass_for_user);

module.exports = router;
const express = require('express');

const { get_items_from_season_pass, get_items_from_levels,  get_user_level, get_user_experience, get_experience_to_next_level, has_user_sp } = require("../controllers/seasonPassController");

const router = express.Router();

router.get('/season-pass/getItemsFromSeasonPass/:idUser/:idSeasonPass', get_items_from_season_pass);
router.get('/season-pass/getItemsFromLevels/:idUser', get_items_from_levels);
router.get('/season-pass/getUserLevel/:idUser', get_user_level);
router.get('/season-pass/getUserExperience/:idUser', get_user_experience);
router.get('/season-pass/getExperienceToNextLevel/:level', get_experience_to_next_level);
router.get('/season-pass/hasUserSP/:idUser/:idSeasonPass', has_user_sp); 
/*
router.post('/season-pass/reclaimSPItem', reclaim_sp_item);
router.post('/season-pass/reclaimItemLevel', reclaim_item_level);
*/

module.exports = router;
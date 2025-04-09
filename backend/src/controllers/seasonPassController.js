const SeasonPassService = require('../services/seasonPassService');

const get_items_from_season_pass = async (req, res) => {
  try {
    const idSeasonPass = req.params.idSeasonPass;
    const items = await SeasonPassService.getItemsFromSeasonPass(idSeasonPass);
    if (items) {
        res.status(200).json(items);
    } else {
        res.status(404).json({ message: "No se han encontrado items." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const get_items_from_levels = async (req, res) => {
  try {
    const items = await SeasonPassService.getItemsFromLevels();
    if (items) {
      res.status(200).json(items);
    } else {
      res.status(404).json({ message: "No se han encontrado items." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const unlock_season_pass_for_user = async (req, res) => {
  try {
    const idSeasonPass = req.params.idSeasonPass;
    const idUser = req.params.idUser;
    const result = await SeasonPassService.unlockSeasonPassForUser(idSeasonPass, idUser);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "No se ha podido desbloquear el pase de batalla correctamente." });
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
}

module.exports = { get_items_from_season_pass, get_items_from_levels, unlock_season_pass_for_user };
const express = require('express');

const { get_items, get_name, itemPurchased } = require("../controllers/shopController");

const router = express.Router();

router.get('/shop/getItems/:shop_id', get_items);
router.get('/shop/getName/:shop_id', get_name);
router.post('/shop/purchased/:item_id/:user_name', itemPurchased);

module.exports = router;
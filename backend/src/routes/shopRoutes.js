const express = require('express');

const { get_items, get_name, itemPurchased } = require("../controllers/shopController");

const router = express.Router();

router.get('/getItems/:shop_id', get_items);
router.get('/getName/:shop_id', get_name);
router.post('/purchased', itemPurchased);

module.exports = router;

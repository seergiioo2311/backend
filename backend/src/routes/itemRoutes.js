const express = require('express');

const { assignItem, getAllItems } = require('../controllers/assignItemController');

const router = express.Router();

router.post('/assign-item', assignItem);
router.get('/get-all-items/:id', getAllItems);

module.exports = router;

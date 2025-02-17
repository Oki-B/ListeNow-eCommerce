const express = require('express');
const purchaseController = require('../controllers/purchaseController');
const router = express.Router();

router.get('/:UserId', purchaseController.getPurchase);


module.exports = router;
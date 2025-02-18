const express = require('express');
const purchaseController = require('../controllers/purchaseController');
const router = express.Router();

router.get('/', purchaseController.getPurchase);
router.post('/buy/:ProductId', purchaseController.buyProduct);

// router.get('/print/:ProductId', purchaseController.printProduct);




module.exports = router;
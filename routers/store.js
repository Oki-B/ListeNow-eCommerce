const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { authorization } = require('../middleware/authorization');

router.use(authorization)

router.get('/add-product', storeController.getAddProduct);
router.post('/add-product', storeController.postAddProduct);

router.get('/edit-product/:id', storeController.getEditProduct);

router.get('/:userId', storeController.getStore);

module.exports = router;
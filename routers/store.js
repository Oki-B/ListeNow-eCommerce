const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { authorization } = require('../middleware/authorization');

router.use(authorization)

router.get('/add-product', storeController.getAddProduct);
router.post('/add-product', storeController.postAddProduct);

router.get('/edit-product/:id', storeController.getEditProduct);
router.post('/edit-product/:id', storeController.postEditProduct);

router.get('/delete-product/:id', storeController.deleteProduct);

router.get('/:userId', storeController.getStore);

module.exports = router;
const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { isStore, authorization } = require('../middleware/authorization');

router.use(isStore)
// router.use(authorization)

router.get('/', storeController.getStore);

router.get('/add-product', storeController.getAddProduct);
router.post('/add-product', storeController.postAddProduct);

router.get('/edit-product/:id', storeController.getEditProduct);
router.post('/edit-product/:id', storeController.postEditProduct);

router.get('/delete-product/:id', storeController.deleteProduct);



module.exports = router;
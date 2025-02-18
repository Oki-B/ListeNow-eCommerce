const express = require('express');
const router = express.Router();
const { isLogin, isNotLogin } = require('../middleware/authentication');
const UserController = require('../controllers/userController');
const user = require('../models/user');
const { authorization } = require('../middleware/authorization');

router.get('/login', isLogin, UserController.getLogin);
router.post('/login', isLogin, UserController.postLogin);

router.get('/register', isLogin, UserController.getRegister);
router.post('/register', isLogin, UserController.postRegister);
router.get('/error', UserController.showError);

router.use(isNotLogin); // middleware for checking if user is not login

router.get('/logout', UserController.logout);

router.get('/', UserController.getHome);

router.use('/:UserId/purchase',authorization, require('./purchase'))
router.use('/:UserId/store', authorization, require('./store'))


router.get('/:UserId/edit-profile', authorization, UserController.editProfile);
router.post('/:UserId/edit-profile', authorization, UserController.postEditProfile);

module.exports = router;
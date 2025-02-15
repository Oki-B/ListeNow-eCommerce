const express = require('express');
const router = express.Router();
const { isLogin, isNotLogin } = require('../middleware/authentication');
const UserController = require('../controllers/userController');
const user = require('../models/user');

router.get('/login', isLogin, UserController.getLogin);
router.post('/login', isLogin, UserController.postLogin);

router.get('/register', isLogin, UserController.getRegister);
router.post('/register', isLogin, UserController.postRegister);

router.use(isNotLogin); // middleware for checking if user is not login

router.get('/logout', UserController.logout);

router.get('/', UserController.getHome);

module.exports = router;
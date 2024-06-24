const express = require('express');
const router = express.Router();
const loginController = require('../../controller/user/loginController');
const verifyUser = require('../../library/verify');

router.get('/', verifyUser.isLogout, loginController.loginAuth);
router.get('/logout', loginController.logout);

router.post('/user', verifyUser.isLogout, loginController.loginAuth);

module.exports = router;

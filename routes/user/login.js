const express = require('express');
const router = express.Router();
const loginController = require('../../controller/user/loginController');
const verifyUser = require('../../library/verify');

router.get('/logout', loginController.logout);

router.post('/user', loginController.loginAuth);

module.exports = router;

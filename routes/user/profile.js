const express = require('express');
const router = express.Router();
const profileController = require('../../controller/user/profileController');
var verifyUser = require('../../library/verify');


router.get('/profile', verifyUser.isLogin, profileController.profile);

module.exports = router;
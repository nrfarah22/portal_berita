var express = require('express');
var router = express.Router();
const profileController = require('../controller/user/profileController');
const beritaController = require('../controller/admin/beritaController');


router.get('/profile', profileController.profile);

module.exports = router;
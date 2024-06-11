var express = require('express');
var router = express.Router();
var homeController = require('../controller/homeController');
const profileController = require('../controller/user/profileController');
const beritaController = require('../controller/admin/beritaController');

router.get('/', homeController.home);
router.get('/profile', profileController.profile);
router.get('/dashboard', beritaController.berita);

module.exports = router;
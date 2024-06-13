const express = require('express');
const router = express.Router();
const loginAdminController = require('../../controller/admin/loginAdminController');
const verifyUser = require('../../library/verify');

router.get('/', loginAdminController.loginAdmin);
router.get('/logout', loginAdminController.logout);

router.post('/admin', loginAdminController.loginAdmin);

module.exports = router;
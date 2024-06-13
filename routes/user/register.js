// Definisikan router dari express
const router = require('express').Router();
// Ambil index.js dari controller dan panggil variabel di dalamnya
const registerController = require('../../controller/user/registerController');
// Definisikan middleware verify.js
const verifyUser = require('../../library/verify');


registerController.checkAndCreateTable();

router.get('/', verifyUser.isLogout, registerController.saveRegister);
router.post('/user', verifyUser.isLogout, registerController.saveRegister);


module.exports = router;

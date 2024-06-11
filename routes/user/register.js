// Definisikan router dari express
const router = require('express').Router();
// Ambil index.js dari controller dan panggil variabel di dalamnya
const registerController = require('../../controller/user/registerController');
// Definisikan middleware verify.js
const verifyUser = require('../../library/verify');

// Panggil fungsi checkAndCreateTable untuk memastikan tabel dibuat
registerController.checkAndCreateTable();

// Rute 'http://localhost:3000/register/' digunakan untuk menampilkan form register
router.get('/', verifyUser.isLogout, registerController.formRegister);
// Rute 'http://localhost:3000/register/save' digunakan untuk menyimpan data yang diinput user saat register
router.post('/save', verifyUser.isLogout, registerController.saveRegister);

// Export agar dapat dibaca oleh express
module.exports = router;

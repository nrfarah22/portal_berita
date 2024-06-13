// Definisikan router dari express
const router = require('express').Router();
// Ambil index.js dari controller dan panggil variabel di dalamnya
const registerAdminController = require('../../controller/admin/registerAdminController');
// Definisikan middleware verify.js
const verifyUser = require('../../library/verify');

// Panggil fungsi checkAndCreateTable untuk memastikan tabel dibuat
registerAdminController.checkAndCreateTable();
// Rute 'http://localhost:3000/register/save' digunakan untuk menyimpan data yang diinput user saat register
router.post('/admin', verifyUser.isLogout, registerAdminController.saveRegister);

// Export agar dapat dibaca oleh express
module.exports = router;

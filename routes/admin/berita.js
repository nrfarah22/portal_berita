const express = require('express');
const router = express.Router();
const beritaController = require('../../controller/admin/beritaController');

// Pastikan tabel dibuat saat aplikasi dimulai
beritaController.checkAndCreateTable();

// Rute untuk berita
router.get('/', beritaController.berita);
router.get('/add', beritaController.addBerita);
router.post('/create', beritaController.createBerita);
// router.get('/edit/:id', beritaController.editBerita);
router.post('/update/:id', beritaController.updateBerita);
router.get('/delete/:id', beritaController.deleteBerita);



module.exports = router;

const express = require('express');
const router = express.Router();
const beritaController = require('../../controller/admin/beritaController');
const kategoriController = require('../../controller/admin/kategoriController');


kategoriController.checkAndCreateTable();
// Pastikan tabel dibuat saat aplikasi dimulai
beritaController.checkAndCreateTable();

// Rute untuk berita

router.get('/', beritaController.readAllBerita);
router.get('/:id', beritaController.readIdBerita);
router.post('/add', beritaController.addBerita);
router.put('/edit/:id', beritaController.editBerita);
router.delete('/delete/:id', beritaController.deleteBerita);



module.exports = router;

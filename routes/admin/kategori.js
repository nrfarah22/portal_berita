const express = require('express');
const router = express.Router();
const kategoriController = require('../controller/kategoriController');

// Pastikan tabel dibuat saat aplikasi dimulai
kategoriController.checkAndCreateTable();

// Rute untuk kategori
router.post('/', kategoriController.createKategori);
router.get('/', kategoriController.readAllKategori);
router.get('/:id', kategoriController.readIdKategori);
router.put('/:id', kategoriController.updateKategori);
router.delete('/:id', kategoriController.deleteKategori);

module.exports = router;

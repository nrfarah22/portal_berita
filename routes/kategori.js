const express = require('express');
const router = express.Router();
const kategoriController = require('../controller/kategoriController');

router.post('/kategori', kategoriController.createKategori);
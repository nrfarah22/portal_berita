const mysql = require('mysql2');

// Konfigurasi koneksi
const config = {
  multipleStatements  : true,
  host                : 'educalab.id',
  user                : '6McCwSlAAInN5L53',
  password            : 'xxY7PtRkDxYoxKry',
  database            : 'jnN4NZCqZJHralBa',
  port                : '3307'
};

// Buat pool koneksi
const pool = mysql.createPool(config);

pool.on('error', (err) => {
  console.error(err);
});

module.exports = pool;

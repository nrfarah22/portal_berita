// Definisikan konfigurasi Database
const config = require('../../library/database');
// Gunakan library mysql
let mysql = require('mysql');
// Buat koneksi
let pool = mysql.createPool(config);

// Kirim error jika koneksi gagal
pool.on('error', (err) => {
    console.error(err);
});

module.exports = {
    // Fungsi untuk membuat tabel jika belum ada
    checkAndCreateTable() {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error("Database connection error:", err);
                return;
            }

            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS tbl_admin (
                    id_admin INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    password VARCHAR(512) NOT NULL
                )
            `;

            connection.query(createTableQuery, (error, results) => {
                connection.release();

                if (error) {
                    console.error("Error creating table:", error);
                    return;
                }

                console.log("Table tbl_admin checked/created successfully");
            });
        });
    },

    // Fungsi untuk merender file register yang ada pada folder 'src/views/register.ejs'
    formRegister(req, res) {
        res.render("admin/registerAdmin", {
            // Definisikan semua variabel yang ingin ikut dirender ke dalam register.ejs
            url: 'http://localhost:3000/',
        });
    },
    // Fungsi untuk menyimpan data
    saveRegister(req, res) {
        // Tampung inputan user ke dalam variabel username, email dan password
        let username = req.body.username;
        let email = req.body.email;
        let password = req.body.pass;
        // Pastikan semua variabel terisi
        if (username && email && password) {
            // Panggil koneksi dan eksekusi query
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query(
                    `INSERT INTO tbl_admin (username, email, password) VALUES (?, ?, SHA2(?, 512));`
                , [username, email, password], function (error, results) {
                    if (error) throw error;
                    // Jika tidak ada error, set library flash untuk menampilkan pesan sukses
                    req.flash('color', 'success');
                    req.flash('status', 'Yes..');
                    req.flash('message', 'Registrasi berhasil');
                    // Kembali ke halaman login
                    res.redirect('/loginAdmin');
                });
                // Koneksi selesai
                connection.release();
            });
        } else {
            // Kondisi apabila variabel username, email dan password tidak terisi
            res.redirect('/loginAdmin');
            res.end();
        }
    }
};

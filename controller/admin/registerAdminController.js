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
    saveRegister(req, res) {
        // Tampung inputan user ke dalam variabel username, email dan password
        let username = req.body.username;
        let email = req.body.email;
        let password = req.body.password;
        
        // Pastikan semua variabel terisi
        if (username && email && password) {
            // Panggil koneksi dan eksekusi query
            pool.getConnection(function(err, connection) {
                if (err) {
                    res.status(500).send({ message: "Database connection error" });
                    return;
                }
                connection.query(
                    `INSERT INTO tbl_admin (username, email, password) VALUES (?, ?, SHA2(?, 512));`,
                    [username, email, password], 
                    function (error, results) {
                        if (error) {
                            res.status(500).send({ message: "Error inserting user data" });
                            return;
                        }
                        // Jika tidak ada error, kirimkan response JSON
                        res.status(201).send({
                            message: 'Registrasi berhasil',
                            data: {
                                id_admin: results.insertId,
                                username: username,
                                email: email
                            }
                        });
                    }
                );
                // Koneksi selesai
                connection.release();
            });
        } else {
            // Kondisi apabila variabel username, email dan password tidak terisi
            res.status(400).send({ message: "Username, email, and password must be provided" });
        }
    },
    // Fungsi untuk menyimpan data
    // saveRegister(req, res) {
    //     // Tampung inputan user ke dalam variabel username, email dan password
    //     let username = req.body.username;
    //     let email = req.body.email;
    //     let password = req.body.pass;
    //     // Pastikan semua variabel terisi
    //     if (username && email && password) {
    //         // Panggil koneksi dan eksekusi query
    //         pool.getConnection(function(err, connection) {
    //             if (err) throw err;
    //             connection.query(
    //                 `INSERT INTO tbl_admin (username, email, password) VALUES (?, ?, SHA2(?, 512));`
    //             , [username, email, password], function (error, results) {
    //                 if (error) throw error;
    //                 // Jika tidak ada error, set library flash untuk menampilkan pesan sukses
    //                 req.flash('color', 'success');
    //                 req.flash('status', 'Yes..');
    //                 req.flash('message', 'Registrasi berhasil');
    //                 // Kembali ke halaman login
    //                 res.redirect('/loginAdmin');
    //             });
    //             // Koneksi selesai
    //             connection.release();
    //         });
    //     } else {
    //         // Kondisi apabila variabel username, email dan password tidak terisi
    //         res.redirect('/loginAdmin');
    //         res.end();
    //     }
    // }
};

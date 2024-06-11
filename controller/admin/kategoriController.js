const mysql = require('mysql');
const config = require('../../library/database');

let pool = mysql.createPool(config);

pool.on('error', (err) => {
    console.error(err);
});

module.exports = {
    checkAndCreateTable() {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error("Database connection error:", err);
                return;
            }

            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS tbl_kategori (
                    id_kategori INT AUTO_INCREMENT PRIMARY KEY,
                    nama_kategori VARCHAR(255) NOT NULL,
                    deskripsi TEXT
                )
            `;

            connection.query(createTableQuery, (error, results) => {
                if (error) {
                    console.error("Error creating table:", error);
                    connection.release();
                    return;
                }

                console.log("Table tbl_kategori checked/created successfully");

                const insertDefaultCategoriesQuery = `
                    INSERT INTO tbl_kategori (nama_kategori, deskripsi)
                    VALUES 
                        ('Bisnis', 'Berita dan informasi terkait bisnis'),
                        ('Olahraga', 'Berita dan informasi terkait olahraga'),
                        ('Teknologi', 'Berita dan informasi terkait teknologi'),
                        ('Politik', 'Berita dan informasi terkait politik')
                    ON DUPLICATE KEY UPDATE
                        nama_kategori = VALUES(nama_kategori), 
                        deskripsi = VALUES(deskripsi)
                `;

                connection.query(insertDefaultCategoriesQuery, (error, results) => {
                    connection.release();
                    if (error) {
                        console.error("Error inserting default categories:", error);
                        return;
                    }

                    console.log("Default categories inserted successfully");
                });
            });
        });
    },

    createKategori(req, res) {
        if (!req.body.nama_kategori) {
            res.status(400).send("Nama kategori harus diisi");
            return;
        }

        const { nama_kategori, deskripsi } = req.body;

        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).send("Database connection error");
                return;
            }

            connection.query(
                `INSERT INTO tbl_kategori (nama_kategori, deskripsi) VALUES (?, ?)`,
                [nama_kategori, deskripsi],
                (error, results) => {
                    connection.release();

                    if (error) {
                        res.status(500).send("Error inserting data");
                        return;
                    }

                    res.status(201).send({ message: "Kategori created", data: { id_kategori: results.insertId, nama_kategori, deskripsi } });
                }
            );
        });
    },

    updateKategori(req, res) {
        const id = req.params.id;
        const { nama_kategori, deskripsi } = req.body;

        if (!nama_kategori) {
            res.status(400).send("Nama kategori harus diisi");
            return;
        }

        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).send("Database connection error");
                return;
            }

            connection.query(
                `UPDATE tbl_kategori SET nama_kategori = ?, deskripsi = ? WHERE id_kategori = ?`,
                [nama_kategori, deskripsi, id],
                (error, results) => {
                    connection.release();

                    if (error) {
                        res.status(500).send("Error updating data");
                        return;
                    }

                    if (results.affectedRows === 0) {
                        res.status(404).send("Kategori not found");
                        return;
                    }

                    res.status(200).send({ message: "Kategori updated", data: { id_kategori: id, nama_kategori, deskripsi } });
                }
            );
        });
    },

    deleteKategori(req, res) {
        const id = req.params.id;

        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).send("Database connection error");
                return;
            }

            connection.query('DELETE FROM tbl_kategori WHERE id_kategori = ?', [id], (error, results) => {
                connection.release();

                if (error) {
                    res.status(500).send("Error deleting data");
                    return;
                }

                if (results.affectedRows === 0) {
                    res.status(404).send("Kategori not found");
                    return;
                }

                res.status(200).send({ message: "Kategori deleted", data: { id_kategori: id } });
            });
        });
    },

    readAllKategori(req, res) {
        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).send("Database connection error");
                return;
            }

            connection.query('SELECT * FROM tbl_kategori', (error, results) => {
                connection.release();

                if (error) {
                    res.status(500).send("Error retrieving data");
                    return;
                }

                res.status(200).json({ data: results });
            });
        });
    },

    readIdKategori(req, res) {
        const id = req.params.id;

        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).send("Database connection error");
                return;
            }

            connection.query('SELECT * FROM tbl_kategori WHERE id_kategori = ?', [id], (error, results) => {
                connection.release();

                if (error) {
                    res.status(500).send("Error retrieving data");
                    return;
                }

                if (results.length === 0) {
                    res.status(404).send("Kategori not found");
                    return;
                }

                res.status(200).json({ data: results[0] });
            });
        });
    },
};

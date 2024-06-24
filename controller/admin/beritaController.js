const pool = require('../../library/database');

module.exports = {
    checkAndCreateTable() {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error("Database connection error:", err);
                return;
            }
    
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS tbl_berita (
                    id_berita INT AUTO_INCREMENT PRIMARY KEY,
                    judul_berita VARCHAR(255) NOT NULL,
                    author VARCHAR(255) NOT NULL,
                    isi_berita TEXT NOT NULL,
                    tanggal_dibuat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    tanggal_diupdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    id_kategori INT,
                    FOREIGN KEY (id_kategori) REFERENCES tbl_kategori(id_kategori)
                )
            `;
    
            connection.query(createTableQuery, (error, results) => {
                connection.release();
    
                if (error) {
                    console.error("Error creating table:", error);
                    return;
                }
    
                console.log("Table tbl_berita checked/created successfully");
            });
        });
    },

    addBerita(req, res) {
        pool.getConnection((err, connection) => {
            pool.getConnection((err, connection) => {
                if (err) {
                    res.status(500).send("Database connection error");
                    return;
                }
        
                const { judul_berita, author, isi_berita, id_kategori } = req.body;
        
                if (!judul_berita || !author || !isi_berita || !id_kategori) {
                    res.status(400).send("Judul berita, author, isi berita, dan id kategori harus diisi");
                    return;
                }
        
                connection.query(
                    'INSERT INTO tbl_berita (judul_berita, author, isi_berita, id_kategori) VALUES (?, ?, ?, ?)',
                    [judul_berita, author, isi_berita, id_kategori],
                    (error, results) => {
                        connection.release();
        
                        if (error) {
                            res.status(500).send("Error inserting data");
                            return;
                        }
                        res.status(201).send({ message: "Berita created", data: { id_berita: results.insertId, judul_berita, author, isi_berita, id_kategori } });
                    }
                );
            });
        })
    },

    editBerita(req, res) {
        const id = req.params.id;
        const { judul_berita, author, isi_berita, id_kategori } = req.body;
    
        if (!judul_berita || !author || !isi_berita || !id_kategori) {
            res.status(400).send("Judul berita, author, isi berita, dan id kategori harus diisi");
            return;
        }
    
        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).send("Database connection error");
                return;
            }
    
            connection.query(
                'UPDATE tbl_berita SET judul_berita = ?, author = ?, isi_berita = ?, tanggal_diupdate = CURRENT_TIMESTAMP, id_kategori = ? WHERE id_berita = ?',
                [judul_berita, author, isi_berita, id_kategori, id],
                (error, results) => {
                    connection.release();
    
                    if (error) {
                        res.status(500).send("Error updating data");
                        return;
                    }
    
                    if (results.affectedRows === 0) {
                        res.status(404).send("Berita not found");
                        return;
                    }
                    res.status(200).send({ message: "Berita updated", data: { id_berita: id, judul_berita, author, isi_berita, id_kategori } });
                }
            );
        });
    },
    
    deleteBerita(req, res) {
        const id = req.params.id;
    
        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).send("Database connection error");
                return;
            }
    
            connection.query('DELETE FROM tbl_berita WHERE id_berita = ?', [id], (error, results) => {
                connection.release();
    
                if (error) {
                    res.status(500).send("Error deleting data");
                    return;
                }
    
                if (results.affectedRows === 0) {
                    res.status(404).send("Berita not found");
                    return;
                }
                res.status(200).send({ message: "Berita deleted", data: { id_berita: id } });
            });
        });
    },

    readAllBerita(req, res) {
        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).send("Database connection error");
                return;
            }
    
            connection.query("SELECT `tbl_berita`.`id_berita`, `tbl_berita`.`judul_berita`, `tbl_berita`.`author`, `tbl_kategori`.`nama_kategori`, `tbl_kategori`.`deskripsi` FROM `tbl_berita` LEFT JOIN `tbl_kategori` ON `tbl_berita`.`id_kategori` = `tbl_kategori`.`id_kategori`;", (error, results) => {
                connection.release();
    
                if (error) {
                    res.status(500).send("Error retrieving data");
                    return;
                }
                res.status(200).json({ data: results });
            });
        });
    },

    readIdBerita(req, res) {
        const id = req.params.id;
    
        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).send("Database connection error");
                return;
            }
    
            connection.query('SELECT * FROM tbl_berita join tbl_kategori on `tbl_berita`.`id_kategori` = `tbl_kategori`.`id_kategori` where id_berita = ?', [id], (error, results) => {
                connection.release();
    
                if (error) {
                    res.status(500).send("Error retrieving data");
                    return;
                }
    
                if (results.length === 0) {
                    res.status(404).send("Berita not found");
                    return;
                }
                res.status(200).json({ data: results[0] });
            });
        });
    },




    
};

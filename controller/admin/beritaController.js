const config = require('../../library/database');

let mysql      = require('mysql');
let pool       = mysql.createPool(config);

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
            if (err) {
                res.status(500).send("Database connection error");
                return;
            }
    
            const { judul_berita, author, isi_berita, id_kategori } = req.body;
    
            // Pastikan semua field terisi
            if (!judul_berita || !author || !isi_berita || !id_kategori) {
                res.redirect(400, '/add');
                // res.status(400).send("Judul berita, author, isi berita, dan id kategori harus diisi");
                return;
            }
    
            connection.query(
                `INSERT INTO tbl_berita (judul_berita, author, isi_berita, id_kategori) VALUES (?, ?, ?, ?)`,
                [judul_berita, author, isi_berita, id_kategori],
                (error, results) => {
                    connection.release();
    
                    if (error) {
                        res.status(500).send("Error inserting data");
                        return;
                    }
                    res.redirect(201, '/dashboard');
                    //res.status(201).send({ message: "Berita created", data: { id_berita: results.insertId, judul_berita, author, isi_berita, id_kategori } });
                }
            );
        });
    },

    editBerita(req, res) {
        const id = req.params.id;
        const { judul_berita, author, isi_berita, id_kategori } = req.body;
    
        if (!judul_berita || !author ||!isi_berita || !id_kategori) {
            // res.status(400);
            res.redirect(400, '/');
            // res.status(400).send("Judul berita, isi berita, dan id kategori harus diisi");
            return;
        }
    
        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).send("Database connection error");
                return;
            }
    
            connection.query(
                `UPDATE tbl_berita SET judul_berita = ?, author = ?, isi_berita = ?, tanggal_diupdate = CURRENT_TIMESTAMP, id_kategori = ? WHERE id_berita = ?`,
                [judul_berita, author, isi_berita, id_kategori, id],
                (error, results) => {
                    connection.release();
    
                    if (error) {
                        res.status(500).send("Error updating data");
                        return;
                    }
    
                    if (results.affectedRows === 0) {
                        res.redirect(404, '/');
                        // res.status(404).send("Berita not found");
                        return;
                    }
                    res.redirect(200, '/dashboard');
                    //res.status(200).send({ message: "Berita updated", data: { id_berita: id, judul_berita, author, isi_berita, id_kategori } });
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
                res.redirect(200, '/dashboard');
                //res.status(200).send({ message: "Berita deleted", data: { id_berita: id } });
            });
        });
    },

    readAllBerita(req, res) {
        res.render("admin/dashboard", {
            url: 'https://api-msib-6-portal-berita-02.educalab.id/3307',
        });
        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).send("Database connection error");
                return;
            }
    
            connection.query('SELECT * FROM tbl_berita', (error, results) => {
                connection.release();
    
                if (error) {
                    res.status(500).send("Error retrieving data");
                    return;
                }
                res.status(200);
                //res.status(200).json({ data: results });
                
            });
        });
    },

    

    readIdBerita(req, res) {
        res.render("admin/edit", {
            url: 'https://api-msib-6-portal-berita-02.educalab.id/3307',
        });
        const id = req.params.id;
    
        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).send("Database connection error");
                return;
            }
    
            connection.query('SELECT * FROM tbl_berita WHERE id_berita = ?', [id], (error, results) => {
                connection.release();
    
                if (error) {
                    res.status(500).send("Error retrieving data");
                    return;
                }
    
                if (results.length === 0) {
                    res.redirect(404, '/')
                    //res.status(404).send("Berita not found");
                    return;
                }
                res.status(200);
                // res.redirect(200, '/');
                // res.status(200).json({ data: results[0] });
            });
        });
    },



/*

    berita(req, res) {
        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).send("Database connection error");
                return;
            }

            const query = 
                `SELECT b.*, k.nama_kategori, a.username
                FROM tbl_berita b
                LEFT JOIN tbl_kategori k ON b.id_kategori = k.id_kategori
                LEFT JOIN tbl_admin a ON b.id_admin = a.id_admin`
            ;

            connection.query(query, (error, results) => {
                connection.release();

                if (error) {
                    res.status(500).send("Error retrieving data");
                    return;
                }

                res.render("admin/dashboard", {
                    data: results,
                    url: 'http://localhost:3000/',
                    colorFlash: req.flash('color'),
                    statusFlash: req.flash('status'),
                    pesanFlash: req.flash('message'),
                });
            });
        });
    },
    addBerita(req, res) {
        res.render("admin/add", {
            url: 'http://localhost:3000/',
        })
    },

    readAllBerita(req, res) {
        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).send("Database connection error");
                return;
            }
    
            const query = `
            SELECT b.*, k.nama_kategori, a.username
                FROM tbl_berita b
                LEFT JOIN tbl_kategori k ON b.id_kategori = k.id_kategori
                LEFT JOIN tbl_admin a ON b.id_admin = a.id_admin
            `;
    
            connection.query(query, (error, results) => {
                connection.release();
    
                if (error) {
                    res.status(500).send("Error retrieving data");
                    return;
                }
                
                if (results.length === 0) {
                    console.log("data masih kosong");
                } else {
                    console.log(results);
                }
                res.json(results);
    
                res.render('admin/dashboard', { data: results });
            });
        });
    },
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
                    isi_berita TEXT NOT NULL,
                    tanggal_dibuat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    tanggal_diupdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                    id_kategori INT,
                    id_admin INT,
                    FOREIGN KEY (id_kategori) REFERENCES tbl_kategori(id_kategori),
                    FOREIGN KEY (id_admin) REFERENCES tbl_admin(id_admin)
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

    createBerita(req, res) {
        const { judul_berita, isi_berita, id_kategori, id_admin } = req.body;
        
        // Pastikan semua field terisi
        if (!judul_berita || !isi_berita || !id_kategori || !id_admin) {
            res.status(400).send("Judul berita, isi berita, id kategori, dan nama author harus diisi");
            return;
        }

        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).send("Database connection error");
                return;
            }
    
            connection.query(
                `INSERT INTO tbl_berita (judul_berita, isi_berita, id_kategori, id_admin) VALUES (?, ?, ?, ?)`,
                [judul_berita, isi_berita, id_kategori, id_admin],
                (error, results) => {
                    connection.release();
    
                    if (error) {
                        res.status(500).send("Error inserting data");
                        return;
                    }
    
                    res.redirect('/');
                }
            );
        });
    },

    updateBerita(req, res) {
        const id_berita = req.params.id_berita;
        const { judul_berita, isi_berita, id_kategori } = req.body;
    
        if (!judul_berita || !isi_berita || !id_kategori) {
            res.status(400).send("Judul berita, isi berita, id kategori harus diisi");
            return;
        }
    
        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).send("Database connection error");
                return;
            }
    
            connection.query(
                `UPDATE tbl_berita SET judul_berita = ?, isi_berita = ?, tanggal_diupdate = CURRENT_TIMESTAMP, id_kategori = ? WHERE id_berita = ?`,
                [judul_berita, isi_berita, id_kategori],
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
    
                    res.redirect('/');
                }
            );
        });
    },

    deleteBerita(req, res) {
        const id_berita = req.params.id_berita;
    
        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).send("Database connection error");
                return;
            }
    
            connection.query('DELETE FROM tbl_berita WHERE id_berita = ?', [id_berita], (error, results) => {
                connection.release();
    
                if (error) {
                    res.status(500).send("Error deleting data");
                    return;
                }
    
                if (results.affectedRows === 0) {
                    res.status(404).send("Berita not found");
                    return;
                }
    
                res.redirect('/');
            });
        });
    },

    
    
    

    readIdBerita(req, res) {
        const id_berita = req.params.id_berita;
    
        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).send("Database connection error");
                return;
            }
    
            connection.query('SELECT * FROM tbl_berita WHERE id_berita = ?', [id_berita], (error, results) => {
                connection.release();
    
                if (error) {
                    res.status(500).send("Error retrieving data");
                    return;
                }
    
                if (results.length === 0) {
                    res.status(404).send("Berita not found");
                    return;
                }
    
                res.render('admin/edit', { data: results[0] });
            });
        });
    },
*/
    
};

const mysql = require('mysql2');
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

};

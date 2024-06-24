const pool = require('../../library/database');


module.exports = {
    checkAndCreateTable() {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error("Database connection error:", err);
                return;
            }
    
            const checkTableExistsQuery = `
                SELECT COUNT(*)
                FROM information_schema.tables 
                WHERE table_schema = '${connection.config.database}' 
                  AND table_name = 'tbl_kategori'
            `;
    
            connection.query(checkTableExistsQuery, (error, results) => {
                if (error) {
                    console.error("Error checking table existence:", error);
                    connection.release();
                    return;
                }
    
                const tableExists = results[0]['COUNT(*)'] > 0;
    
                if (!tableExists) {
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
    
                        console.log("Table tbl_kategori created successfully");
    
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
                            if (error) {
                                console.error("Error inserting default categories:", error);
                                connection.release();
                                return;
                            }
    
                            console.log("Default categories inserted successfully");
                            connection.release();
                        });
                    });
                } else {
                    console.log("Table tbl_kategori already exists, skipping default category insertion");
                    connection.release();
                }
            });
        });
    },
    
    

};

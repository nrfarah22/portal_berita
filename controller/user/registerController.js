const pool = require('../../library/database');

module.exports = {
    checkAndCreateTable() {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error("Database connection error:", err);
                return;
            }

            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS tbl_user (
                    id_user INT AUTO_INCREMENT PRIMARY KEY,
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

                console.log("Table tbl_user checked/created successfully");
            });
        });
    },

    
    saveRegister(req, res) {
        let username = req.body.username;
        let email = req.body.email;
        let password = req.body.password;
        
        if (username && email && password) {
            pool.getConnection(function(err, connection) {
                if (err) {
                    res.status(500).send({ message: "Database connection error" });
                    return;
                }
                connection.query(
                    `INSERT INTO tbl_user (username, email, password) VALUES (?, ?, SHA2(?, 512));`,
                    [username, email, password], 
                    function (error, results) {
                        connection.release();
                        
                        if (error) {
                            res.status(500).send({ message: "Error inserting user data" });
                            return;
                        }
                        res.status(201).send({
                            message: 'Registrasi berhasil',
                            data: {
                                id_user: results.insertId,
                                username: username,
                                email: email
                            }
                        });
                    }
                );
            });
        } else {
            res.status(400).send({ message: "Username, email, and password must be provided" });
        }
    }
    
};
    
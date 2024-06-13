const config = require('../../library/database');
let mysql = require('mysql');
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
        if (req.method === 'GET') {
            res.render("user/register", {
                url: 'http://localhost:3000/',
            });
        } else if (req.method === 'POST') {
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
                            if (error) {
                                res.status(500).send({ message: "Error inserting user data" });
                                return;
                            }
                            res.redirect(301, '/login');
                            // res.status(201).send({
                            //     message: 'Registrasi berhasil',
                            //     data: {
                            //         id_user: results.insertId,
                            //         username: username,
                            //         email: email
                            //     }
                            // });
                        }
                    );
                    connection.release();
                });
            } else {
                res.redirect(400, '/register');
                res.end();
                //res.status(400).send({ message: "Username, email, and password must be provided" });
            }
        }
    }
};

const config = require('../../library/database');

let mysql      = require('mysql');
let pool       = mysql.createPool(config);

pool.on('error',(err)=> {
    console.error(err);
});

module.exports ={
    loginAdmin(req, res) {
        if (req.method === 'GET') {
            res.render("admin/loginadmin", {
                url: 'https://api-msib-6-portal-berita-02.educalab.id/3307',
            });
        } else if (req.method === 'POST') {
            let email = req.body.email;
            let password = req.body.password;
            if (email && password) {
                pool.getConnection(function(err, connection) {
                    if (err) {
                        res.status(500).send({ message: "Database connection error" });
                        return;
                    }
                    connection.query(
                        `SELECT * FROM tbl_admin WHERE email = ? AND password = SHA2(?,512)`,
                        [email, password], 
                        function(error, results) {
                            if (error) {
                                res.status(500).send({ message: "Error querying database" });
                                return;
                            }
                            if (results.length > 0) {
                                req.session.loggedin = true;
                                req.session.adminid = results[0].id_admin;
                                req.session.username = results[0].username;
                                res.redirect(301, '/dashboard');
                                // res.status(200).send({ 
                                //     message: "Login successful", 
                                //     data: {
                                //         adminid: req.session.adminid,
                                //         username: req.session.username
                                //     }
                                // });
                            } else {
                                res.redirect(401, '/loginAdmin');
                                //res.status(401).send({ message: "Akun tidak ditemukan" });
                            }
                        }
                    );
                    connection.release();
                });
            } else {
                res.redirect(400, '/loginAdmin');
                //res.status(400).send({ message: "Email dan password harus diisi" });
            }
        } else {
            res.redirect('/loginAdmin');
        }
    },
    logout(req,res){
        req.session.destroy((err) => {
            if(err) {
                return console.log(err);
            }
            res.redirect('/loginAdmin');
            res.clearCookie('secretname');
        });
    },
}
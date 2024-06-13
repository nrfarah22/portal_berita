const config = require('../../library/database');

let mysql      = require('mysql');
let pool       = mysql.createPool(config);

pool.on('error',(err)=> {
    console.error(err);
});

module.exports ={
    loginAuth(req, res) {
        let email = req.body.email;
        let password = req.body.password;
        if (email && password) {
            pool.getConnection(function(err, connection) {
                if (err) {
                    res.status(500).send({ message: "Database connection error" });
                    return;
                }
                connection.query(
                    `SELECT * FROM tbl_user WHERE email = ? AND password = SHA2(?,512)`,
                    [email, password], 
                    function(error, results) {
                        if (error) {
                            res.status(500).send({ message: "Error querying database" });
                            return;
                        }
                        if (results.length > 0) {
                            // Jika data ditemukan, set sesi user tersebut menjadi true
                            req.session.loggedin = true;
                            req.session.userid = results[0].id_user;
                            req.session.username = results[0].username;
                            res.status(200).send({ 
                                message: "Login successful", 
                                data: {
                                    userid: req.session.userid,
                                    username: req.session.username
                                }
                            });
                        } else {
                            res.status(401).send({ message: "Akun tidak ditemukan" });
                        }
                    }
                );
                connection.release();
            });
        } else {
            res.status(400).send({ message: "Email dan password harus diisi" });
        }
    },
    
    
    logout(req,res){
        req.session.destroy((err) => {
            if(err) {
                return console.log(err);
            }
            // Hapus cokie yang masih tertinggal
            res.clearCookie('secretname');
        });
    },
}
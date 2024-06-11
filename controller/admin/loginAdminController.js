const config = require('../../library/database');

let mysql      = require('mysql');
let pool       = mysql.createPool(config);

pool.on('error',(err)=> {
    console.error(err);
});

module.exports ={
    // Render tampilan untuk login yang ada di dalam folder 'views/login.ejs'
    login(req,res){
        res.render("admin/loginAdmin",{
            url : 'http://localhost:3000/',
            colorFlash: req.flash('color'),
            statusFlash: req.flash('status'),
            pesanFlash: req.flash('message'),
        });
    },
    // login untuk user
    loginAdmin(req,res){
        let email = req.body.email;
        let password = req.body.pass;
        if (email && password) {
            pool.getConnection(function(err, connection) {
                if (err) throw err;
                connection.query(
                    `SELECT * FROM tbl_admin WHERE email = ? AND password = SHA2(?,512)`
                , [email, password],function (error, results) {
                    if (error) throw error;  
                    if (results.length > 0) {
                        // Jika data ditemukan, set sesi user tersebut menjadi true
                        req.session.loggedin = true;
                        req.session.adminid = results[0].id_admin;
                        req.session.adminusername = results[0].username_admin;
                        res.redirect('/dashboard');
                    } else {
                        // Jika data tidak ditemukan, set library flash dengan pesan error yang diinginkan
                        req.flash('color', 'danger');
                        req.flash('status', 'Oops..');
                        req.flash('message', 'Akun tidak ditemukan');
                        res.redirect('/loginAdmin');
                    }
                });
                connection.release();
            })
        } else {
            res.redirect('/loginAdmin');
            res.end();
        }
    },
    
    // Fungsi untuk logout | Cara memanggilnya menggunakan url/rute 'http://localhost:5050/login/logout'
    logout(req,res){
        // Hapus sesi user dari broser
        req.session.destroy((err) => {
            if(err) {
                return console.log(err);
            }
            // Hapus cokie yang masih tertinggal
            res.clearCookie('secretname');
            res.redirect('/loginAdmin');
        });
    },
}
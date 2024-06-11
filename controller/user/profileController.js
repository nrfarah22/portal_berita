const config = require('../../library/database');

let mysql      = require('mysql');
let pool       = mysql.createPool(config);

pool.on('error',(err)=> {
    console.error(err);
});

module.exports ={
    profile(req,res){
        let id = req.session.userid;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `
                SELECT * FROM tbl_user where id_user = ${id};
                `
            , function (error, results) {
                if(error) throw error;
                res.render("user/profile",{
                    url: 'http://localhost:3000/',
                    userName: req.session.username,
                    nama: results[0]['username'],
                    email: results[0]['email']
                });
            });
            connection.release();
        })
    }
}
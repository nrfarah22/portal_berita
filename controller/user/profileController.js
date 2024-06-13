const config = require('../../library/database');

let mysql      = require('mysql');
let pool       = mysql.createPool(config);

pool.on('error',(err)=> {
    console.error(err);
});

module.exports ={
    profile(req, res) {
        const id = req.session.userid;
    
        pool.getConnection((err, connection) => {
            if (err) {
                res.status(500).json({ error: "Database connection error" });
                return;
            }
    
            connection.query('SELECT * FROM tbl_user WHERE id_user = ?', [id], (error, results) => {
                connection.release();
    
                if (error) {
                    res.status(500).json({ error: "Error retrieving data" });
                    return;
                }
    
                if (results.length === 0) {
                    res.status(404).json({ error: "User not found" });
                    return;
                }
    
                res.render("user/profile",{
                    url: 'http://localhost:3000/',
                    userName: req.session.username,
                    nama: results[0]['username'],
                    email: results[0]['email']
                });
            });
        });
    }
    
    
}
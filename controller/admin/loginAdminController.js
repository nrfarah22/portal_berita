const config = require('../../library/database');

let mysql      = require('mysql');
let pool       = mysql.createPool(config);

pool.on('error',(err)=> {
    console.error(err);
});

module.exports ={
    loginAdmin(req, res) {
        const { email, password } = req.body;
    
        // Periksa apakah email dan password cocok
        if (email === 'nur123@gmail.com' && password === 'nur123') {
            return res.status(200).json({ message: 'success' });
        } else {
            return res.status(401).json({ message: 'Invalid credentials' });
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
const login = require('./user/loginController');
const register = require('./user/registerController');
const loginAdmin = require('./admin/loginAdminController');
const registerAdmin = require('./admin/registerAdminController');
const profile = require('./user/profileController');
const berita = require('./admin/beritaController');


module.exports ={
	login,
	register,
	loginAdmin,
	registerAdmin,
	profile,
	berita,
};
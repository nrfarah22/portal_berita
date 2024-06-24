module.exports ={
    home(req,res){
        res.render("Home",{
            url: 'http://localhost:3000/',
        });
    }
}
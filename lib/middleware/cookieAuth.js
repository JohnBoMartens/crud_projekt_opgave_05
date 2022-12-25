const jwt = require('jsonwebtoken');
const configuration = require('../config/configuration');

const cookieAuth = {};

cookieAuth.check = (req, res, next) => {


  const token = req.cookies.token;

    if(!token) {

        res.redirect('/login');

    } else {

        try {
            
            jwt.verify(token, configuration.secretKey);
            return next();

        } catch (error) {
            res.redirect('/login');

        }
    
       

    }

    

}


module.exports = cookieAuth.check;
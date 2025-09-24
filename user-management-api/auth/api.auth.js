//api security

//JWT token
const jwt = require('jsonwebtoken');
const { createSearchIndex } = require('../model/user.model');

const secretKey = process.env.JWT_SECRET;

//create
const createToken = (user)=>{
    try{
        //jwt.sign(
        // payload (data we want to store in the token, usually user id and email)
        //secret key (to sign the token, should be kept secret and secure)
        //options (expiry time, issuer, audience)
        // )-> method to create a token
        const token  = jwt.sign(
            //payload
            {
                id:user._id,
                email:user.email,
                role:user.role //role based access control
            },
            secretKey,
            {
                expiresIn:'1h', //token expiry time
                issuer:'user-management-api' //who issued the token
            }

        )

        return token;

    }
    catch(err){
        throw new Error(err);
    }
}

//verify
//json(REQ) -> header -> authorization -> Bearer token -> extract the token -> verify
const verifyToken = (req, res, next)=>{
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(401).json({message: "No token provided"});
        }

        const token = authHeader.split(' ')[1]; //Bearer token
        // const token = authHeader.slice(7, authHeader.length).trim();
        if(!token){
            return res.status(401).json({message: "No token provided"});
        }

        //jwt.verify -> this verified the token
        const decoded = jwt.verify(token, secretKey);

        req.user= decoded; //id, email, role
        next(); //proceed to the next middleware or route handler
    }
    catch(err){
        return res.status(401).json({message: "Unauthorized access", error: err.message});
    }
}


module.exports = {
    createToken,
    verifyToken
}
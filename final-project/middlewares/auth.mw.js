const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next)=>{
    const token = req.headers.authorization;

    token = token.split(" ")[1]; // Bearer tokenstring

    if(!token){
        return res.status(401).json({message: "Unauthorized"});
    }

    const decoded = jwt.verify(token, SECRET_KEY);

    req.user = decoded;

    next();
}



const SECRET_KEY = "mysecretismostsecuresecretever";

 const createToken = (payload) => {

  return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" }); 

};


//5 minutes!!!

module.exports = {
    createToken,
    verifyToken
}
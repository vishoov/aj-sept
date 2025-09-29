const User = require("../models/user.model");
const xss = require("xss");


const signUp = async (req, res)=>{
    try{
        const userinfo = req.body;

        //sanitize the input to prevent XSS attacks
        userinfo.name = xss(userinfo.name);
        userinfo.email = xss(userinfo.email);
        userinfo.password = xss(userinfo.password);
        userinfo.role = xss(userinfo.role);
        userinfo.age = xss(userinfo.age);
        if(userinfo.address){
            userinfo.address.city = xss(userinfo.address.city);
            userinfo.address.state = xss(userinfo.address.state);
            userinfo.address.country = xss(userinfo.address.country);
        }

        // const user = await User.create(userinfo);
        //success response 
        //error -> error response 
        const user = new User(userinfo); //object oriented programming similar
        await user.save(); //save to the database


        if(!user){
            return res.status(400).json({
                response:"User not created",
            })
        }


        return res.status(201).json({
            user
        })
    }
    catch(err){
        return res.status(500).json({message: err.message, status:"Failed"})
    }
}

module.exports = {
    signUp
}
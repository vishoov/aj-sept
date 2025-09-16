const express = require('express');
const router = express.Router();

const User = require('../model/user.model');


//create User

router.post('/signup', async (req, res)=>{
    try{
        const userinfo = req.body;

        const user = await User.create(userinfo);

        return res.status(201).json({
            user
        })
    }
    catch(err){
        return res.status(500).json({message: err.message, status:"Failed"})
    }
})


router.get("/users", async (req, res)=>{
    try{
        const users = await User.find();
        return res.status(200).json({users, message:"Users retrieved successfully", status:"Success"})
        
    }catch(err){
        return res.status(500).json({message: err.message, status:"Failed"})
    }
})

module.exports = router;
const express = require('express');
const router = express.Router();

const User = require('../model/user.model');


//create User
//Create Operation -> whatever info we send, a document should be CREATED in the databse

router.post('/signup', async (req, res)=>{
    try{
        const userinfo = req.body;

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
})

//Read -> find() -> query that fetches some data from the database
router.get("/users", async (req, res)=>{
    try{

        const users = await User.find();
        return res.status(200).json({users, message:"Users retrieved successfully", status:"Success"})
        
    }catch(err){
        return res.status(500).json({message: err.message, status:"Failed"})
    }
})

router.post("/multiple-users", async (req, res)=>{
    try{
        const users = req.body; //array of user objects

        const result = await User.insertMany(users);
        //insertMany -> mongoose method to insert multiple documents in a collection

        return res.status(201).json({result, message:"Users created successfully", status:"Success"})
    }
    catch(err){
        return res.status(500).json({message: err.message, status:"Failed"})
    }
})

router.get("/userbyname", async (req, res)=>{
    try{
        const name = req.query.name; //name is the key in the query parameter

        const users = await User.find(
            {
                name:name
            }
        )

        return res.status(200)
        .json({
            users
        })
    }
    catch(err){
        return res.status(500).json({message: err.message, status:"Failed"})
    }
})

router.get("/AND", async (req, res)=>{
    try{
        const role = req.query.role;
        const name = req.query.name;

        const users = await User.find(
            {
                $and:[
                    {
                        role:role
                    },
                    {
                        username:name
                    }
                ]
            }
        )
        return res.status(200).json({users, message:"Users retrieved successfully", status:"Success"})
    }
    catch(err){
        return res.status(500).json({message: err.message, status:"Failed"})
    }
})



router.get("/OR", async (req, res)=>{
    try{
        const role = req.query.role;
        const name = req.query.name;

        const users = await User.find(
            {
                $or:[
                    {
                        role:role
                    },
                    {
                        username:name
                    }
                ]
            }
        )
        return res.status(200).json({users, message:"Users retrieved successfully", status:"Success"})
    }
    catch(err){
        return res.status(500).json({message: err.message, status:"Failed"})
    }
})


router.get("/ageFilter", async (req, res)=>{
    try{
        const minAge = parseInt(req.query.minAge);
        const maxAge = Number(req.query.maxAge);


        const users = await User.find(
            {
                age:{
                    $gte:minAge
                }
            }
        )

        return res.status(200).json({
            users
        })
    }
    catch(err){
        return res.status(500).json({message: err.message, status:"Failed"})
    }
})

router.get("/ageFilter2", async (req, res)=>{
    try{
        const arr = [18, 25, 32];

        const users = await User.find({
            age:{
                $in:arr
            }
        })

        return res.status(200).json({
            users
        })
    }
    catch(err){
        return res.status(500).json({message: err.message, status:"Failed"})
    }
})


module.exports = router;

//Principle of least privilege
//least privilege -> only the minimum required privileges should be given to a user to perform a task
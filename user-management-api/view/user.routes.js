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

router.get("/cityAge", async (req, res)=>{
    try{
        const { city, age } = req.query;

        const users = await User.find({
            "address.city":city,
            age:{
                $gte:parseInt(age)
            }
        })

        res.status(200).json({
            users
        })


    }
    catch(err){
        return res.status(500).json({message: err.message, status:"Failed"})
    }
})

router.get('/random', async (req, res)=>{
    try{
        const user = await User.find({
            role:'admin',
            age:{
                $gt:20
            },
            phone:{
                $exists:true
            }
        })

        return res.status(200).json({user, message:"Users retrieved successfully", status:"Success"})
    }catch(err){
        return res.status(500).json({message: err.message, status:"Failed"})
    }
})


router.put('/update/:id', async (req, res)=>{
    try{
        const id = req.params.id;
        const updatedData = req.body;

        const user = await User.updateOne(
            {
                _id:id
            },
            {
                $set: updatedData
            }
        )
        res.status(200).json({
            user
        })
    }
    catch(err){
        return res.status(500).json({message: err.message, status:"Failed"})
    }
})

router.put("/updatePassword/:id", async (req, res)=>{
    try{
        const id = req.params.id;
        const password = req.body.password;

        const user = await User.findOneAndUpdate(
            {
                _id:id
            },
            {
                $set:{
                    password:password
                }
            },
            {
                runValidators:true,
                new:true
            }
        )

        return res.status(200).json({user, message:"Password updated successfully", status:"Success"})

    }
    catch(err){
        return res.status(500).json({message: err.message, status:"Failed"})
    }
} )


router.delete('/delete/:id', async (req, res)=>{
    try{
        const id = req.params.id;

        const user = await User.deleteOne(
            {
                _id:id
            }
        )

        return res.status(200).json({
            user
        })
    }
    catch(err){
        return res.status(500).json({message: err.message, status:"Failed"})
    }
})

module.exports = router;

//Principle of least privilege
//least privilege -> only the minimum required privileges should be given to a user to perform a task
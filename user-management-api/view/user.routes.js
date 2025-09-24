const express = require('express');
const router = express.Router();

const User = require('../model/user.model');
const xss = require('xss');
const { createToken, verifyToken } = require('../auth/api.auth');
//create User
//Create Operation -> whatever info we send, a document should be CREATED in the databse

router.post('/signup', async (req, res)=>{
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
})

router.get("/json", async (req, res)=>{
    try{

        const body = req.body;
        const header = req.headers;

        return res.status(200).json({body, header});

    }
    catch(err){
        return res.status(500).json({message: err.message, status:"Failed"})
    }
})

router.post('/login', async (req, res)=>{
    try{
        const { email, password } = req.body;
        
        const user = await User.findOne({
            email:email,
        })

        if(!user.checkPassword(password)){
            return res.status(400).json({message:"Invalid credentials", status:"Failed"})
        }

        const token = createToken(user);

        return res.status(200).json({user, message:"Login successful", token, status:"Success"});
    }   
    catch(err){
        return res.status(500).json({message: err.message, status:"Failed"})
    }
})

//Read -> find() -> query that fetches some data from the database
router.get("/users", verifyToken, async (req, res)=>{
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

        if(name.typeof !== 'string'){
            return res.status(400).json({message: "Invalid name parameter"})
        }



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

//Aggregation Pipelines -> a set of stages that process data and return computed results
//normal find queries return documents in their original form 
//aggregation pipelines can transform the documents and return computed results

// DB data -> stage1 -> stage2 -> stage3 -> final result

//stages -> $match, $group, $sort, $project, $limit, $skip, $count, $unwind

//get number of users in each city 
router.get("/citywise", async (req, res)=>{
    try{
        //first i will have to group the data by city 
        //then count the number of users in each city

        const result = await User.aggregate(
            [
                {
                    $group:{
                        _id:"$address.city", //group by city
                        count: {
                            $sum:1 //count number of users in each city
                        }

                    }
                },
                {
                    $project:{
                        city:"$_id",
                        count:1,
                        _id:0 //do not show the _id field
                    }
                }

            ]
        )

        return res.status(200).json({result, message:"Aggregation successful", status:"Success"})
    }
    catch(err){
        return res.status(500).json({message: err.message, status:"Failed"})
    }
})

//agewise distribution of users
router.get("/agewise", async (req, res)=>{
    try{
        const result = await User.aggregate(
            [
                {
                    $group:{
                        _id:"$age",
                        count:{$sum:1}
                    }
                },
                {
                    $project:{
                        age:"$_id",
                        count:1,
                        _id:0
                    }
                },
                {
                    $sort:{
                        age:-1 
                    }
                }
            ]
        )
        return res.status(200).json({
            result
        })
    }
    catch(err){
        return res.status(500).json({message: err.message, status:"Failed"})
    }
})

router.get("/match", async (req, res)=>{
    try{
        const query = req.query.q;

        const results = await User.aggregate([
            {
                $match:{
                    age:{
                        $gt:parseInt(query)
                    }
                }
            }
        ])
    
    res.json({
        data:results
    })
    }


    catch(err){
        return res.status(500).json({message:err.message})
    }
})

//people from different cities that are there in my database

//add a condition in this 
//age>18 (adults)
router.get("/citygroup", async (req, res)=>{
    try{
        const result = await User.aggregate([
            {
                $match:{
                    age:{
                        $gt:18
                    }
                }
            },
            {
                $group:{
                    _id:"$address.city",
                    count:{
                        $sum:1
                    }

                }
            },
            {
                $project:{
                    "_id":0,
                    city:"$_id",
                    count:1

                }
            }
        ])

        return res.status(200).json({result})
    }
    catch(err){
        return res.status(500).json({message: err.message, status:"Failed"})
    }
})


router.get("/sort", async (req, res)=>{
    try{
        const result = await User.aggregate([
            {
                $limit:10
            },
            {
                $sort:{
                    age:1 //1-> ascending, -1-> descending
                }
            }
        ])
        
        return res.status(200).json({result})

    }
    catch(err){
        return res.status(500).json({message: err.message, status:"Failed"})
    }
})

//pagination 

//page -> 1, 2, 3, 4
//limit -> in one page how many records you want to show -> i want to see 10 records in one page
//skip -> (page-1)*limit -> number of records to skip
router.get("/pagination", async (req, res)=>{
    try{
        const page= parseInt(req.query.page) || 1;
        const limit= 2;
//for page 2 -> we will have to skip -> (2-1)*10 -> 10 records
//for page 3 -> we will have to skip -> (3-1)*10 -> 20 records
//for page 4 -> we will have to skip -> (4-1)*10 -> 30 records
        const result = await User.aggregate([
           
            {
                $skip:(page-1)*limit
            },{
                $limit:limit
            }
        ])

        return res.status(200).json({page, result})
    }
    catch(err){
        return res.status(500).json({message: err.message, status:"Failed"})
    }
})


module.exports = router;

//Principle of least privilege
//least privilege -> only the minimum required privileges should be given to a user to perform a task



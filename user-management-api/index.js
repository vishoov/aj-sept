const express = require('express');
const app = express();
const mongoose = require("mongoose");
const userRoutes = require('./view/user.routes');

app.use(express.json());




const URI = 'mongodb+srv://vverma971_db_user:InBaq7jfrae67ndi@cluster0.m7rucnx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

//connecting to the database 
//mongoose promise to connect to the database

mongoose.connect(URI)
.then(()=>{
    console.log("connected to the database")
})
.catch((err)=>{
    console.log("error connecting to the database", err);
})


app.get("/", (req, res)=>{
    res.send("user management api");
})

app.use('/', userRoutes);

//database 




app.listen(3000, ()=>{
    console.log("user management api started on port 3000");
})
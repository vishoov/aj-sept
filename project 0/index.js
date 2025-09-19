const express = require('express');

const app = express();
const blogRoutes= require('./View/blogRoutes');


app.use(express.json()); //middleware to parse json body
// app.use(express.urlencoded({ extended: true })); //middleware to parse urlencoded body
// app.use(helmet()); //middleware to set security headers
//database 

app.use("/api", blogRoutes)
//app.use("/api-prefix", routes)-> this will add a prefix to all the routes in the routes file
//routes
//controllers
//models
//middlewares

app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})
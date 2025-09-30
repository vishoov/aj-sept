const express = require('express');
const app = express();
app.use(express.json()); 
const userRoutes = require('./view/user.routes');
const productRoutes = require('./view/product.routes');
const MONGO = 'mongodb+srv://vverma971_db_user:InBaq7jfrae67ndi@cluster0.m7rucnx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const cartRoutes = require("./view/cart.routes");
const orderRoutes = require("./view/order.routes")

const mongoose = require('mongoose');

mongoose.connect(MONGO)
.then(()=>{
    console.log("DB connected");
})
.catch((e)=>{
    console.log(e);
})

app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use('/cart', cartRoutes);
app.use("/order", orderRoutes);

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/index.html");
})




app.listen(3000, ()=>{
    console.log("server started at 3000");
})
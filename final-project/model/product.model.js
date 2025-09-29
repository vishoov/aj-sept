const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({

// 	Name:string,
name:{
    type:String,
    required:true
},
sellerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"New User",
    required:true
},
// sellerId:string, -> ref user
description:{
    type:String,
    required:true
},
costprice:{
    type:Number,
    required:true,
    min:0
},
saleprice:{
    type:Number,
    required:true,
    min:0
},
Category:{
    type:String,
    enum:["Electronics", "Clothing", "Books", "Home", "Beauty", "Sports", "Toys", "Automotive", "Grocery", "Health"],
    default:"Electronics",
    required:true
},
Stock:{
    type:Number,
    required:true,
    min:0
},
image:[String], // cdn links front end
// description:string,
// Costprice:number,
// saleprice:number,
// Category:string,
// Stock:number,
// image:[String] -> cdn links front end 
// createdAt:date

}, {
    timestamps:true
})

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
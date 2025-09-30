const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
// userID:string,
userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"New User",
    required:true
},
products:[
    {
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required:true
        },
        price:{
            type:Number,
            required:true,
        },
        quantity:{
            type:Number,
            min:1,
            required:true
        }

        
    }
],
totalAmount:{
    type:Number,
    required:true,
}
// Products:[{
// productId: string,
// Price:number,
// quantity:number	
// }],
// totalAmount:number

})

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;


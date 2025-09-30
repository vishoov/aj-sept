const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
// Id:string,
// userID:string,
userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"New User",
    required:true,
},
Items:[
    {
        productId:{
            type:String,
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
        price:{
            type:Number,
            required:true
        }
    }
],
totalAmount:{
    type:Number,
    required:true,
    min:0
},
shippingAddress:{
    type:String,
    required:true
},
status:{
    type:String,
    enum:['Pending', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default:"Pending"
}
// Items:[{
// 	productID:string,
// 	Quantity:number,
// 	Price:number
// }]
// 	totalAmount:Number,
// 	shippingAddress:String,
// 	Status:string,
},{
    timestamps:true
})

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
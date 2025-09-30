const Order = require("../model/order.model")
const Product = require("../model/product.model");
const User = require("../model/user.model");
const Cart = require("../model/cart.model")
const placeOrder = async (req, res)=>{
try{
    const { userId } = req.body;

    if(!userId){
        res.send("user id not provided")
    }

    //find the cart to place it as order

    const cart = await Cart.findOne({userId});

    if(!cart){
        return res.status(400).json({
            message:"Cart not found for this user"
        })
    }

    if(cart.products.length===0){
        return res.status(400).send("Cart is empty,cannot place order")
    }else{
        //quantity of products is greater than stock then we'll send an error

        for(const product of cart.products){
            const result = await Product.findById(product.productId);

            if(result.stock<product.quantity){
                return res.status(400).send("Product is out of stock")
            }
        }
    }

    const user = await User.findOne({_id:userId});

    const shippingAddress = user.address;

    const order = new Order({
        userId,
        Items:cart.products,
        totalAmount:cart.totalAmount,
        shippingAddress:shippingAddress,
        status:"Pending"
    })

    await order.save();

    res.status(201).json({
        message:"Order Placed",
        order
    })


}
catch(err){
    res.send(err.message)
}
}

const cancelOrder = async (req, res)=>{
    try{
        const { orderId } = req.body;

        if(!orderId){
            res.send("Invalid Order")
        }
    
        const order = await Order.findOne({
            _id:orderId
        })
    
        if(!order){
            res.send("Order not found")
        }
    
        if(order.status==="Cancelled"){
            res.send("Order already cancelled")
        }
    
        order.status="Cancelled"
    
        await order.save();
    
        res.send({
            message:"Order cancelled successfully",
            order
        })
    }
    catch(err){
        res.send(err.message)
    }

}

const trackOrder = async (req, res)=>{
try{
    const { orderId } = req.body;

    if(!orderId){
        res.send("Invalid Order")
    }

    const order = await Order.findOne({
        _id:orderId
    })

    if(!order){
        res.send("Order not found")
    }

    

    res.send({

        order
    })
}
catch(err){
    res.send(err.message)
}
}

module.exports = {
    placeOrder,
    cancelOrder,
    trackOrder
}
const Cart = require('../model/cart.model')
const Product = require("../model/product.model")
// Add to cart
const addToCart = async (req, res)=>{
    try{
    const { userId } = req.body;
    const { 
        productId, quantity
    } = req.body;

    

    const product = await Product.findById(productId);

    if(!product){
        return res.status(400).json({
            message:"Product you are trying to add to cart, does not exist"
        })
    }

    const productprice = product.saleprice;

    //---------------CART LOGIC--------------

    let cart = await Cart.findOne({
        userId
    });

    if(cart){
        //when the cart already exists 
        const products = cart.products;

        const productIndex = products.findIndex(
            p => p.productId.toString() == productId.toString()
        );

        if(productIndex > -1){
            cart.products[productIndex].quantity +=quantity;
            cart.products[productIndex].price = productprice;
        } else{
            cart.products.push({
                productId,
                quantity,
                price:productprice
            })
        }


        cart.totalAmount  = cart.products.reduce(
            (sum, item)=> sum+item.price*item.quantity, 0
        )
       

        await cart.save();

        return res.status(200).json({
            message:"Product Added to Cart",
            cart
        })

    }else{
        const newCart = await Cart.create({
            userId,
            products:[
                {
                    productId,
                    quantity,
                    price:productprice
                }
            ],
            totalAmount: productprice * quantity
        })

        return res.status(201).json({
            message: "Cart created successfully",
            cart:newCart
        })
    }
}catch(err){
    res.send(err.message)
}
}
// Delete From Cart
const deleteFromCart = async (req, res)=>{
    try{
        const { userId, productId } = req.body;

        if(!productId){
            res.status(400).json({
                message:"Invalid Product"
            })
        }

        const cart = await Cart.findOne({
            userId
        });

        if(!cart){
            res.status(400).json({
                message:"Cart not found"
            })
        }

        const productIndex = cart.products.findIndex(
            p=>p.productId.toString() === productId.toString()
        )

        if(productIndex===-1){
            return res.status(400).json({
                message:"Product not found in the cart"
            })
        }

        cart.products.splice(
            productIndex, 
            1
        )

        cart.totalAmount = cart.products.reduce(
            (sum, item)=> sum+item.price*item.quantity, 0
        )

        await cart.save();

        return res.status(200).send({
            message:"Product successfully deleted from cart",
            cart
        })


    }
    catch(err){
        res.send(err.message)
    }


}
// Fetch Cart
const fetchCart  = async (req, res)=>{
    try{
        const { userId } = req.body;

        if(!userId){
            res.send("User Id not provided")
        }

        const cart = await Cart.findOne({
            userId
        });

        if(!cart){
            return res.status(400).send("Cart not found for this user")
        }

        return res.status(200).json({
            message:"Cart Fetched Successfully",
            cart
        })
    }
    catch(err){
        res.send(err.message)
    }
}


module.exports = {
    addToCart,
    deleteFromCart,
    fetchCart
}

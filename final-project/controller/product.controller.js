const Product = require('../model/product.model');

// Create product /createproduct
const createProduct = async (req,res)=>{
try{

    const productInfo = req.body;

    const product = await Product.create(productInfo);

    if(!product){
        return res.status(400).json({message: "Error while creating product"});
    }

    res.status(201).json({
        message: "Product created successfully",
        product: product
    })
}
catch(err){
    res.status(500).json({message: err.message});
}
}
// Fetch Product /product
const getProducts = async (req,res)=>{
    try{
        const products = await Product.find().populate('sellerId', 'name email contact');

        if(!products){
            return res.status(400).json({message: "No products found"});
        }

        res.status(200).json({
            message: "Products fetched successfully",
            products: products
        })
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}
// Update Product /updateProduct
const updateProduct =async (req,res)=>{
    try{
        const { id } = req.params;

        const updatedInfo = req.body;

        const product = await Product.findByIdAndUpdate(
            id,
            updatedInfo,
            {new: true}
        )

        if(!product){
            return res.status(400).json({message: "Product not found"});
        }

        res.status(200).json({
            message: "Product updated successfully",
            product: product
        })
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}
// Delete Product /deleteProduct
const deleteProduct =async (req,res)=>{
    try{
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);

        if(!product){
            return res.status(400).json({message: "Product not found"});
        }

        res.status(200).json({
            message: "Product deleted successfully",
            product: product
        })

    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}
// Search /searchProduct
const searchProduct =async (req,res)=>{
    try{
        const searchquery = req.query.q;

        if(!searchquery){
            return res.status(400).json({message: "Please provide searchquery"});
        }

        const results = await Product.find({
            $or:[
                {
                    name: {
                        $regex: searchquery,
                        $options: "i"
                    }
                },
                {
                    Category:{
                        $regex: searchquery,
                        $options: "i"
                    }
                },
                {
                    description:{
                        $regex: searchquery,
                        $options: "i"
                    }
                }
            ]
        })
        if(results.length===0){
            return res.status(404).json({message: "No products found"});
        }

        res.status(200).json({
            message: "Products fetched successfully",
            products: results
        })
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}


module.exports = {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    searchProduct
}

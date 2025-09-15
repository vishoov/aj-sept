//express ROUTER -> this is a mini express application
const express= require('express');
const router = express.Router();
//app.method(route, callback function)
const { rootHandler, create } = require('../Controllers/blogController')
//router instance -> we can use all the methods that we use with the express app instance
const { logging } = require('../Middlewares/blogMW');
const blogs = [
    {
        id:1,
        title: "First Blog",
        content: "This is the content of the first blog",
        author: "John Doe"
    },
    {
        id:2,
        title: "Second Blog",
        content: "This is the content of the second blog",
        author:"Jane Doe"
    }
]

const middlewareFunction = (req, res, next)=>{
    console.log("Middleware Function executed");
    next(); //this will pass the request to the next middleware or route handler
}

//application level middleware -> this middleware will be executed for every request in the server 
router.use(middlewareFunction);




router.use(logging)

router.get("/", rootHandler)


//create a new blog post
router.post('/create-blog', create)



const routeSpecificMiddleware = (req, res, next)=>{
    console.log("Route specific middleware executed");
    next();
}


//Read all blog posts
router.get("/blogs", routeSpecificMiddleware, (req, res)=>{
    res.json(blogs);
})



//Read a single blog post by id
router.get("/blogs/:id", (req, res)=>{
    const id= parseInt(req.params.id);
    //the id will be in string format so we need to convert it to number

    const blog = blogs.find(blog => blog.id === id);

    res.json(blog);
})


//Update a blog post by id
router.put('/blogs/:id', (req, res)=>{
    const id = parseInt(req.params.id);

    const { title, content, author } = req.body;

    const blogIndex = blogs.findIndex(blog => blog.id === id);

    blogs[blogIndex] = {
        id:id,
        title:title, 
        content:content,
        author:author
    }

    res.json({ message: "Blog updated successfully", blog: blogs[blogIndex]});
})



//Delete a blog post by id
router.delete("/blogs/:id", (req, res)=>{
    const id = parseInt(req.params.id);

    const blogIndex= blogs.findIndex(blog => blog.id === id);

    blogs.splice(blogIndex, 1);

    res.json({ message: "Blog deleted successfully" });
})

module.exports = router;
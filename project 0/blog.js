const express = require('express');

const app = express();

app.use(express.json()); //middleware to parse json body

//database 
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



app.get("/", (req, res)=>{
    res.send("Welcome to the blog management api")
})


//create a new blog post
app.post('/create-blog', (req, res)=>{

    const { title, content, author } = req.body;

    const newBlog = {
        id: blogs.length+1,
        title:title,
        content:content,
        author:author
    }

    blogs.push(newBlog);

    res.status(201).json({ message: "Blog created successfully", blog: newBlog });
})




//Read all blog posts
app.get("/blogs", (req, res)=>{
    res.json(blogs);
})



//Read a single blog post by id
app.get("/blogs/:id", (req, res)=>{
    const id= parseInt(req.params.id);
    //the id will be in string format so we need to convert it to number

    const blog = blogs.find(blog => blog.id === id);

    res.json(blog);
})


//Update a blog post by id
app.put('/blogs/:id', (req, res)=>{
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
app.delete("/blogs/:id", (req, res)=>{
    const id = parseInt(req.params.id);

    const blogIndex= blogs.findIndex(blog => blog.id === id);

    blogs.splice(blogIndex, 1);

    res.json({ message: "Blog deleted successfully" });
})



app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})


const rootHandler = (req, res)=>{
    console.log("Root route accessed");
    res.send("Welcome to the blog management api")
}


const create = (req, res)=>{

    const { title, content, author } = req.body;

    const newBlog = {
        id: blogs.length+1,
        title:title,
        content:content,
        author:author
    }

    blogs.push(newBlog);

    res.status(201).json({ message: "Blog created successfully", blog: newBlog });
}

module.exports = {
    rootHandler,
    create
}
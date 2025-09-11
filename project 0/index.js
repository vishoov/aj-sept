const express = require('express');
//this imports the express module

//we setup the express app 
const app = express();

//this app is going to be the actual SERVER that will listen to every request
//that we recieve from any client

//here we'll be starting with API Design

//Root route -> "/" -> this is the main route of our application
app.get("/", (req, res)=>{
    //req and res objects 
    //req -> request object -> contains all the information about the request that we recieve from the client
    //res -> response object -> contains all the methods that we can use to send a response back to the client
    res.send("Hello Acciojob")
})

//app.method("route", callback function)

//Request Object methods 
//1. req.headers -> contains all the headers that we recieve from the client
//2. req.body -> contains the body of the request that we recieve from the client
//3. req.method -> contains the method of the request that we recieve from the client
//4 req.path -> contains the path of the request that we recieve from the client
//5. req.url -> contains the url of the request that we recieve from the client
//6 req.ip -> contains the ip address of the client that is making the request
//7 req.protocol -> contains the protocol of the request that we recieve from the client

app.get("/request", (req, res)=>{
    const info = {
        headers: req.headers,
        body: req.body,
        method: req.method,
        path: req.path,
        url: req.url,
        ip: req.ip,
        protocol: req.protocol
    }

    res.json(info);
})


//Response Object methods
//1. res.send("hello world") -> a single text response to the client
//2. res.json({ name:"abc"}) -> a json response to the client
//3. res.status(status_code).send("hello world") -> a response with a specific status code to the client

app.get("/response", (req, res)=>{
    res.status(400).json({ message: "This is a bad request" })
})


//send a file 
app.get("/file", (req, res)=>{
    res.sendFile(__dirname + "/index.html")
})

//Dynamic Routing

// useParams -> to get the parameters from the url
//Route Parameters -> /user/:id -> /user/123 -> req.params.id -> 123
// are compulsary /user/:id -> /user/ -> will give 404 error
app.get('/user/:id', (req, res)=>{
    const userID = req.params.id;
    res.send(`User ID is ${userID}`);
})
//product pages, blog pages, etc

//Query Parameters -> /user?id=123 -> req.query.id -> 123
// are optional /user?id=123 -> /user/ -> will not give 404 error
//are majorly used for searching, filtering, sorting, pagination, etc
app.get("/search", (req, res)=>{
    const searchTerm = req.query.q;
    res.send(`You searched for ${searchTerm}`);
});


//port listener 
//port listener is a function that is going to listen to a specific port on our machine

const PORT = 3000;


app.listen(PORT, ()=>{
    console.log(`server is listening on port ${PORT}`);
})

//document.addEventListener('click',function(){})




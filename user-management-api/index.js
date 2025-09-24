const express = require('express');
const app = express();
const mongoose = require("mongoose");
const userRoutes = require('./view/user.routes');
const multer = require('multer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');


//Apply Rate Limiting to all requests

const limiter = rateLimit({
    windowMs: 15*60*1000, //15 minutes
    max:100, //limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again after 15 minutes"
})

app.use(limiter);

const corsOptions = {
    origin:'http://localhost:5500', //frontend url
    // optionsSuccessStatus:200 //some legacy browsers (IE11, various SmartTVs) choke on 204
    methods:"GET, POST, PUT, DELETE",
    allowedHeaders:"Content-Type, Authorization" //which headers are allowed 
}

app.use(cors(corsOptions));



//define the storage for multer
// const upload = multer({
//     dest:"uploads/",
// })



const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, 'uploads/'); //folder name where files will be stored
    },
    filename:function(req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random()*1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }

})
const upload = multer({storage: storage});

app.post("/upload", upload.single('profile'), async (req, res)=>{
    try{
        console.log("route called")
        const file = req.file;
        console.log(file);

        if(!file){
            return res.status(400).json({message: "No file uploaded"});
        }

        res.status(200).json({message: "File uploaded successfully", file: file});
    }
    catch(err){
        res.status(500).json({message: "error uploading file", error: err.message});
    }

})

app.post("/upload-multiple", upload.array('photos', 5), async (req, res)=>{
    try{
        const files=  req.files;
        console.log(files);

        if(!files || files.length===0){
            return res.status(400).json({message: "No files uploaded"});
        }

        res.status(200).json({message: "Files uploaded successfully", files: files});
    }
    catch(err){
        res.status(500).json({message: "error uploading files", error: err.message});
    }
})

app.use(express.json());

const dotenv = require('dotenv');
dotenv.config();



const URI = process.env.MONGO;

//connecting to the database 
//mongoose promise to connect to the database

mongoose.connect(URI)
.then(()=>{
    console.log("connected to the database")
})
.catch((err)=>{
    console.log("error connecting to the database", err);
})


const logging = (req, res, next)=>{
    try{
        const method = req.method;
        const url = req.url;
        const time = new Date().toISOString();

        console.log(`[${time}] ${method} ${url}, ${res.body}`);

        //we can also log this to a file or database for future reference

        next(); //proceed to the next middleware or route handler
    }
    catch(err){
        console.log("error in logging middleware", err);
        next(); //proceed to the next middleware or route handler
    }
}

app.use(logging); //apply logging middleware to all routes


app.get("/", (req, res)=>{
    res.send("user management api");
})

app.use('/', userRoutes);

//database 




app.listen(3000, ()=>{
    console.log("user management api started on port 3000");
})
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const userRoutes = require('./view/user.routes');
const multer = require('multer');


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




const URI = 'mongodb+srv://vverma971_db_user:InBaq7jfrae67ndi@cluster0.m7rucnx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

//connecting to the database 
//mongoose promise to connect to the database

mongoose.connect(URI)
.then(()=>{
    console.log("connected to the database")
})
.catch((err)=>{
    console.log("error connecting to the database", err);
})


app.get("/", (req, res)=>{
    res.send("user management api");
})

app.use('/', userRoutes);

//database 




app.listen(3000, ()=>{
    console.log("user management api started on port 3000");
})

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:{
            validator: function(v){
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    address:{
        type:String,

    },
    contact:{
        type:Number,
        required:true,
    },
    role:{
        type:String,
        enum:["user", "admin", "seller"],
        default:"user"
    },
    password:{
        type:String,
        required:true,
        minlength:6
    }
},
{
    timestamps:true
})
// Id: string,
//     Name: string,
//     Age: number,
//     Email: string,
//     Address: string,
//     Contact: number,
//     Role: "user" | "admin", // Role-based authentication
//     Password: string
            
const User = mongoose.model("New User", userSchema);

module.exports = User;
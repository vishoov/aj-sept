//username
//email
//password
//role (admin, user)
//phone
//age
//address (ecommerce)


//type: String, Number, Date, Buffer, Boolean, Mixed, ObjectId, Array

const mongoose = require('mongoose');
//a schema is a structure or blueprint of the data

const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
//username
username:{
    type:String, //data type (compulsary to write)
    unique:true, //no two users can have same username
    required:true, //compulsary field
    trim:true, //removes spaces from start and end
    minLength:3, //minimum length
    maxLength:30 //maximum length
},
//email
email:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    lowercase:true, //converts to lowercase
    //string validation 
    validate:{
        validator:function(value){
            //regex for email validation
            //regular expression -> pattern matching
            //@usernamedomain.com
            if(value.length<5) return false; //minimum length of email

            if(value.length>50) return false; //maximum length of email


            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
        },
       message: props => `${props.value} is not a valid email address!`
    }
},
//password
password:{
    type:String,
    required:true,
    minLength:8, //minimum length
    maxLength:100 //maximum length
},
//role (admin, user)
role:{
    type:String,
    enum:['admin', 'user', 'guest', 'superadmin'], //only these values are allowed
    default:'user' //default value  
},
//phone
phone:{
    type:Number,
    required:true,
    unique:true,
    validate:{
        validator:function(value){

            //10 digit number
            return /^[0-9]{10}$/.test(value);
        },
         message: props => `${props.value} is not a valid phone number!`
    }
},
//age
age:{
    type:Number,
    min:0, //minimum age
    max:120 //maximum age
},
address:{

    city:{
        type:String,
        required:true,
        trim:true,
        minLength:2,
        maxLength:50
    },
    state:{
        type:String,
        required:true,
        trim:true,
        minLength:2,
        maxLength:50
    },
    country:{
        type:String,
        required:true,
        trim:true,
    }


}
//address (ecommerce)
}
,{
    timestamps:true, //createdAt, updatedAt

});

// target.addEventListener('event', handlerFunction)
userSchema.pre('save', async function(next){
    //signup -> password -> encrypted-> database
    //encrypt the password before saving to database
    //hashing -> one way encryption

    //condition to check if password is modified
    if(this.isModified('password')){
        //encrypt the password
        // const salt = await bcrypt.genSalt(10); //generate salt
        const salt = "$2b$10$CwTycUXWue0Thq9StjUM0u"; //fixed salt
        const hashedPassword = await bcrypt.hash(this.password, salt);
        //fdigd9t94yt9hdoh9yh09y40hgod09y40hdph04yono0g0b
        this.password = hashedPassword;
        //user data -> update the password -> save
        return next();
    }else{
        return next();
    }
})

//the server now shows error because the password is hashed and it does not resemble the original password
//login -> user enters password -> we have to compare the user entered password with the hashrd password in the database

userSchema.methods.checkPassword = async function (password){
    //password -> user entered password
    //this.password -> hashed password in the database
    return await bcrypt.compare(password, this.password);
}
//model
const User = mongoose.model('User_Collection', userSchema);

module.exports = User;
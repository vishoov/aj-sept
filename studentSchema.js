
const studentSchema = mongoose.Schema({
    // name
    name:{
        type:String,
        required:true,
        trim:true,
        minLength:[2, 'Name must be at least 2 characters long'],
        maxLength:50
    },
    // class
    class:{
        grade:{
            type:String,
            required:true,
            enum:['1','2','3','4','5','6','7','8','9','10','11','12', 'Kindergarten'],
            default:'1'
        },
        section:{
            type:String,
            required:true,
            enum:['A','B','C','D','E'],
            default:'A'
        }
    },
    // Age
    age:{
        type:Number,
        required:true,
        min:3,
        max:18
    },
    // parent
    parents:{
        fatherName:{
            type:String,
            required:true,
            trim:true,
        },
        motherName:{
            type:String,
            required:true,
            trim:true,
        },
        contactNumber:{
            type:Number,
            required:true,
        }
    },
    // attendance
    attendance:{
        type:Array,
        date:{
            type:Date,
            required:true,
        }
    },
    // subject
    subjects:{
        type:Array,
        enum:['Math','Science','History','Geography','English','Physical Education','Art','Music'],
        required:true,
    },
    // address
    address:{
        type:String,
        required:true,
        trim:true,
        minLength:5,
        maxLength:100
    }

},
{
    timestamps:true //createdAt, updatedAt
})
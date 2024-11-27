//create model--> it is nothing but the database table(schema for that )
import { genSalt, hash } from "bcrypt";
import mongoose from "mongoose";
//email is required whenever a new user is created therfore required: [true,"Email is Required."]second is validation message if email is not entered 
//send image to the server using the multer package with the help of url
//profilesetup -- whenever we login we will have email and password but for first time we will need first and last name and the color only after account setup we will access the application
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is Required."],
        unique:true,
    },
    password:{
        type:String,
        required:[true,"Password is Required."],
        
    },
    firstName:{
        type:String,
        required:false,  
    },
    lastName:{
        type:String,
        required:false,  
    },
    image: {
        type:String,
        required:false,  
    },
    color:{
        type:Number,
        required:false,
    },
    profileSetup:{
        type:Boolean,
        default:false,
    },
});
//pre is a middleware preimposed two type of middleware provided by mongodb
//before saving the data we have to run this function
//encrypt the password usin the becrypt package
//salt is just for encryption
//if you want to change this method or have strong password check documentation of becrypt
//next() tells server that this is completed and moveoon to the next part of the code else your server will stop here
userSchema.pre("save",async function(next){
    const salt= await genSalt();
    this.password=await hash(this.password,salt);
    next();
});

//create model and store it inside user name the model as Users and passing the userSchema
const User=mongoose.model("Users",userSchema);

export default User;


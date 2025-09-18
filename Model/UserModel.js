import mongoose from "mongoose";

const userschema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    bio:{
        type:String
    },
    bookmarks:{
        type:[String]
    }
})

const UserModel=mongoose.model("userschema",userschema);
export default UserModel;
import mongoose from "mongoose";

const blogschema= new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
    },
    tags:{
        type:String
    },
    image:{
        type:String
    },
    isBookeMark:{
        type:Boolean,
        default:false
    }
},{ timestamps: true })

const BlogModel=mongoose.model("blogschema",blogschema);

export default BlogModel;
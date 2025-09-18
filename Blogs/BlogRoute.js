import express from "express";
import upload from "../cloud/upload.js";
import { validateToken } from "../middleware/validation.js";
import BlogModel from "../Model/BlogModel.js";
import UserModel from "../Model/UserModel.js";

const router=express.Router();

router.post("/addblog",upload.single("image"),validateToken,async(req,res)=>{
    try{
        const userId=req.userId;
        const {title,content,tags}=req.body;
        if(!userId){
            res.status(401).json({ message: "UnAuth", error: err.message, status: false });
        }

        const newBLog= new BlogModel({
            userId:userId,
            title:title,
            content:content,
            tags:tags,
            image:req.file.path
        });

        await newBLog.save();
        res.status(200).json({success:true,message:"successfully created blog"});

    }catch(err){
        res.status(500).json({ message: "Failed to Post", error: err.message, status: false });
    }
});

router.get("/get", async (req, res) => {
    try {
      const blogs = await BlogModel.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, blogs });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch blogs", error: err.message });
    }
});

router.get("/get/:id", async (req, res) => {
    try {
      const blog = await BlogModel.findById(req.params.id);
      if (!blog) return res.status(404).json({ message: "Blog not found" });
  
      res.status(200).json({ success: true, blog });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch blog", error: err.message });
    }
});

router.get("/getAuthor/:userId", async (req, res) => {
    try {
      const author = await UserModel.findOne({ _id: req.params.userId });
          
      res.status(200).json({ success: true, author:author });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch blogs by user", error: err.message });
    }
});

router.put("/edit/:id", upload.single("image"), validateToken, async (req, res) => {
    try {
      console.log(req.params.id)
      const blog = await BlogModel.findById(req.params.id);
      if (!blog) return res.status(404).json({ message: "Blog not found" });
  
      if (req.file) {
        if (blog.public_id) {
          await cloudinary.v2.uploader.destroy(blog.public_id); 
        }
        blog.image = req.file.path;
      }
  
      blog.title = req.body.title || blog.title;
      blog.content = req.body.content || blog.content;
      blog.tags = req.body.tags || blog.tags;
  
      await blog.save();
      res.status(200).json({ success: true, message: "Blog updated successfully", blog });
    } catch (err) {
      res.status(500).json({ message: "Failed to update blog", error: err.message });
    }
});

router.delete("/delete/:id", validateToken, async (req, res) => {
    try {
      const blog = await BlogModel.findById(req.params.id);
      if (!blog) return res.status(404).json({ message: "Blog not found" });

      if (blog.public_id) {
        try {
          await cloudinary.v2.uploader.destroy(blog.public_id);
          console.log('Image deleted from Cloudinary:', blog.public_id);
        } catch (cloudinaryError) {
          console.error('Cloudinary deletion error:', cloudinaryError);
        }
      }
  
      await blog.deleteOne();
      res.status(200).json({ success: true, message: "Blog deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete blog", error: err.message });
    }
});

router.put("/bookmark/:id", validateToken, async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.userId;

    const blog = await BlogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    const user = await UserModel.findById(userId);
    const isBookmarked = user.bookmarks.includes(blogId);

    if (isBookmarked) {
      await UserModel.findByIdAndUpdate(
        userId,
        { $pull: { bookmarks: blogId } }
      );
    } else {
      await UserModel.findByIdAndUpdate(
        userId,
        { $addToSet: { bookmarks: blogId } }
      );
    }

    res.status(200).json({
      success: true,
      message: isBookmarked ? "Bookmark removed" : "Blog bookmarked",
      isBookmarked: !isBookmarked
    });

  } catch (err) {
    console.error("Bookmark error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update bookmark",
      error: err.message
    });
  }
});

export default router;
import express from "express"
import UserModel from "../Model/UserModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import BlogModel from "../Model/BlogModel.js";
import { validateToken } from "../middleware/validation.js";
import upload from "../cloud/upload.js" 

const router=express.Router();
const key="BLOGS"

router.post("/signup",async(req,res)=>{
    try{
        const {name,email,password}=req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
          }

      
          const existingUser = await UserModel.findOne({ email });
          if (existingUser) {
            return res.status(400).json({ message: "Account already exists. Please log in." });
          }
      
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);

          const newUser = new UserModel({ name, email, password: hashedPassword });
          const savedUser = await newUser.save();

          const token = jwt.sign(
            { id: savedUser._id, email: savedUser.email},
            process.env.KEY,
            { expiresIn: "3h" }
          );

          res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 3 * 60 * 60 * 1000,
          });
          
          res.status(200).json({
            message: "Signup Successful",
            status: true,
            user: {
              id: savedUser._id,
              name: savedUser.name,
              email: savedUser.email,
            },
          });
      
    }catch(err){
        res.status(500).json({success:false,message:"Failed to Register"})
    }
})

router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(401).json({ message: "Email and password are required" });
      }
  
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "Account not found. Please sign up to continue." });
      }
  
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
  
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "The password you entered is incorrect. Please try again." });
      }
  
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.KEY,
        { expiresIn: "3h" }
      );
  
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 3 * 60 * 60 * 1000,
      });

      res.status(200).json({
        message: "Login Successful",
        status: true,
        token:token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
  
    } catch (err) {
      console.error("Login Error:", err);
      res.status(500).json({ message: "Failed Login", error: err.message });
    }
  });

router.get("/user",validateToken,async(req,res)=>{
  try{
    const user=await UserModel.findOne({_id:req.userId})
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({success:true,user:user})
  }catch(err){
    console.error("Login Error:", err);
      res.status(500).json({ message: "Failed Login", error: err.message });
  }
})
  
router.get("/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;

      const user = await UserModel.findById(userId).select("-password");
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      const blogs = await BlogModel.find({ userId }).sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        author: {
          id: user._id,
          name: user.name,
          email: user.email,
          image:user.image,
          bio: user.bio
        },
        blogs,
      });
    } catch (err) {
      console.error("Error fetching user blogs:", err);
      res.status(500).json({
        success: false,
        message: "Failed to fetch user blogs",
        error: err.message,
      });
    }
});

router.put("/user/editprofile/:id",validateToken,upload.single("image"),async(req,res)=>{
  try {
    const { name, bio } = req.body;
    const userId = req.params.id;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user._id.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only edit your own profile"
      });
    }

    if (req.file) {
      if (user.image) {
        await cloudinary.v2.uploader.destroy(user.image);
      }
      user.image = req.file.path
    }

    if (name) user.name = name;
    if (bio) user.bio = bio;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        profileImage: user.profileImage
      }
    });

  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: err.message
    });
  }
})

export default router
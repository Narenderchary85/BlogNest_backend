import express from "express"
import mongoose from "mongoose"
import AuthRoute from "./Auth/AuthUser.js"
import BlogRoute from "./Blogs/BlogRoute.js"
import cors from "cors"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 1000;

dotenv.config();
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('DB connected'))
  .catch(err => console.error(err));


app.use("/auth",AuthRoute);
app.use("/blog",BlogRoute)

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
  
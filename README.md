<h2>Live Demo<h2>

[Click here to view the live demo](https://blognest-t13t.onrender.com)
  
<h1>Blogs Page</h1>

![Alt Text](https://github.com/Narenderchary85/BlogNest/blob/main/public/blogspage.png)

<h1>Add Blogs</h1>

![Alt Text](https://github.com/Narenderchary85/BlogNest/blob/main/public/addblogs.png)

<h1>BlogCard</h1>

![Alt Text](https://github.com/Narenderchary85/BlogNest/blob/main/public/blogcard.png)

<h1>Myprofile</h1>

![Alt Text](https://github.com/Narenderchary85/BlogNest/blob/main/public/myprofile.png)

<h1>Edit Profile</h1>

![Alt Text](https://github.com/Narenderchary85/BlogNest/blob/main/public/editprofile.png)

<h1>Bookmarks</h1>

![Alt Text](https://github.com/Narenderchary85/BlogNest/blob/main/public/bookmarks.png)

## Installation and Setup

### Backend Repository Setup

1. **Clone the Backend Repository:**
   ```bash
   git clone https://github.com/Narenderchary85/BlogNest_backend
   cd BlogNest_backend
   
2.  **Install Dependencies:**
     ```bash
      npm install

3.  **Environment Variables Setup:**
     ```bash
      PORT=1000
      MONGO_URL=mongodb://localhost:27017/blogwave
      KEY=your_super_secret_jwt_key_here
      CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
      CLOUDINARY_API_KEY=your_cloudinary_api_key
      CLOUDINARY_API_SECRET=your_cloudinary_api_secret
      FRONTEND_URL=http://localhost:5173
4. **Cloudinary Setup:**
     ```bash
        Create a free account at Cloudinary
        Get your Cloud Name, API Key, and API Secret from the dashboard
        Add them to your backend .env file
     
5. **Start the Backend Server:**
     ```bash
          npm start
          The backend will run on: http://localhost:1000

### Frontend Repository Setup

1. **Clone the Frontend Repository:**
     ```bash
      git clone https://github.com/Narenderchary85/BlogNest
      cd folder-name
2. **Install Dependencies:**
     ```bash
        npm install
3. **3.	Environment Variables Setup:**
     ```bash
          VITE_API_URL=http://localhost:1000

4. **Start the Frontend Development Server:**
     ```bash
          npm run dev
          The frontend will run on http://localhost:5173



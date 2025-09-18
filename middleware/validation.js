import jwt from 'jsonwebtoken';

export const validateToken = (req, res, next) => {
    const token = req.cookies.token;
    const key = "BLOGS";
    if (!token) {
      return res.status(401).json({ message: "Token missing in cookies" });
    }
  
    try {
      const decoded = jwt.verify(token, key);
      if (!decoded.id || typeof decoded.id !== "string") {
        return res.status(400).json({ message: "Invalid user ID format in token" });
      }
  
      req.userId = decoded.id;
      next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ message: "Token is invalid or expired" });
    }
  };


  
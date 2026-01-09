import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const JWT_SECRET = 'your_jwt_secret_here';

export const authenticateToken = async (req,res,next) => {
    const authHeader = req.headers.authorization;
    
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success:false,
            message:'Not authorized, token missing'
        })
    }
    
    const token = authHeader.split(' ')[1];

    try{
      const payload = jwt.verify(token,JWT_SECRET);
      const user = await User.findById(payload.id).select('-password');

      if(!user){
        return res.status(401).json({
            success:false,
            message:'User not found'
        });
      }

      req.user = user;
      next();
    }

    catch(err){
        return res.status(401).json({
            success:false,
            message:'Token invalid or expired'
        })
    }
}

// Optional authentication - tries to authenticate but doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // No token provided, continue without user
        return next();
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(payload.id).select('-password');
        
        if (user) {
            req.user = user;
        }
        next();
    } catch (err) {
        // Invalid token, but continue without user
        next();
    }
}

export default authenticateToken;
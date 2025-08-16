import User from '../models/users.js'
import jwt from 'jsonwebtoken'

export const protect = async(req,res,next)=>{
    try {
        let token = req.headers.authorization;
        
        if(token && token.startsWith("Bearer")){
            token = token.split(" ")[1];
            const decoded = jwt.verify(token,process.env.SECRET_KEY);
            req.user = await User.findById(decoded.id).select('-password')
            next();
        }
        else{
            res.status(401).json({message: "Not Authorized, no Token Found"})
        }
    } catch (error) {
        res.status(401).json({
            message: "Not Authorized, invalid token",
            error: error.message
        })
    }
}
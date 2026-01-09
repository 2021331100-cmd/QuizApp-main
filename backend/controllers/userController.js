import userService from '../services/userService.js';
import { AppError } from '../middleware/errorHandler.js';

// REGISTER
export async function register(req,res,next) {
    try{
        const result = await userService.registerUser(req.body);

        return res.status(201).json({
            success:true,
            message:'Account created successfully!',
            token: result.token,
            user: result.user
        });
    }
    catch(err){
        const statusCode = err.message.includes('already exists') ? 409 : 400;
        next(new AppError(err.message, statusCode));
    }
}

//login
export async function login(req,res,next) {
    try{
        const result = await userService.loginUser(req.body);

        return res.status(200).json({
            success:true,
            message:'Login successfully!',
            token: result.token,
            user: result.user
        });
    }
    catch(err){
        const statusCode = err.message.includes('Invalid') ? 401 : 400;
        next(new AppError(err.message, statusCode));
    }
}
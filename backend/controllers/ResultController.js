import resultService from '../services/resultService.js';
import { AppError } from '../middleware/errorHandler.js';

export async function createResult(req, res, next) {
  try {
    const result = await resultService.createResult(req.body, req.user?._id);
    
    return res.status(201).json({
        success:true,
        message:"Result Created",
        result
    });
  } catch (error) {
     const statusCode = error.message === 'User authentication required' ? 401 : 400;
     next(new AppError(error.message, statusCode));
  }
}

// LIST THE RESULT
export async function listResults(req,res,next) {
    try{
        const {technology} = req.query;
        const results = await resultService.getUserResults(req.user?._id, technology);
        
        return res.json({
            success:true,
            results
        });
    }
    catch(error){
       const statusCode = error.message === 'User authentication required' ? 401 : 500;
       next(new AppError(error.message, statusCode));
    }
}

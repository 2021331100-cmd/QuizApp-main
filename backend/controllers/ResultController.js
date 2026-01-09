import Result from "../models/resultModel.js";
import mongoose from "mongoose";

export async function createResult(req, res) {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
    
    const { title, technology, level, totalQuestions, correct, wrong } = req.body;
    
    if (
      !technology ||
      !level ||
      totalQuestions === undefined ||
      correct === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing fields",
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Missing title",
      });
    }

    const computeWrong =
      wrong !== undefined
        ? Number(wrong)
        : Math.max(0, Number(totalQuestions) - Number(correct));

    const payload = {
      title: String(title).trim(),
      technology,
      level,
      totalQuestions: Number(totalQuestions),
      correct: Number(correct),
      wrong: computeWrong,
      user: req.user._id, 
    };

    const created = await Result.create(payload);
    return res.status(201).json({
        success:true,
        message:"Result Created",
        result: created
    })

  } 
  
    catch (error) {
     console.error('Create result error:', error.message);
     return res.status(500).json({
        success:false,
        message:'Server Error',
        error: error.message
     })
  }
}

// LIST THE RESULT
export async function listResults(req,res) {
    try{
    if(!req.user || !req.user._id){
        return res.status(401).json({
            success:false,
            message: 'Not authorized'
        })
    }
    
    const {technology} = req.query;
    const query = { user: new mongoose.Types.ObjectId(req.user._id) };
    
    if(technology && technology.toLowerCase() != 'all'){
        query.technology = technology;
    }

    const items = await Result.find(query).sort({createdAt: -1}).lean();
    
    return res.json({
        success:true,
        results: items
    })
    }

    catch(error){
       console.error('List results error:', error.message);
     return res.status(500).json({
        success:false,
        message:'Server Error'
     })
    }
}

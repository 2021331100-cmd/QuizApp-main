import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoutes.js';
import resultRouter from './routes/resultRoutes.js';
import quizRouter from './routes/quizRoutes.js';
import leaderboardRouter from './routes/leaderboardRoutes.js';
import aiRouter from './routes/aiRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const port = 4000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// DB
connectDB();

// ROUTES
app.use('/api/auth',userRouter);
app.use('/api/results',resultRouter);
app.use('/api/quizzes',quizRouter);
app.use('/api/leaderboard',leaderboardRouter);
app.use('/api/ai',aiRouter);

app.get('/',(req,res) => {
    res.send("API WORKING");
});

// Error Handler Middleware - Must be last
app.use(errorHandler);

app.listen(port,() => {
    console.log(`Server Started on https:/localhost:${port}`);
})
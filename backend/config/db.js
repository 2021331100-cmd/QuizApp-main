import mongoose from 'mongoose';

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://pillowtalkerarian_db_user:quizapp123@cluster0.yov5ts1.mongodb.net/QuizApp')
    .then(() =>{console.log('DB CONNECTED')})
}
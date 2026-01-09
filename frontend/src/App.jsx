import React from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Signup from './components/Signup'
import MyResultPage from './pages/MyResultPage'
import CreateQuiz from './components/CreateQuiz'
import QuizList from './components/QuizList'
import TakeQuiz from './components/TakeQuiz'
import Leaderboard from './components/Leaderboard'

// private protected route
function RequireAuth({children}) {
  const isLoggedIn = Boolean(localStorage.getItem("authToken"));
  const location = useLocation();

  if(!isLoggedIn) {
    return <Navigate to='/login' state={{from:location}} replace/>;
  }

  return children;
}

const App = () => {
  return (
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/quizzes' element={<QuizList/>} />
        <Route path='/quiz/:id' element={<TakeQuiz/>} />
        <Route path='/leaderboard' element={<Leaderboard/>} />
        <Route 
        path='/result'
         element={
         <RequireAuth>
          <MyResultPage />
         </RequireAuth>
         } 
         />
        <Route 
        path='/create-quiz'
         element={
         <RequireAuth>
          <CreateQuiz />
         </RequireAuth>
         } 
         />
      </Routes>
  );
};

export default App;

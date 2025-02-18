import './App.css';
import Chat from './Components/Chat';
import Login from './Components/Login';
import SignIn from './Components/Signin'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Router, Routes, Navigate } from 'react-router-dom'
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/chat' element={<Chat/>} ></Route>
          <Route path='/signin' element={<SignIn/>} ></Route>
          <Route path='/login' element={<Login/>} ></Route>
          <Route path = '*' element={<Navigate to="/login" />} ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

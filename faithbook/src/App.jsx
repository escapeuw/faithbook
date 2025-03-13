import { useEffect, useState } from 'react'
import "/src/components/ui.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import { ToastContainer } from 'react-toastify';
import { PostProvider } from "./PostContext";



function App() {


  return (
    <BrowserRouter basename='/'>
      <div>
        <ToastContainer position="top-center" autoClose={7000} hideProgressBar={true} />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home/*" element={<PostProvider><Home /></PostProvider>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

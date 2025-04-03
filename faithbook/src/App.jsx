import { useEffect, useState } from 'react'
import "/src/components/ui.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import { ToastContainer } from 'react-toastify';
import { PostProvider } from "./PostContext";
import { AuthProvider, useAuth } from "./AuthProvider";

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" />;
  }
  return element;
};

function App() {

  return (
    <BrowserRouter basename='/'>

      <div className="app">
        <ToastContainer position="top-center" autoClose={7000} hideProgressBar={true} />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/home/*"
            element={
              <AuthProvider>
                <ProtectedRoute element={<PostProvider><Home /></PostProvider>} />
              </AuthProvider>
            }
          />
        </Routes>
      </div>

    </BrowserRouter>

  );
}

export default App

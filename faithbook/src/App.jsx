import { useEffect, useState } from 'react'
import "/src/components/ui.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import { ToastContainer } from 'react-toastify';
import { PostProvider } from "./PostContext";
import axios from "axios";


function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const response = await axios.get("https://faithbook-production.up.railway.app/verify-token", {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.data.valid) {
            setIsAuth(true);
          } else {
            localStorage.removeItem("token"); // remove invalid token
            setIsAuth(false);
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          localStorage.removeItem("token");
          setIsAuth(false);
        }
      }
    };

    checkToken();
  }, []);

  return (
    <BrowserRouter basename='/'>
      <div>
        <ToastContainer position="top-center" autoClose={7000} hideProgressBar={true} />
        <Routes>
          <Route path="/" element={isAuth ? <Navigate to="/home" /> : <Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home/*" element={isAuth ? <PostProvider><Home /></PostProvider> : < Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

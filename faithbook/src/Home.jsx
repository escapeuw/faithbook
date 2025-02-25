import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Feed from "./pages/Feed.jsx";
import Profile from "./pages/Profile.jsx";

function Home() {

  return (
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
        </Routes> 
      </div>
  )
}

export default Home

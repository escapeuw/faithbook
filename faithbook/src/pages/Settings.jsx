import { useEffect, useState } from "react";
import "/src/components/ui.css";
import { useNavigate } from 'react-router-dom';


function Settings() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/") // Redirects to login page
    }

    return (
        <div className="wrapper">
            <div className="settings-container">
                <div onClick={handleLogout}
                style={{ border: "1px solid black", cursor: "pointer" }}>Logout</div>
            </div>

        </div>
    )
}

export default Settings;
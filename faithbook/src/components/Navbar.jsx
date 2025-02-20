import { Bell, Home, Settings, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "./ui.css";


function Navbar() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;
    return (
        <nav className="nav-main">
            <div className="nav-container">
                <div className="flex" style={{ height: "4rem" }}>
                    <Link to="/home" className="faithbook-accent deco-none">
                        Faithbook
                    </Link>
                    <div className="flex nav-icon-container">
                        <Link to="/home" className="deco-none nav-icon">
                            <Home style={{
                                height: "1.5rem", width: "1.5rem",
                                color: isActive("/home") ? "#9b87f5" : ""
                            }} />
                        </Link>
                        <Link to="/home/notifications" className="deco-none nav-icon">
                            <Bell style={{
                                height: "1.5rem", width: "1.5rem",
                                color: isActive("/home/notifications") ? "#9b87f5" : ""
                            }} />
                        </Link>
                        <Link to="/home/profile" className="deco-none nav-icon">
                            <User style={{
                                height: "1.5rem", width: "1.5rem",
                                color: isActive("/home/profile") ? "#9b87f5" : ""
                            }} />
                        </Link>
                        <Link to="/home/settings" className="deco-none nav-icon">
                            <Settings style={{
                                height: "1.5rem", width: "1.5rem",
                                color: isActive("/home/settings") ? "#9b87f5" : ""
                            }} />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
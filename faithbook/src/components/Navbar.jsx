import { Bell, Home, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
import "./ui.css";


function Navbar() {
    return (
        <nav className="nav-main">
            <div className="nav-container">
                <div className="flex" style={{ height: "4rem"}}>
                    <Link to="/" className="faithbook-accent deco-none">
                        Faithbook
                    </Link>
                    <div className="flex nav-icon-container">
                        <Link to="/feed" className="deco-none nav-icon">
                            <Home style={{ height: "1.5rem", width: "1.5rem" }} />
                        </Link>
                        <Link to="/notifications" className="deco-none nav-icon">
                            <Bell style={{ height: "1.5rem", width: "1.5rem" }} />
                        </Link>
                        <Link to="/profile" className="deco-none nav-icon">
                            <User style={{ height: "1.5rem", width: "1.5rem" }} />
                        </Link>
                        <Link to="/settings" className="deco-none nav-icon">
                            <Settings style={{ height: "1.5rem", width: "1.5rem" }} />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
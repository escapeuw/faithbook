import { Bell, Home, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";


function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-2xl font-semibold text-faithbook-accent">
                        Faithbook
                    </Link>
                    <div className="flex items-center space-x-6">
                        <Link to="/feed" className="text-gray-600 hover:text-faithbook-accent">
                            <Home className="h-6 w-6" />
                        </Link>
                        <Link to="/notifications" className="text-gray-600 hover:text-faithbook-accent">
                            <Bell className="h-6 w-6" />
                        </Link>
                        <Link to="/profile" className="text-gray-600 hover:text-faithbook-accent">
                            <User className="h-6 w-6" />
                        </Link>
                        <Link to="/settings" className="text-gray-600 hover:text-faithbook-accent">
                            <Settings className="h-6 w-6" />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;
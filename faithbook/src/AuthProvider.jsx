import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setIsAuthenticated(false);
            return;
        }

        try {
            const decodedToken = jwtDecode(token);

            if (decodedToken.exp * 1000 < Date.now()) {
                console.log("Token expired. Logging out...");
                localStorage.removeItem("token");
                setIsAuthenticated(false);
                navigate("/");
            } else {
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error("Invalid token:", error);
            localStorage.removeItem("token");
            setIsAuthenticated(false);
            navigate("/");
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

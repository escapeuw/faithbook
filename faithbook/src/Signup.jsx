import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Signup () {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent form from reloading the page on submit

    setIsLoading(true); // set loading true

    // send data 

    const userData = { name, email, password, confirmPassword, title };

    try {
      // send POST request to backend API
      const response = await fetch("https://faithbook-production.up.railway.app/api/signup", { //change link when hosting finishes
        method: "POST",
        headers: {
          "Content-Type": "application/json", //sending JSON data
        },
        body: JSON.stringify(userData), // send user data as JSON string
      });

      // handle the response from the server
      const data = await response.json();

      if (response.ok) {
        // singup success , do something maybe redirect back to login
        console.log("Signup successful:", data);
      } else {
        // signup fail
        console.error("Signup failed:", data.message);
      } 
    } catch (error) {
      // network or unexpected errors
      console.error("Error during signup", error);
    } finally {
      setIsLoading(false); // reset loading state, not loading anymore
    } 
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>Create Account</h1>
          <p>Join Faithbook today</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <div className="input-wrapper">
              <i className="fa-solid fa-user"></i>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                required
              />
            </div>

            <div className="input-wrapper">
              <i className="fa fa-envelope"></i>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
              />
            </div>

            <div className="input-wrapper">
              <i className="fa-solid fa-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
              </button>
            </div>

            <div className="input-wrapper">
              <i className="fa-solid fa-lock"></i>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="password-toggle"
              >
                <i className={showConfirmPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
              </button>
            </div>

            <div className="input-wrapper">
              <select value={title} onChange={(e) => setTitle(e.target.value)} required className="dropdown">
                <option value="" disabled>Select your title</option>
                <option value="a">skeptic</option>
                <option value="b">seeker</option>
                <option value="c">doubting believer</option>
                <option value="d">committed believer</option>
              </select>
            </div>

          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`submit-button ${isLoading ? "loading" : ""}`}
          >
            {isLoading ? (
              <span className="loading-text">
                <div className="spinner"></div>
                Creating account...
              </span>
            ) : (
              "Create account"
            )}
          </button>

          <p className="login-text">
            Already have an account?{" "}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
            >
              Sign in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
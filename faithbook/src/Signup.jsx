import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleHelp, Search, MessageCircleMore, MessageCircleHeart } from "lucide-react";
import "./Login.css";
import { toast } from "react-toastify"; // import toast
import "react-toastify/dist/ReactToastify.css"; // import toast styles

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent form from reloading the page on submit

    if (step === 1) {
      // Move to title selection step
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      } else if (password.length < 7) {
        toast.error("Password must be at least 7 characters long");
        return;
      } else if (password.length > 14) {
        toast.error("Password must be less than 15 characters");
        return;
      }

      setStep(2);

    } else {
      // submit the form (step 2)
      if (title === "") {
        toast.error("Please select your title");
        return;
      }

      setIsLoading(true); // set loading true

      // send data 

      const userData = { username, email, password, confirmPassword, title };

      try {
        // send POST request to backend API
        const response = await fetch("https://faithbook-production.up.railway.app/signup", { //change link when hosting finishes
          method: "POST",
          headers: {
            "Content-Type": "application/json", //sending JSON data
          },
          body: JSON.stringify(userData), // send user data as JSON string
        });

        // handle the response from the server
        const data = await response.json();

        if (response.ok) {
          // signup success , do something maybe redirect back to login
          toast.success("Successfully signed up!");
          navigate("/");

        } else {
          // signup fail
          toast.error(`Signup failed: ${data.message}`);
        }
      } catch (error) {
        // network or unexpected errors
        toast.error(`Something went wrong, please try again later: , ${error}`);
      } finally {
        setIsLoading(false); // reset loading state, not loading anymore
      }
    };
  };

  const titleOptions = [
    {
      id: "skeptic",
      icon: (<CircleHelp />),
      label: "Skeptic",
      description: "You have doubts and have questions about the Christian faith."
    },
    {
      id: "seeker",
      icon: (<Search />),
      label: "Seeker",
      description: "You are a new believer open to exploring and discovering more. "
    },
    {
      id: "doubting-believer",
      icon: (<MessageCircleMore />),
      label: "Doubting Believer",
      description: "You believe but struggle with uncertainties and/or lack of personal experience. "
    },
    {
      id: "committed-believer",
      icon: (<MessageCircleHeart />),
      label: "Committed Believer",
      description: "You have a personal relationship with God and are devoted in your daily spiritual walk."
    }
  ];

  return (
    <div className="signup-container">
      <div className="signup-card">
        {step === 1 && (
          <div className="signup-header">
            <h1>Create Account</h1>
            <p>Join Faithbook today</p>
          </div>
        )}
        {step === 2 && (
          <div className="signup-header">
            <h1>Select your Title</h1>
            <p>Your title describes your <em style={{ fontWeight: "bold" }}>current </em>
              journey of faith. <br />
              <em style={{ fontSize: "0.75rem" }}>* This may change and you can update this in your settings later on.</em>
            </p></div>
        )}

        <form onSubmit={handleSubmit} className="signup-form">

          {step === 1 && (
            <div className="form-group">
              <div className="input-wrapper">
                <i className="fa-solid fa-user"></i>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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

              <button type="submit" className="submit-button">
                Next
              </button>
            </div>
          )}


          {step === 2 && (
            <div className="form-group">
              <div className="title-selection">
                {titleOptions.map((option) => (
                  <div key={option.id}
                    className={`title-option ${title === option.id ? "selected" : ""}`}
                    onClick={() => setTitle(option.id)}
                  >
                    <i>{option.icon}</i>
                    <div className="option-description">
                      <h3>{option.label}</h3>
                      <p>{option.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button type="button" onClick={() => setStep(1)} className="back-button">
                Back
              </button>

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
            </div>
          )}


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
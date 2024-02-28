// login.tsx
import SlideShow from "../../components/SlideShow";
import "./Login.css";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const images = [
    "/mancare1.jpg",
    "/prajitura1.jpg",
    "/prajitura2.jpg",
    "/mancare2.jpg",
    "/mancare3.jpg",
    "/prajitura3.webp",
  ];

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login">
      <div className="slideShow">
        <SlideShow images={images} />
      </div>
      <div className="login-container">
        <div className="login-form">
          <h2>Login</h2>
          <form>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" />
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
              />
              <span
                onClick={togglePasswordVisibility}
                className="password-toggle-text"
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
        <br />
        <Link to="/register" className="joinButton">
          Don't have an account? Join now!
        </Link>
      </div>
    </div>
  );
}

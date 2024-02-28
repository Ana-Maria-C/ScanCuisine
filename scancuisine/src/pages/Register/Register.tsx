// login.tsx
import SlideShow from "../../components/SlideShow";
import "../Login/Login.css";
import { useState } from "react";

export default function Register() {
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
      <div className="login-container">
        <div className="login-form">
          <h2>Register</h2>
          <form>
            <label htmlFor="FirstName">First Name</label>
            <input type="text" id="FirstName" name="FirstName" />
            <label htmlFor="LastName">Last Name</label>
            <input type="text" id="LastName" name="LastName" />
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
            <button type="submit">Register</button>
          </form>
        </div>
      </div>
      <div className="slideShow">
        <SlideShow images={images} />
      </div>
    </div>
  );
}

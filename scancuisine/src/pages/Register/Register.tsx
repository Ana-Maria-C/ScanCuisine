// login.tsx
import SlideShow from "../../components/SlideShow";
import "./Register.css";
import { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { message } from "antd";

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
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const userData = {
      firstName: formData.get("FirstName"),
      lastName: formData.get("LastName"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const response = await axios.post(
        "http://localhost:8090/api/auth/register",
        userData
      );
      console.log(response.data); // Handle successful registration response
      if (response.data.errorMessage === null) {
        setRegistrationSuccess(true);
      } else {
        message.error(response.data.errorMessage);
      }
    } catch (error) {
      console.error("Registration failed:", (error as Error).message); // Handle registration error
    }
  };

  if (registrationSuccess) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="register">
      <div className="register-container">
        <div className="register-form">
          <h2>Register</h2>
          <form className="login-form-fields" onSubmit={handleSubmit}>
            <input type="text" placeholder="FirstName" name="FirstName" />
            <input type="text" placeholder="LastName" name="LastName" />
            <input type="email" placeholder="Email" name="email" />
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
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

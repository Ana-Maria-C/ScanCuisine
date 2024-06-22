// login.tsx
import SlideShow from "../../components/SlideShow";
import "./Login.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { message } from "antd";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setloginSuccess] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8090/api/auth/authenticate",
        {
          email,
          password,
        }
      );

      console.log("Login successful, token: ", response.data);
      console.log("response from login", response.data.errorMessage);
      if (response.data.errorMessage === null) {
        localStorage.setItem("token", response.data["token"]);
        setloginSuccess(true);
      } else {
        message.error(response.data.errorMessage);
      }
    } catch (error) {
      console.error("Login failed:", (error as Error).message);
      // Handle login failure, such as displaying an error message to the user
    }
  };

  if (loginSuccess) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="login">
      <div className="slideShow">
        <SlideShow images={images} />
      </div>
      <div className="login-container">
        <div className="login-form">
          <h2>Login</h2>
          <form className="login-form-fields" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

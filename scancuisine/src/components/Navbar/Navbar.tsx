import React, { useState, useEffect } from "react";
import { Menu, Button, Input, message } from "antd";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  SearchOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const [visible, setVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = localStorage.getItem("token");
  const [searchValue, setSearchValue] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }

    const handleMouseMove = (event: MouseEvent) => {
      const yPos = event.clientY;
      setVisible(yPos < 60);
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    console.log("Logout successful");
    navigate("/login");
  };

  const handleSearchEnter = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      const inputElement = e.target as HTMLInputElement;
      const recipeName = inputElement.value.trim();
      //console.log("Text introdus în căutare:", recipeName);
      if (recipeName.length > 0) {
        try {
          localStorage.setItem("searchQuery", recipeName);
          inputElement.value = "";
          navigate(`/search`);
          setSearchValue("");
        } catch (error) {
          console.error("Error navigating to search page:", error);
          message.error("Failed to perform search. Please try again.");
        }
      } else {
        message.warning("Please enter a valid recipe name.");
      }
    }
  };

  return (
    <Menu mode="horizontal" className={`navbar ${visible ? "" : "hidden"}`}>
      <Menu.Item key="home">
        <Link to="/home">Scan Cuisine</Link>
      </Menu.Item>
      <Menu.Item key="search" className="search-input">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Find a recipe"
          onPressEnter={handleSearchEnter}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </Menu.Item>
      <Menu.Item key="categories">
        <Link to="">Categories</Link>
      </Menu.Item>
      <Menu.Item key="cuisines">
        <Link to="">Cuisines</Link>
      </Menu.Item>
      <Menu.Item key="scan" className="camera-scan">
        <CameraOutlined />
      </Menu.Item>
      {isLoggedIn ? (
        <>
          <Menu.Item key="logout" className="logout" onClick={handleLogout}>
            <Link to="">Log Out</Link>
          </Menu.Item>
          <Menu.Item key="profile" className="myprofile">
            <Link to="/myprofile">
              <Button icon={<UserOutlined />} key="My Profile"></Button>
            </Link>
          </Menu.Item>
        </>
      ) : (
        <Menu.Item key="login" className="logout">
          <Link to="/login">Log In</Link>
        </Menu.Item>
      )}
      <Menu.Item key="about">
        <Link to="/about">About Us</Link>
      </Menu.Item>
    </Menu>
  );
}

export default Navbar;

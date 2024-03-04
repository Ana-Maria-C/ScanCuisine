import React, { useState, useEffect } from "react";
import { Menu, Button, Input } from "antd";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  SearchOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import "./Navbar.css";

function Navbar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const yPos = event.clientY;
      setVisible(yPos < 30);
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  return (
    <Menu mode="horizontal" className={`navbar ${visible ? "" : "hidden"}`}>
      <Menu.Item key="home">
        <Link to="/home">Scan Cuisine</Link>
      </Menu.Item>
      <Menu.Item key="search" className="search-input">
        <Input
          prefix={<SearchOutlined />}
          placeholder="Find a recipe"
          // Adaugă orice alte proprietăți sau stiluri aici
        />
      </Menu.Item>
      <Menu.Item key="scan" className="camera-scan">
        <CameraOutlined />
      </Menu.Item>
      <Menu.Item key="profile" className="myprofile">
        <Link to="/myprofile">
          <Button icon={<UserOutlined />} key="My Profile"></Button>
        </Link>
      </Menu.Item>
      <Menu.Item key="about">
        <Link to="/about">About Us</Link>
      </Menu.Item>
    </Menu>
  );
}

export default Navbar;

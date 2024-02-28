import React, { useState, useEffect } from "react";
import { Menu, Button, Input } from "antd";
import { Link } from "react-router-dom";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import "./Navbar.css";

function Navbar() {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(
        (prevScrollPos > currentScrollPos &&
          prevScrollPos - currentScrollPos > 70) ||
          currentScrollPos < 10
      );
      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos, visible]);

  useEffect(() => {
    // Ascunde bara de navigare la încărcarea paginii
    setVisible(false);
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

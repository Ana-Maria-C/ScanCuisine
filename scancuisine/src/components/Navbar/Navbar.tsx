import React, { useState, useEffect } from "react";
import { Menu, Button, Input, message, Modal } from "antd";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  SearchOutlined,
  CameraOutlined,
  ChromeOutlined,
} from "@ant-design/icons";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { SubMenu } = Menu;

interface Category {
  id: string;
  name: string;
  recipeIds: string[];
}

interface Cuisine {
  id: string;
  name: string;
  recipeIds: string[];
}

function Navbar() {
  const [visible, setVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = localStorage.getItem("token");
  const [searchValue, setSearchValue] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [cameraVisible, setCameraVisible] = useState(false);

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

  useEffect(() => {
    axios
      .get("http://localhost:8090/api/category/all")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch categories:", error);
        message.error("Failed to fetch categories. Please try again.");
      });
    // fetch cuisines
    axios
      .get("http://localhost:8090/api/cuisine/all")
      .then((response) => {
        setCuisines(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch cuisines:", error);
        message.error("Failed to fetch cuisines. Please try again.");
      });
  }, [isPopupOpen]);

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
      //console.log("Text introdus în cautare:", recipeName);
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

  const handleMenuClickCategory = (category: Category) => {
    navigate(`/category/${category.name}`);
  };

  const handleMenuClickCuisine = (cuisine: Cuisine) => {
    navigate(`/cuisine/${cuisine.name}`);
  };

  const openCamera = () => {
    setCameraVisible(true);
  };

  const closeCamera = () => {
    setCameraVisible(false);
    let video = document.querySelector("video");
    if (video && video.srcObject) {
      let stream = video.srcObject as MediaStream;
      let tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  useEffect(() => {
    if (cameraVisible) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          let video = document.querySelector("video");
          if (video) {
            video.srcObject = stream;
            video.play();
          }
        })
        .catch((error) => {
          console.error("Error accessing camera:", error);
          message.error("Failed to access camera. Please try again.");
        });
    }
  }, [cameraVisible]);

  return (
    <>
      <Menu
        mode="horizontal"
        className={`navbar ${visible || isPopupOpen ? "" : "hidden"}`}
      >
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
        <SubMenu
          key="categories"
          title={<span className="categories-submenu">Categories</span>}
          popupClassName="categories-popup"
        >
          {categories.map((category) => (
            <Menu.Item
              key={category.id}
              onClick={() => handleMenuClickCategory(category)}
              onMouseEnter={() => setIsPopupOpen(true)}
              onMouseLeave={() => setIsPopupOpen(false)}
            >
              {category.name}
            </Menu.Item>
          ))}
        </SubMenu>
        <SubMenu
          key="cuisines"
          title={<span className="categories-submenu">Cuisines</span>}
          popupClassName="cuisines-popup"
        >
          {cuisines.map((cuisine) => (
            <Menu.Item
              key={cuisine.id}
              onClick={() => handleMenuClickCuisine(cuisine)}
              onMouseEnter={() => setIsPopupOpen(true)}
              onMouseLeave={() => setIsPopupOpen(false)}
            >
              {cuisine.name}
            </Menu.Item>
          ))}
        </SubMenu>
        <Menu.Item key="scan" className="camera-scan" onClick={openCamera}>
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
      <Modal
        className="camera-modal"
        title="Scan your fridge..."
        visible={cameraVisible}
        onCancel={closeCamera}
        footer={null}
      >
        <video className="camera-modal-video"></video>
        <div className="camera-modal-footer">
          <button className="camera-modal-button"></button>
          <button className="camera-modal-action-button"></button>
        </div>
      </Modal>
    </>
  );
}

export default Navbar;

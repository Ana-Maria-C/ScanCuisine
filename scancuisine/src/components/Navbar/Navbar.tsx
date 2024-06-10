import React, { useState, useEffect, useRef } from "react";
import { Menu, Button, Input, message, Modal } from "antd";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  SearchOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../../firebase";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [imageUrl, setImageUrl] = useState<string>("");

  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [title, setTitle] = useState<string>("Scan your fridge...");

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
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  useEffect(() => {
    if (cameraVisible) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch((error) => {
          console.error("Error accessing camera:", error);
          message.error("Failed to access camera. Please try again.");
        });
    }
  }, [cameraVisible]);

  const captureImage = async () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(async (blob) => {
          if (blob) {
            await uploadToStorage(blob);
            // Închideți camera după încărcarea imaginii
            closeCamera();
            // Setează conținutul modalului cu un video de la o adresă URL specificată
            setTitle("Searching for recipes...");
            setModalContent(
              <img
                className="camera-modal-image"
                src="https://firebasestorage.googleapis.com/v0/b/scan-cuisine-f4b13.appspot.com/o/gif%2Fsearch_recipe_gif_123456789.gif?alt=media&token=641005bd-0ddf-4720-a79d-d5e672e49d20"
                alt="Recipe GIF"
              />
            );
          }
        }, "image/jpeg");
      }
    }
  };

  const uploadToStorage = async (blob: Blob) => {
    const formData = new FormData();
    // generate a unique image name
    const imageName = `$image_${uuidv4()}`;
    formData.append("file", blob, imageName);
    console.log("formData", formData.values);
    try {
      // Crearea unei referințe de stocare
      const imageRef = ref(storage, `scanImages/${imageName}`);
      // Încărcați fișierul în storage
      const snapshot = await uploadBytes(imageRef, blob);

      // După ce încărcarea a fost finalizată cu succes, obțineți URL-ul de descărcare
      const imageUrlDownload = await getDownloadURL(imageRef);

      console.log("image url", imageUrlDownload);
      /* message.success("Image uploaded successfully!");*/
    } catch (error) {
      console.error("Error uploading image:", error);
      message.error("Failed to upload image. Please try again.");
    }
  };

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
        title={title}
        visible={cameraVisible || modalContent !== null}
        onCancel={() => {
          setCameraVisible(false);
          setModalContent(null);
          setTitle("Scan your fridge...");
        }}
        footer={null}
      >
        {modalContent || (
          <video ref={videoRef} className="camera-modal-video"></video>
        )}
        {!modalContent && (
          <div className="camera-modal-footer">
            <button
              className="camera-modal-button"
              onClick={captureImage}
            ></button>
            <button
              className="camera-modal-action-button"
              onClick={captureImage}
            ></button>
          </div>
        )}
      </Modal>
    </>
  );
}

export default Navbar;

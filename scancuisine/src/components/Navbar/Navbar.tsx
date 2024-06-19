import React, { useState, useEffect, useRef } from "react";
import { Menu, Button, Input, message, Modal, Drawer } from "antd";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  SearchOutlined,
  CameraOutlined,
  MenuOutlined,
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

interface Recipe {
  id: string;
  authorEmail: string;
  name: string;
  ingredients: string[];
  preparationMethod: string;
  imageUrl: string;
  category: string;
  cuisine: string;
  videoUrl: string;
  commentId: string[];
  likes: number;
}

interface Ingredient {
  aisle: string[];
  amount: number;
  consistency: string;
  id: number;
  image: string;
  measures: {};
  meta: string[];
  name: string;
  nameClean: string;
  original: string;
  originalName: string;
  unit: string;
}

function Navbar() {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [visible, setVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = localStorage.getItem("token");
  const [searchValue, setSearchValue] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [cameraVisible, setCameraVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [title, setTitle] = useState<string>("Scan your fridge...");
  const [ingredients, setIngredients] = useState<string[]>([
    "milk",
    "sugar",
    "eggs",
    "jam",
    "flour",
  ]);

  const XRapidAPIKey = "75af58f578msh272dfd8ac1822c4p150537jsn4d64d2cb298b";
  const [showViewRecipeButton, setShowViewRecipeButton] = useState(false);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const navigate = useNavigate();

  const getEmail = async () => {
    const myToken = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:8090/api/users/token/${myToken}`
    );
    return response.data.email;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("token", token);
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
    closeDrawer();
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    console.log("Logout successful");
    navigate("/login");
  };

  const handleSearchEnter = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    closeDrawer();
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
    closeDrawer();
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
          }
        }, "image/jpeg");
      }
    }
  };

  const uploadToStorage = async (blob: Blob) => {
    const userEmail = await getEmail();
    console.log("email", userEmail);
    const formData = new FormData();

    // generate a unique image name
    const imageName = `$image_${uuidv4()}`;
    formData.append("file", blob, imageName);
    try {
      // Crearea unei referințe de stocare
      const imageRef = ref(storage, `scanImages/${imageName}`);
      // Încărcați fișierul în storage
      const snapshot = await uploadBytes(imageRef, blob);

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

      // După ce încărcarea a fost finalizată cu succes, obțineți URL-ul de descărcare
      const imageUrlDownload = await getDownloadURL(imageRef);
      console.log("image url", imageUrlDownload);

      // sterg retetele pe baza ngredientelor anterioare
      const response_delete = await axios.delete(
        `http://localhost:8090/api/recipe-based-on-ingredients/${userEmail}`
      );

      // trimit url imagine catre api-ul de scanare a imaginii
      const options_1 = {
        method: "POST",
        url: "https://image-describing-ai-visual-decoder.p.rapidapi.com/describe_image",
        headers: {
          "content-type": "application/json",
          "Content-Type": "application/json",
          "X-RapidAPI-Key": XRapidAPIKey,
          "X-RapidAPI-Host":
            "image-describing-ai-visual-decoder.p.rapidapi.com",
        },
        data: {
          image_url: imageUrlDownload,
          question: "What ingredients do you recognize in the image?",
        },
      };

      try {
        const response = await axios.request(options_1); //--decomenteaza
        console.log("ingrediente recunoscute: ", response.data.response); //--decomenteaza
        //extract ingredients from response
        const ingredients = response.data.response; //--decomenteaza
        setIngredients(ingredients); //--decomenteaza
      } catch (error) {
        console.error(error);
      }

      // get recipes based on ingredients
      const ingredients_to_string = ingredients.join(",");

      const options_2 = {
        method: "GET",
        url: "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients",
        params: {
          ingredients: ingredients_to_string,
          number: "8",
          ignorePantry: "true",
          ranking: "1",
        },
        headers: {
          "X-RapidAPI-Key": XRapidAPIKey,
          "X-RapidAPI-Host":
            "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
        },
      };
      const response = await axios.request(options_2);
      console.log("recipe based on ingredients", response.data);

      // get the recommended recipes based on the ids

      // extrag id -ul pentru fiecare reteta
      const ids = [];

      for (let element of response.data) {
        ids.push(element.id);
      }
      console.log("ids", ids);

      // extrag informatiile pentru fiecare reteta pe baza id-ului
      for (let id of ids) {
        const options = {
          method: "GET",
          url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${id}/information`,
          headers: {
            "X-RapidAPI-Key": XRapidAPIKey,
            "X-RapidAPI-Host":
              "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
          },
        };

        const response = await axios.request(options);
        //console.log("info recipe based on id", response.data);

        // postez reteta in baza de date folosind informatiile extrase de mai sus
        let preparationMethodforRecommendedRecipe = response.data.instructions;
        if (preparationMethodforRecommendedRecipe === null) {
          preparationMethodforRecommendedRecipe = response.data.summary;
        }
        const newRecipe = {
          id: "",
          authorEmail: userEmail,
          name: response.data.title,
          ingredients: response.data.extendedIngredients.map(
            (ingredient: Ingredient) => ingredient.name
          ),
          preparationMethod: preparationMethodforRecommendedRecipe,
          imageUrl: response.data.image,
          category: response.data.dishTypes[0],
          cuisine: response.data.cuisines[0],
          videoUrl: "",
          commentId: [],
          likes: 0,
          datePosted: new Date(),
        };
        console.log("new recipe", newRecipe);
        // post the recipe to the database
        const postRecipe = await axios.post(
          "http://localhost:8090/api/recipe-based-on-ingredients",
          newRecipe
        );
        console.log(
          "Response from adding recipe based on ingredients:",
          postRecipe
        );
      }
      setShowViewRecipeButton(true);
      // final
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
        <Menu.Item
          key="hamburger"
          className="hamburger-menu hidden-desktop"
          onClick={showDrawer}
        >
          <MenuOutlined className="hidden-desktop" />
        </Menu.Item>
        <Menu.Item key="home">
          <Link to="/home" className="navbar-home">
            Scan Cuisine
          </Link>
        </Menu.Item>
        <Menu.Item key="search" className="search-input hidden-mobile">
          <Input
            className="hidden-mobile"
            prefix={<SearchOutlined />}
            placeholder="Find a recipe"
            onPressEnter={handleSearchEnter}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </Menu.Item>
        <SubMenu
          key="categories"
          title={
            <span className="categories-submenu hidden-mobile">Categories</span>
          }
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
          title={
            <span className="categories-submenu hidden-mobile">Cuisines</span>
          }
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

        <Menu.Item
          key="scan"
          className="camera-scan hidden-mobile"
          onClick={openCamera}
        >
          <CameraOutlined className="hidden-mobile" />
        </Menu.Item>
        {isLoggedIn ? (
          <>
            <Menu.Item
              key="logout"
              className="logout hidden-mobile"
              onClick={handleLogout}
            >
              <Link to="" className="hidden-mobile">
                Log Out
              </Link>
            </Menu.Item>
            <Menu.Item key="profile" className="myprofile hidden-mobile">
              <Link to="/myprofile" className="hidden-mobile">
                <Button
                  icon={<UserOutlined hidden-mobile />}
                  key="My Profile"
                ></Button>
              </Link>
            </Menu.Item>
          </>
        ) : (
          <Menu.Item key="login" className="logout hidden-mobile">
            <Link to="/login" className="hidden-mobile">
              Log In
            </Link>
          </Menu.Item>
        )}
        <Menu.Item key="about hidden-mobile">
          <Link to="/about" className="hidden-mobile">
            About Us
          </Link>
        </Menu.Item>
      </Menu>
      <Modal
        className="camera-modal"
        title={title}
        visible={cameraVisible || modalContent !== null}
        onCancel={() => {
          closeCamera();
          setCameraVisible(false);
          setModalContent(null);
          setTitle("Scan your fridge...");
          setShowViewRecipeButton(false);
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
        {showViewRecipeButton === true && (
          <button className="view_recipe_based_on_ingredients">
            <a
              className="view_recipe_based_on_ingredients_link"
              href="/recipe_from_api"
            >
              View recipe
            </a>
          </button>
        )}
      </Modal>
      <Drawer
        title={<span className="drawer-title">Scan Cuisine</span>}
        placement="left"
        onClose={closeDrawer}
        visible={drawerVisible}
        className="drawer"
      >
        <Menu mode="vertical" className="drawer">
          <Menu.Item key="search-drawer">
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
            title={<span className="categories-drawer">Categories</span>}
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
            title={<span className="categories-drawer">Cuisines</span>}
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
          <Menu.Item
            key="scan"
            className="camera-scan-drawer"
            onClick={openCamera}
          >
            <CameraOutlined className="camera-scan-drawer" />
          </Menu.Item>
          {isLoggedIn ? (
            <>
              <Menu.Item
                key="logout"
                className="logout-drawer"
                onClick={handleLogout}
              >
                <Link to="">Log Out</Link>
              </Menu.Item>
              <Menu.Item key="profile" className="myprofile-drawer">
                <Link to="/myprofile" onClick={closeDrawer}>
                  <div>
                    <span key="My Profile">
                      {<UserOutlined className="myprofile-drawer" />}
                    </span>
                  </div>
                </Link>
              </Menu.Item>
            </>
          ) : (
            <Menu.Item key="login" className="logout-drawer">
              <Link to="/login" onClick={closeDrawer}>
                Log In
              </Link>
            </Menu.Item>
          )}
          <Menu.Item key="about-drawer">
            <Link to="/about" onClick={closeDrawer} className="about-drawer">
              About Us
            </Link>
          </Menu.Item>
        </Menu>
      </Drawer>
    </>
  );
}

export default Navbar;

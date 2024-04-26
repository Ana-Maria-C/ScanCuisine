import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import "./AddRecipeModal.css";
import axios from "axios";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";
import { Select, message } from "antd";

const { Option } = Select;

interface AddRecipeModalProps {
  visible: boolean;
  onCancel: () => void;
  onRecipeAdded: () => void;
  authorEmail: string;
}

interface RecipeData {
  id: string;
  authorEmail: string;
  name: string;
  ingredients: string[];
  preparationMethod: string;
  imageUrl: String | null;
  category: string;
  cuisine: string;
  videoUrl: String | null;
  commentId: string[];
}

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

function AddRecipeModal({
  visible,
  onCancel,
  onRecipeAdded,
  authorEmail,
}: AddRecipeModalProps) {
  const [recipeData, setRecipeData] = useState<RecipeData>({
    id: "",
    authorEmail: authorEmail,
    name: "",
    ingredients: [],
    preparationMethod: "",
    imageUrl: null,
    category: "",
    cuisine: "",
    videoUrl: null,
    commentId: [],
  });

  const [inputCategoryValue, setInputCategoryValue] = useState("");
  const [inputCuisineValue, setInputCuisineValue] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);

  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [cuisineList, setCuisineList] = useState<string[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8090/api/category/all"
      );
      setCategories(response.data);
      // setCategoryList to an empty array to clear the previous category list
      setCategoryList([]);
      setCategoryList(response.data.map((category: Category) => category.name));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCuisines = async () => {
    try {
      const response = await axios.get("http://localhost:8090/api/cuisine/all");
      setCuisines(response.data);
      setCuisineList(response.data.map((cuisine: Cuisine) => cuisine.name));
    } catch (error) {
      console.error("Error fetching cuisines:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    fetchCategories();
    fetchCuisines();
    const { name, value } = e.target;
    if (name === "ingredients") {
      const ingredientsArray = value
        .split(",")
        .map((ingredient) => ingredient.trim());
      setRecipeData((prevData) => ({
        ...prevData,
        [name]: ingredientsArray,
      }));
    } else {
      setRecipeData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const handlePhotoFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 500,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        const imageUrl = URL.createObjectURL(compressedFile);
        setPreviewImage(imageUrl);

        const imageName = `${file.name}_${uuidv4()}`;
        const imageRef = ref(storage, `images/${imageName}`);
        // Încărcați fișierul în storage
        const snapshot = await uploadBytes(imageRef, file);

        // După ce încărcarea a fost finalizată cu succes, obțineți URL-ul de descărcare
        const imageUrlDownload = await getDownloadURL(imageRef);

        // Actualizați state-ul cu URL-ul de descărcare
        setRecipeData((prevData) => ({
          ...prevData,
          imageUrl: imageUrlDownload,
        }));
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }
  };

  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const handleVideoFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      try {
        const videoUrl = URL.createObjectURL(file);
        setPreviewVideo(videoUrl);

        const videoName = `${file.name}_${uuidv4()}`;
        const videoRef = ref(storage, `videos/${videoName}`);
        // Încărcați fișierul în storage
        const snapshot = await uploadBytes(videoRef, file);

        // După ce încărcarea a fost finalizată cu succes, obțineți URL-ul de descărcare
        const videoUrlDownload = await getDownloadURL(videoRef);

        // Actualizați state-ul cu URL-ul de descărcare
        setRecipeData((prevData) => ({
          ...prevData,
          videoUrl: videoUrlDownload,
        }));
      } catch (error) {
        console.error("Error uploading video:", error);
      }
    }
  };

  /*const fetchUserEmail = async () => {
    try {
      const myToken = localStorage.getItem("token");
      console.log("Token:", myToken);
      const response = await axios.get(
        `http://localhost:8090/api/users/token/${myToken}`
      );
      return response.data.email;
    } catch (error) {
      console.error("Error fetching user email:", error);
    }
  };
*/
  const handleAddClick = async () => {
    setRecipeData((prevData) => ({
      ...prevData,
      authorEmail: authorEmail,
    }));

    try {
      // create the recipe
      console.log("Recipe data:", recipeData);
      const addedRecipe = await axios.post(
        `http://localhost:8090/api/recipes`,
        recipeData
      );

      //verify if category exists
      const categoryExists = categories.find(
        (category) => category.name === recipeData.category
      );
      if (!categoryExists) {
        //create the category
        const addedCategory: Category = {
          id: "",
          name: recipeData.category,
          recipeIds: [""],
        };
        const newCategory = await axios.post(
          `http://localhost:8090/api/category`,
          addedCategory
        );
        // add recipe to category
        if (newCategory.data) {
          const updatedCategory = await axios.put(
            `http://localhost:8090/api/category/${recipeData.category}`
          );
        } else {
          console.error("Error adding category:", newCategory);
        }
      } else {
        // add recipe to category
        const updatedCategory = await axios.put(
          `http://localhost:8090/api/category/${categoryExists.name}`
        );
        console.log("Updated category:", updatedCategory.data);
      }

      //verify if cuisine exists
      const cuisineExists = cuisines.find(
        (cuisine) => cuisine.name === recipeData.cuisine
      );
      if (!cuisineExists) {
        //create the cuisine
        const addedCuisine: Cuisine = {
          id: "",
          name: recipeData.cuisine,
          recipeIds: [""],
        };
        const newCuisine = await axios.post(
          `http://localhost:8090/api/cuisine`,
          addedCuisine
        );
        // add recipe to cuisine
        if (newCuisine.data) {
          const updatedCuisine = await axios.put(
            `http://localhost:8090/api/cuisine/${recipeData.cuisine}`
          );
        } else {
          console.error("Error adding cuisine:", newCuisine);
        }
      } else {
        // add recipe to cuisine
        const updatedCuisine = await axios.put(
          `http://localhost:8090/api/cuisine/${cuisineExists.name}`
        );
        console.log("Updated cuisine:", updatedCuisine.data);
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
    }

    try {
      onRecipeAdded();
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
    setRecipeData({
      id: "",
      authorEmail: authorEmail,
      name: "",
      ingredients: [],
      preparationMethod: "",
      imageUrl: null,
      category: "",
      cuisine: "",
      videoUrl: null,
      commentId: [],
    });
    setPreviewImage(null);
    setPreviewVideo(null);
    onCancel();
  };
  const handleCancelClick = () => {
    setRecipeData({
      id: "",
      authorEmail: authorEmail,
      name: "",
      ingredients: [],
      preparationMethod: "",
      imageUrl: null,
      category: "",
      cuisine: "",
      videoUrl: null,
      commentId: [],
    });
    setPreviewImage(null);
    setPreviewVideo(null);
    onCancel();
  };

  return (
    <Modal
      isOpen={visible}
      onRequestClose={onCancel}
      contentLabel="Add Recipe"
      className="modal-container"
      overlayClassName="modal-overlay"
    >
      <div className="modal-content">
        <h2 className="modal-title">Add Recipe</h2>
        <input
          type="text"
          name="name"
          className="input-field"
          placeholder="Title"
          value={recipeData.name}
          onChange={handleInputChange}
        />
        <div>
          <textarea
            name="ingredients"
            className="input-field ingredients"
            placeholder="Enter ingredients separated by commas"
            value={recipeData.ingredients}
            onChange={handleInputChange}
          />
        </div>
        <textarea
          name="preparationMethod"
          className="input-field preparation-method"
          placeholder="Preparation Method"
          value={recipeData.preparationMethod}
          onChange={handleInputChange}
        />
        <input
          type="file"
          name="photo"
          title="Choose photo file"
          className="input-field photo"
          onChange={handlePhotoFileChange}
        />
        {previewImage && (
          <img src={previewImage} alt="Image" className="preview-image" />
        )}
        <Select
          className="input-field-category"
          placeholder="Select a category"
          value={recipeData.category || undefined}
          allowClear
          showSearch
          onSearch={(value) => setInputCategoryValue(value)}
          onChange={(value) =>
            setRecipeData((prevData) => ({
              ...prevData,
              category: value,
            }))
          }
        >
          {Array.from(
            new Set((categoryList || []).concat(inputCategoryValue || []))
          ).map((category) => (
            <Option key={category} value={category}>
              {category}
            </Option>
          ))}
        </Select>
        <Select
          className="input-field-category"
          placeholder="Select a cuisine"
          value={recipeData.cuisine || undefined}
          allowClear
          showSearch
          onSearch={(value) => setInputCuisineValue(value)}
          onChange={(value) =>
            setRecipeData((prevData) => ({
              ...prevData,
              cuisine: value,
            }))
          }
        >
          {Array.from(
            new Set((cuisineList || []).concat(inputCuisineValue || []))
          ).map((cuisine) => (
            <Option key={cuisine} value={cuisine}>
              {cuisine}
            </Option>
          ))}
        </Select>
        <input
          type="file"
          name="video"
          title="Choose video file"
          className="input-field video"
          onChange={handleVideoFileChange}
        />
        {previewVideo && (
          <video controls className="preview-video">
            <source src={previewVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        <div className="buttons-container">
          <button className="add-button" onClick={handleAddClick}>
            Add
          </button>
          <button className="close-button" onClick={handleCancelClick}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default AddRecipeModal;

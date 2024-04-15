import React, { useState } from "react";
import Modal from "react-modal";
import "./AddRecipeModal.css";
import axios from "axios";
import { on } from "events";
import { storage } from "../../firebase";
import { ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

interface AddRecipeModalProps {
  visible: boolean;
  onCancel: () => void;
  onRecipeAdded: () => void;
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
  videoUrl: File | null;
  commentId: string[];
}

function AddRecipeModal({
  visible,
  onCancel,
  onRecipeAdded,
}: AddRecipeModalProps) {
  const [recipeData, setRecipeData] = useState<RecipeData>({
    id: "",
    authorEmail: "",
    name: "",
    ingredients: [],
    preparationMethod: "",
    imageUrl: null,
    category: "",
    cuisine: "",
    videoUrl: null,
    commentId: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);

      // opload image to storage
      const imageName = `${file.name}_${uuidv4()}`; // Generate a unique name for the image
      const imageRef = ref(storage, `images/${imageName}`);
      //console.log("Image ref:", imageRef.name);

      uploadBytes(imageRef, file)
        .then((snapshot) => {
          //alert("Image uploaded successfully");
          console.log("Uploaded a blob or file!", snapshot);
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          //alert("Failed to upload image. Please try again.");
        });
      setRecipeData((prevData) => ({
        ...prevData,
        imageUrl: imageRef.name,
      }));
    }
  };

  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const handlevideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setRecipeData((prevData) => ({
      ...prevData,
      [e.target.name]: file,
    }));
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setPreviewVideo(videoUrl);
    }
  };

  const fetchUserEmail = async () => {
    const myToken = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:8090/api/users/token/${myToken}`
    );
    return response.data.email;
  };

  const handleAddClick = async () => {
    setRecipeData({
      id: "",
      authorEmail: "",
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

    const userEmail = await fetchUserEmail();
    setRecipeData((prevData) => ({
      ...prevData,
      authorEmail: userEmail,
    }));
    //console.log("Email:", response.data.email);
    console.log("Ingredients:", recipeData.ingredients);
    console.log("Recipe added:", recipeData);

    try {
      const addedRecipe = await axios.post(
        `http://localhost:8090/api/recipes`,
        recipeData
      );
      console.log("Recipe added:", addedRecipe);
    } catch (error) {
      console.error("Error adding recipe:", error);
    }

    try {
      onRecipeAdded();
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
  };
  const handleCancelClick = () => {
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
        <input
          type="text"
          name="category"
          className="input-field"
          placeholder="Category"
          value={recipeData.category}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="cuisine"
          className="input-field"
          placeholder="Cuisine"
          value={recipeData.cuisine}
          onChange={handleInputChange}
        />
        <input
          type="file"
          name="video"
          title="Choose video file"
          className="input-field video"
          onChange={handlevideoFileChange}
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

import React, { useState } from "react";
import Modal from "react-modal";
import "./AddRecipeModal.css";
import axios from "axios";
import { on } from "events";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";

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

function AddRecipeModal({
  visible,
  onCancel,
  onRecipeAdded,
  authorEmail,
}: AddRecipeModalProps) {
  console.log("Author email:", authorEmail);
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

        console.log("Video URL:", videoUrlDownload);
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
      console.log("Recipe data:", recipeData);
      const addedRecipe = await axios.post(
        `http://localhost:8090/api/recipes`,
        recipeData
      );
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

import { useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid"; // Import 'v4' as 'uuidv4'

function Test() {
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Access the first file (if available)
    if (file) {
      setImage(file); // Set the selected file to state
    }
  };

  const uploadImage = () => {
    if (!image) {
      return; // If no image is selected, return early
    }

    const imageName = `${image.name}_${uuidv4()}`; // Generate a unique name for the image
    const imageRef = ref(storage, `images/${imageName}`);

    uploadBytes(imageRef, image)
      .then((snapshot) => {
        alert("Image uploaded successfully");
        console.log("Uploaded a blob or file!", snapshot);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      });
  };

  return (
    <div className="form-control">
      <input
        className="form-control"
        type="file"
        onChange={handleImageChange} // Handle file selection
      />
      <button onClick={uploadImage}>Upload</button>
    </div>
  );
}

export default Test;

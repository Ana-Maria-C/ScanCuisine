import React, { useState } from "react";
import "./MyProfile.css";
import CustomCard from "../../components/CustomCard/CustomCard";
import UserCard from "../../components/UserCard/UserCard";

function MyProfile() {
  const [name, setName] = useState("John");
  const [surname, setSurname] = useState("Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(
    "I radiate a unique passion for the culinary arts, turning every moment in the kitchen into a journey filled with unmistakable flavors and aromas. I start my day with a smile drawn by the fresh aroma of coffee, and in every recipe.For me, cooking is not just an activity - it's a form of expression and connection with souls."
  );
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDescriptionEdit = () => {
    setIsDescriptionEditing(true);
  };

  const handleDescriptionSave = () => {
    setIsDescriptionEditing(false);
    // implementare backend
  };

  const handleSave = () => {
    setIsEditing(false);
    // implementare backend
  };

  return (
    <div className="profilepage">
      <div className="myprofile">
        <h1>My Profile</h1>
        <div className="profiledetails">
          <div>
            <img
              src="my_profile.png"
              alt="My profile"
              className="profileimage"
            />
          </div>
          <div className="description">
            <div className="description-group">
              <label htmlFor="description">Description:</label>
              {isDescriptionEditing ? (
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              ) : (
                <div>{description}</div>
              )}
            </div>
            {isDescriptionEditing ? (
              <button onClick={handleDescriptionSave}>Save</button>
            ) : (
              <button onClick={handleDescriptionEdit}>Edit</button>
            )}
          </div>
          <div className="form">
            <div className="form-group">
              <label htmlFor="name">Last Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              ) : (
                <div>{name}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="surname">First Name:</label>
              {isEditing ? (
                <input
                  type="text"
                  id="surname"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
              ) : (
                <div>{surname}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              {isEditing ? (
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              ) : (
                <div>{email}</div>
              )}
            </div>
            {isEditing ? (
              <button onClick={handleSave}>Save</button>
            ) : (
              <button onClick={handleEdit}>Edit</button>
            )}
          </div>
        </div>
      </div>
      <div className="myrecipes">
        <h2>My Recipes</h2>
        <div className="myrecipes-container">
          <CustomCard imageUrl="./mancare1.jpg" title="Soup" />
          <CustomCard imageUrl="./mancare2.jpg" title="Lasagna" />
          <CustomCard imageUrl="./mancare3.jpg" title="Pasta" />
          <CustomCard imageUrl="./prajitura1.jpg" title="Lava Cake" />
          <CustomCard imageUrl="./prajitura2.jpg" title="Berry Cake" />
        </div>
      </div>
      <div className="myfavorites">
        <h2>My Favorite Recipes</h2>
        <div className="myrecipes-container">
          <CustomCard imageUrl="./mancare1.jpg" title="Soup" />
          <CustomCard imageUrl="./mancare2.jpg" title="Lasagna" />
          <CustomCard imageUrl="./mancare3.jpg" title="Pasta" />
          <CustomCard imageUrl="./prajitura1.jpg" title="Lava Cake" />
          <CustomCard imageUrl="./prajitura2.jpg" title="Berry Cake" />
        </div>
      </div>
      <div className="following">
        <h2>People I follow</h2>
        <div className="following-container">
          <UserCard imageUrl="./girluser.png" title="Dubei Irina" />
          <UserCard imageUrl="./boyuser1.png" title="Burada Alex" />
          <UserCard imageUrl="./boyuser2.png" title="Popescu Ioan" />
          <UserCard imageUrl="./girluser1.png" title="Catavencu Gabriela" />
          <UserCard imageUrl="./girluser2.jpg" title="Chirica Alexia" />
        </div>
      </div>
    </div>
  );
}

export default MyProfile;

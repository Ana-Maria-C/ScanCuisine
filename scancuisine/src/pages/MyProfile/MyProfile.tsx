import React, { useState, useEffect } from "react";
import "./MyProfile.css";
import CustomCard from "../../components/CustomCard/CustomCard";
import UserCard from "../../components/UserCard/UserCard";
import axios from "axios";
import AddCard from "../../components/CustomCard/AddCard";

function MyProfile() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState("");
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const myToken = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8090/api/users/token/${myToken}`
        );
        const {
          lastName,
          firstName,
          email,
          description,
          imageUrl,
          myRecipes,
          myFavoriteRecipes,
          followedPeople,
        } = response.data;
        setName(lastName);
        setSurname(firstName);
        setEmail(email);
        setDescription(description);
      } catch (error) {
        console.error("Error fetching profile:", (error as Error).message);
      }
    }

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDescriptionEdit = () => {
    setIsDescriptionEditing(true);
  };

  const handleDescriptionSave = async () => {
    try {
      await axios.put(`http://localhost:8090/api/users/${email}`, {
        description: description,
      });
      setIsDescriptionEditing(false);
    } catch (error) {
      console.error("Error saving description:", (error as Error).message);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:8090/api/users/${email}`, {
        lastName: name,
        firstName: surname,
        email: email,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", (error as Error).message);
    }
  };

  return (
    <div>
      <h1>My Profile</h1>
      <div className="profilepage">
        <div className="myprofile">
          <div className="profiledetails">
            <div>
              <img
                src="my_profile.png"
                alt="My profile"
                className="profileimage"
              />
            </div>
            <div className="description-field">
              <div className="description">
                <div className="description-group">
                  <label htmlFor="description">Description:</label>
                  {isDescriptionEditing ? (
                    <input
                      type="text"
                      id="description"
                      className="description-text editing"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  ) : (
                    <div className="description-text">
                      {description
                        ? description
                        : "There is no description yet."}
                    </div>
                  )}
                </div>
              </div>
              <div className="description-button">
                {isDescriptionEditing ? (
                  <button onClick={handleDescriptionSave}>Save</button>
                ) : (
                  <button onClick={handleDescriptionEdit}>Edit</button>
                )}
              </div>
            </div>
            <div className="form-field">
              <div className="form">
                <div className="form-group">
                  <label htmlFor="name">Last Name:</label>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-text editing"
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
                      className="form-text editing"
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
                      className="form-text editing"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  ) : (
                    <div>{email}</div>
                  )}
                </div>
              </div>
              <div className="form-button">
                {isEditing ? (
                  <button onClick={handleSave}>Save</button>
                ) : (
                  <button onClick={handleEdit}>Edit</button>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="myrecipes">
          <h2>My Recipes</h2>
          <div className="myrecipes-container">
            <CustomCard imageUrl="./mancare2.jpg" title="Lasagna" />
            <CustomCard imageUrl="./mancare3.jpg" title="Pasta" />
            <CustomCard imageUrl="./prajitura1.jpg" title="Lava Cake" />
            <CustomCard imageUrl="./prajitura2.jpg" title="Berry Cake" />
            <AddCard imageUrl="./add.jpg" title="Add a recipe" />
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
    </div>
  );
}

export default MyProfile;

import React, { useState, useEffect } from "react";
import "./MyProfile.css";
import CustomCard from "../../components/CustomCard/CustomCard";
import UserCard from "../../components/UserCard/UserCard";
import axios from "axios";
import AddCard from "../../components/CustomCard/AddCard";
import AddRecipeModal from "../../components/AddRecipeModal/AddRecipeModal";
import { Button } from "antd";
import { storage } from "../../firebase";
import { ref, getDownloadURL } from "firebase/storage";

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
}

interface FollowedPeople {
  lastName: string;
  firstName: string;
  email: string;
  description: string;
  imageUrl: string;
  myRecipes: string[];
  myFavoriteRecipes: string[];
  followedPeople: string[];
}

function MyProfile() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState("");
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  const [isAddRecipeModalOpen, setIsAddRecipeModalOpen] = useState(false); // State to manage the visibility of the AddRecipeModal
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [userFavoriteRecipes, setUserFavoriteRecipes] = useState<Recipe[]>([]);
  const [followedPeople, setFollowedPeople] = useState<FollowedPeople[]>([]);

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

        // Fetch user recipes
        const userRecipesResponse = await axios.get(
          `http://localhost:8090/api/recipes/user/${email}`
        );
        // set the corect image url from storage
        /* userRecipesResponse.data.forEach(async (recipe: Recipe) => {
          const imageUrl = await getDownloadURL(
            ref(storage, `images/${recipe.imageUrl}`)
          );
          recipe.imageUrl = imageUrl;
          console.log("Recipe imageUrl:", imageUrl);
        });
        */
        setUserRecipes(userRecipesResponse.data);

        // Fetch user favorite recipes
        const userFavoriteRecipesResponse = await axios.get(
          `http://localhost:8090/api/recipes/favorite/${email}`
        );
        // set the corect image url from storage
        /*userFavoriteRecipesResponse.data.forEach(async (recipe: Recipe) => {
          const imageUrl = await getDownloadURL(
            ref(storage, `images/${recipe.imageUrl}`)
          );
          recipe.imageUrl = imageUrl;
          console.log("Recipe imageUrl:", imageUrl);
        });
        */
        setUserFavoriteRecipes(userFavoriteRecipesResponse.data);

        // Fetch followed people
        const followedPeopleResponse = await axios.get(
          `http://localhost:8090/api/users/followedPeople/${email}`
        );
        setFollowedPeople(followedPeopleResponse.data);
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

  const handleAddRecipeClick = () => {
    setIsAddRecipeModalOpen(true);
  };

  const handleRecipeAdded = async () => {
    try {
      const myToken = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8090/api/users/token/${myToken}`
      );
      const userEmail = response.data.email;

      const userRecipesResponse = await axios.get(
        `http://localhost:8090/api/recipes/user/${userEmail}`
      );
      // Wait for all download URLs to be fetched
      /*const recipesWithImages = await Promise.all(
        userRecipesResponse.data.map(async (recipe: Recipe) => {
          const imageUrl = await getDownloadURL(
            ref(storage, `images/${recipe.imageUrl}`)
          );
          return { ...recipe, imageUrl };
        })
      );
      */
      setUserRecipes(userRecipesResponse.data);
    } catch (error) {
      console.error("Error fetching user recipes:", error);
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
            {/*} <CustomCard imageUrl="./mancare2.jpg" title="Lasagna" />
            <CustomCard imageUrl="./mancare3.jpg" title="Pasta" />
            <CustomCard imageUrl="./prajitura1.jpg" title="Lava Cake" />
            <CustomCard imageUrl="./prajitura2.jpg" title="Berry Cake" />*/}
            {/* Display user's recipes */}
            {userRecipes.length > 0 &&
              userRecipes.map((recipe) => (
                <CustomCard
                  key={recipe.id}
                  id={recipe.id}
                  imageUrl={recipe.imageUrl}
                  title={recipe.name}
                />
              ))}
            <div onClick={handleAddRecipeClick}>
              <AddCard imageUrl="./add.jpg" title="Add a recipe" />
            </div>
          </div>
        </div>
        <div className="myfavorites">
          <h2>My Favorite Recipes</h2>
          <div className="myrecipes-container">
            {/*<CustomCard imageUrl="./mancare1.jpg" title="Soup" />
            <CustomCard imageUrl="./mancare2.jpg" title="Lasagna" />
            <CustomCard imageUrl="./mancare3.jpg" title="Pasta" />
            <CustomCard imageUrl="./prajitura1.jpg" title="Lava Cake" />
            <CustomCard imageUrl="./prajitura2.jpg" title="Berry Cake" />*/}
            {/* Display user's favorite recipes */}
            {userFavoriteRecipes.length > 0 ? (
              userFavoriteRecipes.map((recipe) => (
                <CustomCard
                  key={recipe.id}
                  id={recipe.id}
                  imageUrl={recipe.imageUrl}
                  title={recipe.name}
                />
              ))
            ) : (
              <div className="no-favorites-message">
                You don't have any favorite recipes yet.
              </div>
            )}
          </div>
        </div>
        <div className="following">
          <h2>People I follow</h2>
          <div className="following-container">
            {/*<UserCard imageUrl="./girluser.png" title="Dubei Irina" />
            <UserCard imageUrl="./boyuser1.png" title="Burada Alex" />
            <UserCard imageUrl="./boyuser2.png" title="Popescu Ioan" />
            <UserCard imageUrl="./girluser1.png" title="Catavencu Gabriela" />
            <UserCard imageUrl="./girluser2.jpg" title="Chirica Alexia" />*/}
            {followedPeople.length > 0 ? (
              followedPeople.map((person) => (
                <UserCard
                  key={person.email}
                  imageUrl={person.imageUrl}
                  title={`${person.firstName} ${person.lastName}`}
                />
              ))
            ) : (
              <div className="no-following-message">
                You are not following anyone yet.
              </div>
            )}
          </div>
        </div>
      </div>
      <AddRecipeModal
        visible={isAddRecipeModalOpen}
        onCancel={() => setIsAddRecipeModalOpen(false)}
        onRecipeAdded={handleRecipeAdded}
      />
    </div>
  );
}

export default MyProfile;

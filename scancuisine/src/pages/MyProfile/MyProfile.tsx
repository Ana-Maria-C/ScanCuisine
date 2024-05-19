import React, { useState, useEffect, useRef } from "react";
import "./MyProfile.css";
import CustomCard from "../../components/CustomCard/CustomCard";
import UserCard from "../../components/UserCard/UserCard";
import axios from "axios";
import AddCard from "../../components/CustomCard/AddCard";
import AddRecipeModal from "../../components/AddRecipeModal/AddRecipeModal";
import { storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";

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
  const [imageUrl, setImageUrl] = useState("my_profile.png");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState("");
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  const [isAddRecipeModalOpen, setIsAddRecipeModalOpen] = useState(false); // State to manage the visibility of the AddRecipeModal
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [userFavoriteRecipes, setUserFavoriteRecipes] = useState<Recipe[]>([]);
  //const [followedPeople, setFollowedPeople] = useState<FollowedPeople[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [recipeIsLoading, setRecipeIsLoading] = useState(false);
  const [favoriteRecipeIsLoading, setFavoriteRecipeIsLoading] = useState(false);
  //const [followedPeopleIsLoading, setFollowedPeopleIsLoading] = useState(false);
  // variable to store the recommended recipes
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<string[]>([]);
  const [recommendedRecipes, setRecommendedRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const response = await axios.get(
          `http://localhost:8090/api/recipes/user/${email}`
        );
        setUserRecipes(response.data);
      } catch (error) {
        console.error("Error fetching user recipes:", error);
      }
    }
    fetchRecipes();
  }, [email, recipeIsLoading]);

  useEffect(() => {
    async function fetchFavoriteRecipes() {
      try {
        const response = await axios.get(
          `http://localhost:8090/api/recipes/favorite/${email}`
        );
        setUserFavoriteRecipes(response.data);
      } catch (error) {
        console.error("Error fetching user favorite recipes:", error);
      }
    }
    fetchFavoriteRecipes();
  }, [email, favoriteRecipeIsLoading]);

  /*useEffect(() => {
    async function fetchFollowedPeople() {
      try {
        const response = await axios.get(
          `http://localhost:8090/api/users/followedPeople/${email}`
        );
        setFollowedPeople(response.data);
      } catch (error) {
        console.error("Error fetching followed people:", error);
      }
    }
  }, [email, followedPeopleIsLoading]);
  */

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
        if (imageUrl !== null && imageUrl !== "") {
          setImageUrl(imageUrl);
        } else {
          setImageUrl("my_profile.png");
        }
      } catch (error) {
        console.error("Error fetching profile:", (error as Error).message);
      }
    }

    fetchProfile();
    setFavoriteRecipeIsLoading(!favoriteRecipeIsLoading);
    setRecipeIsLoading(!recipeIsLoading);
    // setFollowedPeopleIsLoading(!followedPeopleIsLoading);
  }, []);

  useEffect(() => {
    async function getRecommendedRecipes() {
      let recommendedRecipeUrls = [];

      try {
        let firstFiveRecipes = userFavoriteRecipes.slice(0, 5);
        let uniqueIds = new Set(favoriteRecipeIds);
        for (let recipe of firstFiveRecipes) {
          // extract id from extern api
          const options = {
            method: "GET",
            url: "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch",
            params: { query: "pasta" },
            headers: {
              "X-RapidAPI-Key":
                "cc52b34b8dmshc6a5492c010552dp10ddd2jsnbde45ea4a632",
              "X-RapidAPI-Host":
                "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
            },
          };
          const response = await axios.request(options);
          if (response.data.results) {
            uniqueIds.add(response.data.results[0]["id"]);
          }
        }
        setFavoriteRecipeIds(Array.from(uniqueIds));
        console.log("Favorite recipe ids:", favoriteRecipeIds);
      } catch (error) {
        console.error("Error getting the id for my favorite recipes:", error);
      }

      // get the recommended recipes based on the ids
      try {
        for (let id of favoriteRecipeIds) {
          const options = {
            method: "GET",
            url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${id}/similar`,
            headers: {
              "X-RapidAPI-Key":
                "cc52b34b8dmshc6a5492c010552dp10ddd2jsnbde45ea4a632",
              "X-RapidAPI-Host":
                "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
            },
          };
          const response = await axios.request(options);
          if (response.data) {
            const firstTwoRecommendedRecipe = response.data.slice(0, 2);
            for (let recipe of firstTwoRecommendedRecipe) {
              recommendedRecipeUrls.push(recipe.sourceUrl);
            }
          }
        }
        console.log("Recommended recipe urls:", recommendedRecipeUrls);
      } catch (error) {
        console.error("Error getting the recommended recipes:", error);
      }

      // extract the recommended recipes from the urls
      try {
        for (let url of recommendedRecipeUrls) {
          const options = {
            method: "GET",
            url: "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/extract",
            params: {
              url: url,
            },
            headers: {
              "X-RapidAPI-Key":
                "cc52b34b8dmshc6a5492c010552dp10ddd2jsnbde45ea4a632",
              "X-RapidAPI-Host":
                "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
            },
          };

          const response = await axios.request(options);
          console.log("Recommended recipe from website:", response.data);
        }
      } catch (error) {
        console.error("Error extracting the recommended recipes:", error);
      }
    }
    getRecommendedRecipes();
  }, [email]);

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

  const getUserEmail = async () => {
    const myToken = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:8090/api/users/token/${myToken}`
    );
    return response.data.email;
  };

  const handleSave = async () => {
    try {
      const userEmail = await getUserEmail();
      await axios.put(`http://localhost:8090/api/users/${userEmail}`, {
        lastName: name,
        firstName: surname,
        email: email,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", (error as Error).message);
    }
  };

  const handleAddRecipeClick = async () => {
    console.log("se deschide modalul");
    const userEmail = await getUserEmail();
    setEmail(userEmail);
    setIsAddRecipeModalOpen(true);
  };

  const handleRecipeAdded = async () => {
    try {
      const userEmail = await getUserEmail();
      const userRecipesResponse = await axios.get(
        `http://localhost:8090/api/recipes/user/${userEmail}`
      );
      setUserRecipes(userRecipesResponse.data);
    } catch (error) {
      console.error("Error fetching user recipes:", error);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

        const imageName = `${file.name}_${uuidv4()}`;
        const imageRef = ref(storage, `images/users/${imageName}`);
        // Încărcați fișierul în storage
        const snapshot = await uploadBytes(imageRef, file);

        // După ce încărcarea a fost finalizată cu succes, obțineți URL-ul de descărcare
        const imageUrlDownload = await getDownloadURL(imageRef);

        // Actualizați state-ul cu URL-ul de descărcare
        setImageUrl(imageUrlDownload);
        // Actualizați imaginea de profil a utilizatorului
        await axios.put(`http://localhost:8090/api/users/${email}`, {
          imageUrl: imageUrlDownload,
        });
      } catch (error) {
        console.error("Error compressing image:", error);
      }
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
                src={imageUrl}
                alt="My profile"
                className="profileimage"
                title="Click to change profile picture"
                onClick={() => fileInputRef.current?.click()}
              />
              <input
                type="file"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handlePhotoChange}
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
        {/*}
        <div className="following">
          <h2>People I follow</h2>
          <div className="following-container">
            {/*<UserCard imageUrl="./girluser.png" title="Dubei Irina" />
            <UserCard imageUrl="./boyuser1.png" title="Burada Alex" />
            <UserCard imageUrl="./boyuser2.png" title="Popescu Ioan" />
            <UserCard imageUrl="./girluser1.png" title="Catavencu Gabriela" />
            <UserCard imageUrl="./girluser2.jpg" title="Chirica Alexia" />*}
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
        */}
        <div className="following">
          <h2>Recommended for you</h2>
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

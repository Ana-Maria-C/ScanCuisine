import React, { useState, useEffect } from "react";
import CustomCard from "../../components/CustomCard/CustomCard";
import "./Recipe_from_api.css";
import "./../Home/Home.css";
import axios from "axios";

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
  datePosted: Date;
}

function Recipe_from_api() {
  const currentYear = new Date().getFullYear();
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const getUserEmail = async () => {
    const myToken = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:8090/api/users/token/${myToken}`
    );
    return response.data.email;
  };

  async function fetchEmail() {
    const userEmail = await getUserEmail();
    return userEmail;
  }

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const userEmail = await fetchEmail();
        console.log("email", userEmail);
        const response = await axios.get(
          `http://localhost:8090/api/recipe-based-on-ingredients/${userEmail}`
        );
        setRecipes(response.data);
        console.log("recipes", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching user favorite recipes:", error);
      }
    }
    fetchRecipes();
  }, []);

  return (
    <div className="home">
      <h1 className="title">Recipes based on your ingredients</h1>
      <div className="home-container">
        <div className="recipes">
          <div className="recipes-container">
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <CustomCard
                  key={recipe.id}
                  id={recipe.id}
                  imageUrl={recipe.imageUrl}
                  title={recipe.name}
                />
              ))
            ) : (
              <div className="no-recipes">
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/scan-cuisine-f4b13.appspot.com/o/gif%2Fsearch_more_ingredients_123456789.gif?alt=media&token=f4bd8e4d-0dbc-44fe-b46d-cedd70c05289"
                  alt="No recipes available"
                  className="no-recipe-gif"
                />
                <span className="no-recipe-text">
                  No recipe found. Please add more ingredients!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <footer className="footer">
        <div className="container">
          <p className="footer-title">
            &copy; {currentYear} Scan Cuisine. All rights reserved.
          </p>
          <p>Terms & Conditions</p>
          <p>For inquiries, email us at: info@scancuisine.com</p>
        </div>
      </footer>
    </div>
  );
}

export default Recipe_from_api;

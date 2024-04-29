import React, { useEffect, useState } from "react";
import Recipe from "../Recipe/Recipe";
import { useParams } from "react-router-dom";
import axios from "axios";
import CustomCard from "../../components/CustomCard/CustomCard";
import "../CategoryRecipes/CategoryRecipes.css";

export default function CuisineRecipes() {
  const { cuisineName } = useParams<{ cuisineName: string }>();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  useEffect(() => {
    console.log("cuisineName:", cuisineName);
    const fetchCuisines = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8090/api/cuisine/recipes/${cuisineName}`
        );
        setRecipes(response.data);
      } catch (error) {
        console.error("There was an error!", error);
      }
    };
    fetchCuisines();
    console.log("recipes", recipes);
  }, [cuisineName]);

  return (
    <div className="search-results">
      <h1>Results for cuisine "{cuisineName}"</h1>
      <div className="search-results-container">
        <div className="search-recipes">
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
            <p className="no-recipe">
              There are no recipes yet that belong to the cuisine "{cuisineName}
              "
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

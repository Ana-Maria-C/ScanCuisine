import React, { useEffect, useState } from "react";
import Recipe from "../Recipe/Recipe";
import { Input, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import CustomCard from "../../components/CustomCard/CustomCard";
import "./SearchResults.css";

export default function SearchResults() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const recipeQuery = localStorage.getItem("searchQuery");
    if (recipeQuery && recipeQuery.trim().length > 0) {
      setSearchQuery(recipeQuery.trim());
      handleSearchEnter(recipeQuery.trim());
    }
  }, []);

  const handleSearchEnter = async (value: string) => {
    if (value.trim().length > 0) {
      try {
        const response = await axios.get(
          `http://localhost:8090/api/recipes/getByName/${value.trim()}`
        );
        setRecipes(response.data);
        setSearchQuery(value.trim());
        //console.log("Recipes found:", recipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        message.error("Failed to fetch recipes. Please try again.");
        setRecipes([]);
      }
    } else {
      message.warning("Please enter a valid recipe name.");
      setRecipes([]);
    }
  };

  return (
    <div className="search-results">
      <h1>Search Results For "{searchQuery}"</h1>
      <div className="search-results-container">
        <Input
          className="search-input"
          placeholder="Search for recipes"
          prefix={<SearchOutlined />}
          onPressEnter={(e) => handleSearchEnter(e.currentTarget.value)}
        />
        <div className="search-recipes">
          {recipes.map((recipe: any) => (
            <CustomCard
              key={recipe.id} // Assuming each recipe has a unique ID
              id={recipe.id}
              imageUrl={recipe.imageUrl}
              title={recipe.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

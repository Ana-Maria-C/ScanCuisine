import React, { useEffect, useState } from "react";
import Recipe from "../Recipe/Recipe";
import { Input, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import axios from "axios";
import CustomCard from "../../components/CustomCard/CustomCard";
import "./CategoryRecipes.css";

export default function CategoryRecipes() {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  useEffect(() => {
    console.log("categoryId", categoryName);
    axios
      .get(`/api/category/recipes/${categoryName}`)
      .then((response) => {
        setRecipes(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
    console.log("recipes", recipes);
  }, [categoryName]);

  return (
    <div className="search-results">
      <h1>Results for category "{categoryName}"</h1>
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
              There are no recipes yet that belong to the category "
              {categoryName}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

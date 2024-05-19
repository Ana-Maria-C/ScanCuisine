import React, { useEffect, useState } from "react";
import { Card, Button } from "antd";
import { HeartOutlined, EyeOutlined } from "@ant-design/icons";
import "./CustomCard.css";
import { Link } from "react-router-dom";
import axios from "axios";

const { Meta } = Card;

interface CustomCardProps {
  id: string;
  imageUrl: string;
  title: string;
}

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

const CustomCard: React.FC<CustomCardProps> = ({ id, imageUrl, title }) => {
  const [userFavoriteRecipes, setUserFavoriteRecipes] = useState<Recipe[]>([]);

  const fetchUserData = async () => {
    const myToken = localStorage.getItem("token");
    const response = await axios.get(
      `http://localhost:8090/api/users/token/${myToken}`
    );
    const email = response.data.email;
    return email;
  };

  const handleAddToFavorite = async () => {
    try {
      // fetch user data
      const email = await fetchUserData();
      // add recipe to favorite
      console.log("email:", email);
      const response = await axios.put(
        `http://localhost:8090/api/users/${email}/addFavoriteRecipe/${id}`
      );
      console.log("response:", response);
      // update the like count of the recipe
      const likeResponse = await axios.put(
        `http://localhost:8090/api/recipes/like/${id}`
      );
      console.log("likeResponse:", likeResponse);
      // update user favorite recipes
      const favoriteRecipesResponse = await axios.get(
        `http://localhost:8090/api/recipes/favorite/${email}`
      );
      setUserFavoriteRecipes(favoriteRecipesResponse.data);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <Card
      className="custom-card"
      hoverable
      cover={<img alt="example" src={imageUrl} />}
      actions={[
        <Button
          onClick={handleAddToFavorite}
          icon={<HeartOutlined />}
          key="favorite"
        >
          Favorite
        </Button>,
        <Link to={`/recipe/${id}`}>
          <Button icon={<EyeOutlined />} key="view">
            View
          </Button>
        </Link>,
      ]}
    >
      <Meta title={title} />
      <span style={{ display: "none" }}>{id}</span>
    </Card>
  );
};

export default CustomCard;

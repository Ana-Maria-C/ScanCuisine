import React, { useState, useEffect } from "react";
import "./Recipe.css";
import { useParams } from "react-router-dom";
import { Button } from "antd";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import axios from "axios";
import AddCommentModal from "../../components/AddCommentModal/AddCommentModal";

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
interface Comment {
  id: string;
  recipeId: string;
  authorEmail: string;
  comment: string;
  likesCount: number;
  dislikesCount: number;
}

interface RecipeComments {
  authorFullName: string;
  authorImageUrl: string;
  comment: string;
}

function Recipe() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe>();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [recipeComments, setRecipeComments] = useState<RecipeComments[]>([]);
  const [isAddCommentModalOpen, setIsAddCommentModalOpen] = useState(false); // State to manage the visibility of the AddRecipeModal

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8090/api/recipes/${id}`
        );
        setRecipe(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipe:", error);
        setLoading(false);
      }
    };

    const fetchRecipeComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8090/api/recipe-comments/recipe/${id}`
        );
        const commentsData = response.data;
        const commentsWithUserDetails = await Promise.all(
          commentsData.map(async (comment: Comment) => {
            try {
              const userResponse = await axios.get(
                `http://localhost:8090/api/users/${comment.authorEmail}`
              );
              console.log("User details for comment:", userResponse.data);

              const fullName = `${userResponse.data.firstName} ${userResponse.data.lastName}`; // Concatenează numele și prenumele
              return {
                authorFullName: fullName,
                authorImageUrl: userResponse.data.imageUrl,
                comment: comment.comment,
              };
            } catch (error) {
              console.error("Error fetching user details:", error);
              return null;
            }
          })
        );
        const validCommentsWithUserDetails = commentsWithUserDetails.filter(
          (comment) => comment !== null
        );
        setRecipeComments(validCommentsWithUserDetails);
        console.log("Comments:", validCommentsWithUserDetails);
      } catch (error) {
        console.error("Error fetching recipe comments:", error);
      }
    };

    fetchRecipe();
    fetchRecipeComments();
  }, [id]);

  const handleAddCommentClick = () => {
    setIsAddCommentModalOpen(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!recipe) {
    return <div>Recipe not found.</div>;
  }

  const handleCommentAdded = async () => {
    try {
      // Reîmprospătăm lista de comentarii după adăugarea unui nou comentariu
      const response = await axios.get(
        `http://localhost:8090/api/recipe-comments/recipe/${id}`
      );
      const newComment = response.data;
      setRecipeComments((prevComments) => [...prevComments, newComment]);
    } catch (error) {
      console.error("Error fetching comments for this recipe:", error);
    }
  };
  return (
    <div className="recipe">
      <h1 className="recipe-title">{recipe.name}</h1>
      <div className="recipe-container">
        <div className="image-container">
          <img src={recipe.imageUrl} className="recipe-image" alt="recipe" />
        </div>
        <div className="recipe-ingredients">
          <h2 className="sub-title">Ingredients</h2>
          <div className="recipe-ingredients-container">
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="recipe-instructions">
        <div className="recipe-preparation">
          <h2 className="sub-title">Method of preparation</h2>
          {recipe.preparationMethod.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <div className="recipe-video">
          <h2 className="sub-title">Video </h2>
          <video controls className="video-container">
            <source src={recipe.videoUrl} type="video/mp4" />
          </video>
        </div>
      </div>
      {/*
      <div className="recipe-calorie">
        <h2 className="sub-title">Calculator calorii </h2>
      </div>
  */}
      <div className="recipe-comments">
        <h2 className="sub-title"> Comments </h2>
        {/*<div className="comments-container">
          <div className="user-comment-detail">
            <img src="./girluser1.png" className="user-image" alt="user" />
            <p user-name>Irina Dubei</p>
          </div>
          <div className="user-comment">
            <p className="comment">
              I made this cake for my birthday and it was amazing. I will
              definitely make it again.
            </p>
          </div>
          <div className="like-buttons">
            <Button>
              <LikeOutlined />
            </Button>
            <Button>
              <DislikeOutlined />
            </Button>
          </div>
        </div>
        <div className="comments-container">
          <div className="user-comment-detail">
            <img src="./boyuser1.png" className="user-image" alt="user" />
            <p user-name>Burada Alex</p>
          </div>
          <div className="user-comment">
            <p className="comment">
              I made this cake for my birthday and it was amazing. I will
              definitely make it again.
            </p>
          </div>
          <div className="like-buttons">
            <Button>
              <LikeOutlined />
            </Button>
            <Button>
              <DislikeOutlined />
            </Button>
          </div>
        </div>
        <div className="comments-container">
          <div className="user-comment-detail">
            <img src="./girluser2.jpg" className="user-image" alt="user" />
            <p user-name>Popescu Maria</p>
          </div>
          <div className="user-comment">
            <p className="comment">
              I made this cake for my birthday and it was amazing. I will
              definitely make it again.
            </p>
          </div>
          <div className="like-buttons">
            <Button>
              <LikeOutlined />
            </Button>
            <Button>
              <DislikeOutlined />
            </Button>
          </div>
        </div>*/}
        {recipeComments.length > 0 ? (
          recipeComments.map((comment, index) => (
            <div className="comments-container" key={index}>
              <div className="user-comment-detail">
                <img
                  src={comment.authorImageUrl}
                  className="user-image"
                  alt="user"
                />
                <p user-name>{comment.authorFullName}</p>
              </div>
              <div className="user-comment">
                <p className="comment">{comment.comment}</p>
              </div>
              <div className="like-buttons">
                <Button>
                  <LikeOutlined />
                </Button>
                <Button>
                  <DislikeOutlined />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-comments">No comments for this recipe yet.</p>
        )}
        <div className="add-comment" onClick={handleAddCommentClick}>
          <p className="add-comment-title">Add a comment</p>
        </div>
      </div>
      <AddCommentModal
        visible={isAddCommentModalOpen}
        onCancel={() => setIsAddCommentModalOpen(false)}
        onCommentAdded={handleCommentAdded}
        recipeId={id}
      />
    </div>
  );
}

export default Recipe;

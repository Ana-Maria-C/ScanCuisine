import React, { useState, useEffect } from "react";
import "./Recipe.css";
import { useParams } from "react-router-dom";
import { Button } from "antd";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";
import axios from "axios";
import AddCommentModal from "../../components/AddCommentModal/AddCommentModal";
import { EditOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space } from "antd";
import { get } from "http";

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
  id: string;
  recipeId: string;
  authorEmail: string;
  authorFullName: string;
  authorImageUrl: string;
  comment: string;
  likesCount: number;
  dislikesCount: number;
}

interface Nutrition {
  calories: { key: number; value: string };
  fat: { key: number; value: string };
  protein: { key: number; value: string };
  carbs: { key: number; value: string };
}

interface TableRowProps {
  name: string;
  nutrient: { key: number; value: string }; // Define the type for the nutrient prop
}

const TableRow: React.FC<TableRowProps> = ({ name, nutrient }) => (
  <tr>
    <td>{name}</td>
    <td>{nutrient.key}</td>
    <td>{nutrient.value}</td>
  </tr>
);

function Recipe() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe>();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [recipeComments, setRecipeComments] = useState<RecipeComments[]>([]);
  const [isAddCommentModalOpen, setIsAddCommentModalOpen] = useState(false); // State to manage the visibility of the AddRecipeModal
  const [substitute, setSubstitute] = useState<string[] | null>(null);
  const [nutrition, setNutrition] = useState<Nutrition | null>(null);
  const XRapidAPIKey = "75af58f578msh272dfd8ac1822c4p150537jsn4d64d2cb298b";

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
              id: comment.id,
              recipeId: comment.recipeId,
              authorFullName: fullName,
              authorEmail: comment.authorEmail,
              authorImageUrl: userResponse.data.imageUrl,
              comment: comment.comment,
              likesCount: comment.likesCount,
              dislikesCount: comment.dislikesCount,
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

  const fetchIngredientSubstitute = async (ingredient: string) => {
    const options = {
      method: "GET",
      url: "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/substitutes",
      params: {
        ingredientName: ingredient,
      },
      headers: {
        "X-RapidAPI-Key": XRapidAPIKey,
        "X-RapidAPI-Host":
          "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      console.log("response", response.data);
      if (response.data.status === "success") {
        setSubstitute(response.data.substitutes || ["No substitute found"]);
      } else {
        setSubstitute(["No substitute found"]);
      }
    } catch (error) {
      console.error(error);
      setSubstitute(["Error fetching substitute"]);
    }
  };

  const getNutrition = async (title: string) => {
    const options = {
      method: "GET",
      url: "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/guessNutrition",
      params: { title: title },
      headers: {
        "X-RapidAPI-Key": XRapidAPIKey,
        "X-RapidAPI-Host":
          "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const getMenuItems = () => {
    if (!substitute) {
      return [];
    }
    return substitute.map((item, index) => ({
      label: item,
      key: index.toString(),
    }));
  };

  const menu = <Menu className="drop-down-menu" items={getMenuItems()} />;

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8090/api/recipes/${id}`
        );
        setRecipe(response.data);
        setLoading(false);

        if (response.data) {
          const result = await getNutrition(response.data.name);
          console.log("result", result);
          // set the nutrition data
          if (
            !(
              result.calories === undefined ||
              result.fat === undefined ||
              result.protein === undefined ||
              result.carbs === undefined
            )
          ) {
            setNutrition(() => ({
              calories: {
                key: result.calories.value,
                value: result.calories.unit,
              },
              fat: {
                key: result.fat.value,
                value: result.fat.unit,
              },
              protein: {
                key: result.protein.value,
                value: result.protein.unit,
              },
              carbs: {
                key: result.carbs.value,
                value: result.carbs.unit,
              },
            }));
            console.log("nutrition", nutrition);
          }
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
        setLoading(false);
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
      await fetchRecipeComments();
    } catch (error) {
      console.error("Error fetching recipe comments:", error);
    }
  };

  const handleClickLikeComment = async (comment: RecipeComments) => {
    try {
      comment.likesCount += 1;
      console.log("comment data", comment);
      const response = await axios.put(
        `http://localhost:8090/api/recipe-comments/${comment.id}`,
        {
          id: comment.id,
          recipeId: comment.recipeId,
          authorEmail: comment.authorEmail,
          comment: comment.comment,
          likesCount: comment.likesCount,
          dislikesCount: comment.dislikesCount,
        }
      );
      // refresh comments
      await fetchRecipeComments();
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const handleClickDislikeComment = async (comment: RecipeComments) => {
    try {
      comment.dislikesCount += 1;
      console.log("comment data", comment);
      const response = await axios.put(
        `http://localhost:8090/api/recipe-comments/${comment.id}`,
        {
          id: comment.id,
          recipeId: comment.recipeId,
          authorEmail: comment.authorEmail,
          comment: comment.comment,
          likesCount: comment.likesCount,
          dislikesCount: comment.dislikesCount,
        }
      );
      // refresh comments
      await fetchRecipeComments();
    } catch (error) {
      console.error("Error liking comment:", error);
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
          <h2 className="sub-title-ingredients">Ingredients</h2>
          <div className="recipe-ingredients-container">
            <ul>
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient}
                  <Dropdown overlay={menu} trigger={["click"]}>
                    <a onClick={(e) => e.preventDefault()}>
                      <Space>
                        <EditOutlined
                          onClick={() => fetchIngredientSubstitute(ingredient)}
                          title="Get Substitute"
                          className="substitute-recipe-icon"
                        />
                      </Space>
                    </a>
                  </Dropdown>
                </li>
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
      {nutrition && (
        <div className="recipe-calorie">
          <h2 className="sub-title">Nutrition </h2>
          <table className="recipe-table">
            <thead>
              <tr>
                <th>Nutrient</th>
                <th>Value</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {nutrition && (
                <>
                  <TableRow name="Calories" nutrient={nutrition.calories} />
                  <TableRow name="Fat" nutrient={nutrition.fat} />
                  <TableRow name="Protein" nutrient={nutrition.protein} />
                  <TableRow name="Carbs" nutrient={nutrition.carbs} />
                </>
              )}
            </tbody>
          </table>
        </div>
      )}
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
                <div className="like_">
                  {comment.likesCount + comment.dislikesCount !== 0 && (
                    <p className="like_counts">{comment.likesCount}</p>
                  )}
                  <Button onClick={() => handleClickLikeComment(comment)}>
                    <LikeOutlined />
                  </Button>
                </div>
                <div className="like_">
                  {comment.dislikesCount + comment.likesCount !== 0 && (
                    <p className="like_counts">{comment.dislikesCount}</p>
                  )}
                  <Button onClick={() => handleClickDislikeComment(comment)}>
                    <DislikeOutlined />
                  </Button>
                </div>
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

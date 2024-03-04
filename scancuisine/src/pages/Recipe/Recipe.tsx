import React from "react";
import "./Recipe.css";
import { Button } from "antd";
import { LikeOutlined, DislikeOutlined } from "@ant-design/icons";

function Recipe() {
  return (
    <div className="recipe">
      <h1 className="recipe-title">Berry Cake</h1>
      <div className="recipe-container">
        <div className="image-conatiner">
          <img src="./prajitura2.jpg" className="recipe-image" alt="recipe" />
        </div>
        <div className="recipe-ingredients">
          <h2 className="sub-title">Ingredients</h2>
          <div className="recipe-ingredients-container">
            <ul>
              <li>A vanilla cake sponge</li>
              <li>600 grams frozen mixed berries</li>
              <li>100 grams sugar </li>
              <li>500 grams mascarpone cheese</li>
              <li>600 grams Greek yogurt (10% fat)</li>
              <li>200 grams sugar</li>
              <li> 2 packets of vanilla sugar / vanilla essence </li>
              <li>3 gelatin</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="recipe-instructions">
        <div className="recipe-preparation">
          <h2 className="sub-title">Method of preparation</h2>
          <p>
            STEP 1: With an electric mixer, cream together mascarpone, agave
            syrup and vanilla bean paste. Then add the powdered sugar and mix it
            together until smooth. Add the heavy cream and whip it until stiff
            peaks and it holds its shape.
          </p>
          <p>
            STEP 2: Clean the berries. Slice the strawberries, blackberries and
            raspberries into smaller pieces.
          </p>
          <p>
            STEP 3: Add the first cake layer on a cake tray. Add ⅓ of the
            mascarpone cream on the cake layer and even it out. Add ⅓ of the
            berries in an even layer, slightly pressing them down into cream.
            Continue and do the same with the next two layers.
          </p>
        </div>
        <div className="recipe-video">
          <h2 className="sub-title">Video </h2>
          <video controls className="video-container">
            <source src="./prajitura.mp4" type="video/mp4" />
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
        <div className="comments-container">
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
        </div>
      </div>
    </div>
  );
}

export default Recipe;

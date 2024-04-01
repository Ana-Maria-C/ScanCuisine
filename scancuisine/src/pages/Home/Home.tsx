import React from "react";
import CustomCard from "../../components/CustomCard/CustomCard";
import "./Home.css";

function Home() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="home">
      <h1 className="title">Welcome to Scan Cuisine</h1>
      <div className="home-container">
        <div className="latest-recipes">
          <h2>Latest Recipes</h2>
          <div className="recipes-container">
            <CustomCard id="1" imageUrl="./mancare1.jpg" title="Soup" />
            <CustomCard id="2" imageUrl="./mancare2.jpg" title="Lasagna" />
            <CustomCard id="3" imageUrl="./mancare3.jpg" title="Pasta" />
            <CustomCard id="4" imageUrl="./prajitura1.jpg" title="Lava Cake" />
            <CustomCard id="5" imageUrl="./prajitura2.jpg" title="Berry Cake" />
          </div>
        </div>
        <div className="popular-recipes">
          <h2>Popular Recipes</h2>
          <div className="recipes-container">
            <CustomCard id="1" imageUrl="./mancare1.jpg" title="Soup" />
            <CustomCard id="2" imageUrl="./mancare2.jpg" title="Lasagna" />
            <CustomCard id="3" imageUrl="./mancare3.jpg" title="Pasta" />
            <CustomCard id="4" imageUrl="./prajitura1.jpg" title="Lava Cake" />
            <CustomCard id="5" imageUrl="./prajitura2.jpg" title="Berry Cake" />
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

export default Home;

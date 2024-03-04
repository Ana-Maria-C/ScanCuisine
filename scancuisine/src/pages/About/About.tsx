import React from "react";
import "./About.css";

function About() {
  return (
    <div>
      <h1>About Us</h1>
      <div className="about-us-container">
        <div className="motivation">
          <h2 className="motivation-title">Motivation</h2>
          <p>
            My passion for cooking began in high school when I discovered that I
            have a sweet tooth, especially when it comes to desserts. However,
            excessive consumption of commercial sweets led to health issues and
            a constant struggle with extra weight. As a solution, I started
            cooking at home to control the ingredients and my health. However,
            finding suitable recipes and the time spent in the kitchen became
            constant challenges. After briefly giving up the habit of cooking
            healthy meals, I realized that this is a common problem for others
            around me as well. In college, the lack of home-cooked meals led to
            excessive consumption of fast food and commercial sweets, and all my
            classmates and friends had the same excuses. This experience
            motivated me to find solutions to promote a healthy and accessible
            lifestyle for everyone.
          </p>
        </div>
        <div className="purpose">
          <h2 className="purpose-title">Purpose</h2>
          <p>
            Scan Cuisine is a solution that helps both students and individuals
            who have moved away from home, don't know how to cook, don't have
            enough money to prepare sophisticated meals, as well as anyone who
            wants to learn to cook, desires a more diverse diet, has run out of
            ideas for breakfast, lunch, dinner, etc., or simply doesn't want to
            waste the food left in the refrigerator.
          </p>
        </div>
        <div className="community">
          <h2 className="community-title">Scan Cuisine Community</h2>
          <p>
            The Scan Cuisine community is comprised of passionate individuals
            about cooking, whether they are professional chefs or just beginning
            to develop their culinary skills, their place is here. Scan Cuisine
            is the place where you can learn new techniques, discover unique
            ingredients, and explore diverse culinary cultures alongside other
            enthusiasts. Whether you want to share the secrets of a family
            recipe or experiment with new flavor combinations, in our community,
            you will always find support and encouragement from those who share
            the same passion as you. Here, each contribution brings a unique
            touch and inspires other members of the community to try their hand
            in the kitchen.
          </p>
        </div>
        <div className="rules">
          <h2 className="rules-title">The Scan Cuisine rules:</h2>
          <ul>
            <li>Be creative</li>
            <li>Be curious</li>
            <li>Be bold</li>
            <li>Be supportive</li>
            <li>Learn</li>
            <li>Share with others</li>
          </ul>
        </div>
        <div className="team">
          <h2 className="team-title"> Meet the Team</h2>
          <div className="team-container">
            <img src="./profile.jpeg" alt="team" className="team-image" />
            <div className="team-description">
              <p className="team-name">Constantin Ana-Maria</p>
              <p className="team-position"> Developer</p>
              <p className="team-info">
                She is a person passionate about cooking and programming, who
                found a solution to combine both into a project that helps
                cooking community. Creative and a food lover, she invested time
                and passion into an application that will sweeten your soul
                because love goes through the stomach.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;

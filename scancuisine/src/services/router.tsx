import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import React from "react";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import About from "../pages/About/About";
import Navbar from "../components/Navbar/Navbar";
import MyProfile from "../pages/MyProfile/MyProfile";
import Recipe from "../pages/Recipe/Recipe";
import SearchResults from "../pages/SearchResults/SearchResults";
import CategoryRecipes from "../pages/CategoryRecipes/CategoryRecipes";
import CuisineRecipes from "../pages/CuisineRecipes/CuisineRecipes";
import Recipe_from_api from "../pages/Recipe_from_api/Recipe_from_api";
import EmptyPage from "../pages/EmptyPage/EmptyPage";

export const router = (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/myprofile" element={<MyProfile />} />
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/recipe/:id" element={<Recipe />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/category/:categoryName" element={<CategoryRecipes />} />
      <Route path="/cuisine/:cuisineName" element={<CuisineRecipes />} />
      <Route path="/recipe_from_api" element={<Recipe_from_api />} />
      <Route path="*" element={<EmptyPage />} />
    </Routes>
  </Router>
);

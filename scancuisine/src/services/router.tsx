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

export const router = (
  <Router>
    <Navbar></Navbar>
    <Routes>
      <Route path="/myprofile" element={<MyProfile />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/recipe/:id" element={<Recipe />} />
      <Route path="/search" element={<SearchResults />} />
    </Routes>
  </Router>
);

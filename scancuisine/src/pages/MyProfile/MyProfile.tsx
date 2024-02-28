import React, { useState } from "react";
import "./MyProfile.css";
import { UserOutlined } from "@ant-design/icons";

function MyProfile() {
  const [name, setName] = useState("John");
  const [surname, setSurname] = useState("Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Aici puteți adăuga logica pentru a trimite datele la server sau pentru a le salva local
  };

  return (
    <div className="myprofile">
      <h1>My Profile</h1>
      <div className="profiledetails">
        <div>
          <i className="photo">
            <UserOutlined />
          </i>
        </div>
        <div className="form">
          <div className="form-group">
            <label htmlFor="name">Nume:</label>
            {isEditing ? (
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : (
              <div>{name}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="surname">Prenume:</label>
            {isEditing ? (
              <input
                type="text"
                id="surname"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
            ) : (
              <div>{surname}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            {isEditing ? (
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            ) : (
              <div>{email}</div>
            )}
          </div>
          {isEditing ? (
            <button onClick={handleSave}>Save</button>
          ) : (
            <button onClick={handleEdit}>Edit</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyProfile;

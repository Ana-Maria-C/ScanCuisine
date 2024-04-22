import React, { useState } from "react";
import Modal from "react-modal";
import "./AddCommentModal.css";
import axios from "axios";

interface AddCommentModalProps {
  visible: boolean;
  onCancel: () => void;
  onCommentAdded: () => void;
  recipeId?: string;
}

interface CommentData {
  id: string;
  recipeId: string;
  authorEmail: string;
  comment: string;
  likesCount: number;
  dislikesCount: number;
}

function AddCommentModal({
  visible,
  onCancel,
  onCommentAdded,
  recipeId,
}: AddCommentModalProps) {
  const [commentData, setCommentData] = useState<CommentData>({
    id: "",
    recipeId: "",
    authorEmail: "",
    comment: "",
    likesCount: 0,
    dislikesCount: 0,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCommentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setCommentData((prevData) => ({
      ...prevData,
      [e.target.name]: file,
    }));
  };

  const handleAddClick = async () => {
    if (!recipeId) {
      console.error("Recipe ID is not defined!");
      return;
    }

    const myToken = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `http://localhost:8090/api/users/token/${myToken}`
      );
      const userEmail = response.data.email;

      // Actualizează comentariul cu emailul și recipeId-ul
      const updatedCommentData = {
        ...commentData,
        authorEmail: userEmail,
        recipeId: recipeId,
      };

      // Trimite datele actualizate către server
      const addedComment = await axios.post(
        `http://localhost:8090/api/recipe-comments`,
        updatedCommentData
      );
      // Resetează formularul și apelează funcția de notificare a adăugării comentariului
      setCommentData({
        id: "",
        recipeId: "",
        authorEmail: "",
        comment: "",
        likesCount: 0,
        dislikesCount: 0,
      });

      onCommentAdded();
      onCancel(); // Închide modalul după adăugarea comentariului
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <Modal
      isOpen={visible}
      onRequestClose={onCancel}
      contentLabel="Add Recipe"
      className="comment-container"
      overlayClassName="modal-overlay"
    >
      <div className="comment-content">
        <h2 className="comment-title">Add Comment</h2>
        <div>
          <textarea
            name="comment"
            className="comment-input"
            placeholder="Enter your comment"
            value={commentData.comment}
            onChange={handleInputChange}
          />
        </div>
        <div className="buttons-container">
          <button className="add-button" onClick={handleAddClick}>
            Add
          </button>
          <button className="close-button" onClick={onCancel}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default AddCommentModal;

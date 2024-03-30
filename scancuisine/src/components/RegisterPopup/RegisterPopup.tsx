import React, { useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import "./RegisterPopup.css";

function PopupModal() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleOkClick = () => {
    closeModal();
    navigate("/login");
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Account Created Popup"
      className="modal-container"
      overlayClassName="modal-overlay"
    >
      <h2 className="modal-title">Account Created</h2>
      <p className="modal-message">
        Your account has been created. Please go to the login page.
      </p>
      <button className="modal-button" onClick={handleOkClick}>
        Ok
      </button>
    </Modal>
  );
}

export default PopupModal;

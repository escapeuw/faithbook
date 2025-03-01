import "./ui.css";
import { useState, useEffect } from "react";

const ConfirmModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>Are you sure you want to delete this post?</h3>
                <div style={{ display: "flex", justifyContent: "center", gap: "1rem"}}>
                    <button className="small-button edit-button" onClick={onConfirm}>Delete</button>
                    <button className="small-button cancel-button" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal
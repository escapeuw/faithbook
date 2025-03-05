import "./ui.css";
import { useState, useEffect } from "react";

const ConfirmModal = ({ isOpen, onClose, onConfirm, isDeleting }) => {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Disable scrolling

        } else {
            // Enable scrolling again when the modal is closed
            document.body.style.overflow = "";
        }

        // Clean up: Ensure that scrolling is enabled when the component is unmounted or modal is closed
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]); // This effect runs whenever isOpen changes

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h3>Are you sure you want to delete this post?</h3>
                <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
                    <button
                        className="small-button edit-button"
                        onClick={onConfirm}
                        disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                    <button className="small-button cancel-button" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal
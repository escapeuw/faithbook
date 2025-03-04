import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify"; // import toast
import { Pencil, Trash2, CircleHelp, Search, MessageCircleMore, MessageCircleHeart } from "lucide-react";
import "./ui.css";
import ConfirmModal from "./ConfirmModal.jsx";

function DevotionPost({ id, userTitle, username, profilePic, likes, reports, content, bibleVerse,
    timestamp, owner, onDelete, likeStatus }) {
    const defaultProfilePic = "https://faithbookbucket.s3.amazonaws.com/empty_profile.jpg";
    const displayProfilePic = profilePic || defaultProfilePic;

    const formattedTimestamp = new Date(timestamp).toLocaleString();

    const [isExpanded, setIsExpanded] = useState(false);
    const [likeCount, setLikeCount] = useState(likes);
    const [isLiked, setIsLiked] = useState(likeStatus); // Track if user has liked
    const [isEditing, setIsEditing] = useState(false);
    const [edit, setEdit] = useState(content);
    const [displayContent, setDisplayContent] = useState(content);
    const [modal, setModal] = useState(false);

    const likeUrl = `https://faithbook-production.up.railway.app/posts/${id}/like`;   // Ensure this matches the backend route
    const likeStatusUrl = `https://faithbook-production.up.railway.app/posts/${id}/like-status`;
    const editUrl = `https://faithbook-production.up.railway.app/posts/${id}`;

    const token = localStorage.getItem('token');
    const charLimit = 333;

    const titleBadges = {
        "committed-believer":
            (<div className="tooltip-container">
                <MessageCircleHeart
                    className="title-icon title-committed"
                    size="1rem" />
                <div className="tooltip">Committed-Believer</div>
            </div>),

        "doubting-believer":
            (<div className="tooltip-container">
                <MessageCircleMore
                    className="title-icon title-doubting"
                    size="1rem" />
                <div className="tooltip">Doubting-Believer</div>
            </div>),
        "seeker":
            (<div className="tooltip-container">
                <Search
                    className="title-icon title-seeker"
                    size="1rem" />
                <div className="tooltip">Seeker</div>
            </div>),
        "skeptic":
            (<div className="tooltip-container">
                <CircleHelp
                    className="title-icon title-skeptic"
                    size="1rem" />
                <div className="tooltip">Skeptic</div>
            </div>)
    };

    // edit and save a post
    const handleSave = async () => {
        if (edit === "") {
            alert("Input is required!");
            return
        }

        const inputRegex = /^[a-zA-Z0-9\s.,!?;'"()&]*$/;

        // Check if the content matches the regex
        if (!inputRegex.test(edit)) {
            alert("Content contains invalid characters. Please use letters, numbers, and basic punctuation.");
            setIsEditing(false);  // Immediately stop editing
            setEdit(content);
            return;
        }

        try {
            const response = await axios.put(editUrl, { content: edit },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true
                });

            console.log('Post updated:', response.data);
            // re-rendering
            setDisplayContent(edit);
            // closes edit mode
            setIsEditing(false);

        } catch (error) {
            console.error(`Error:`, error);
            setIsEditing(false);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(editUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true
            })
            if (response.status === 200) {
                console.log("Post deleted successfully");
                setModal(false);
                onDelete(id);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleLike = async () => {

        try {
            const response = await axios.post(likeUrl, {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true
                });
            // Update Like count
            setLikeCount(response.data.likes);

            if (response.status === 201) {
                setIsLiked(true);      // liked
            } else if (response.status === 200) {
                setIsLiked(false);     // unliked
            }

        } catch (error) {
            console.error("Error liking the post:", error);
        }
    };

   

    return (
        <div className="center card">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="flex-left" style={{ gap: "1rem" }}>
                    <img style={{
                        height: "3.5rem", width: "3.5rem", borderRadius: "50%",
                        objectFit: "cover", objectPosition: "center"
                    }}
                        src={displayProfilePic} alt={username} />
                    <div className="this">
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <p style={{ fontWeight: "600" }}>{username}</p>
                            <span style={{ marginTop: "0.15rem" }}>
                                {titleBadges[userTitle]}
                            </span>
                        </div>
                        <p style={{ color: "gray", fontSize: "0.75rem" }}>{formattedTimestamp}</p>
                    </div>
                </div>
                {owner && (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Pencil
                            onClick={() => setIsEditing(true)}
                            size="0.85rem" style={{ cursor: "pointer" }} />
                        <Trash2
                            onClick={() => setModal(true)}
                            size="0.85rem" style={{ cursor: "pointer" }} />
                    </div>)}
            </div>

            <div style={{ textAlign: "left", overflow: "hidden" }}>
                <p className="purple-bar bold">{bibleVerse}</p>
                {isEditing ? (
                    <div>
                        <div className="post-textarea" style={{ width: "100%" }}>
                            <textarea className="content input-text"
                                value={edit}
                                onChange={(e) => setEdit(e.target.value)}
                                required>
                            </textarea>
                        </div>
                        <div style={{ display: "flex", justifyContent: "end", gap: "0.5rem" }}>
                            <button className="edit-button small-button"
                                onClick={handleSave}>Save</button>
                            <button className="cancel-button small-button"
                                onClick={() => {
                                    setEdit(content);
                                    setIsEditing(false)
                                }}>
                                Cancel</button>
                        </div>
                    </div>
                ) : (
                    <p style={{ whiteSpace: "pre-wrap" }}>
                        {(isExpanded || displayContent.length <= charLimit)
                            ? displayContent
                            : displayContent.substring(0, charLimit) + "... "}
                        {(displayContent.length > charLimit) && (
                            <span onClick={() => setIsExpanded(!isExpanded)}
                                style={{ fontWeight: "500", color: "#4A90E2", cursor: "pointer" }}
                                onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                                onMouseLeave={(e) => e.target.style.textDecoration = "none"}>
                                {isExpanded ? "collapse" : "more"}
                            </span>
                        )}
                    </p>
                )}
                <p style={{
                    fontSize: "1.15rem", display: "flex", alignItems: "center",
                    gap: "0.35rem", paddingLeft: "0.1rem"
                }} >
                    <Heart
                        style={{
                            width: "1.25rem", height: "1.25rem",
                            color: isLiked ? "#FF5350" : "",
                            transition: "transform 0.25s ease"
                        }}
                        fill={isLiked ? "#FF5350" : "none"}
                        className="like"
                        onClick={handleLike}
                    />
                    <span>{likeCount}</span>
                </p>
            </div>
            <ConfirmModal
                isOpen={modal}
                onClose={() => setModal(false)}
                onConfirm={handleDelete}
            />
        </div>
    )
}

export default DevotionPost;
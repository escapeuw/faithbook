import { useState } from "react";
import { Heart } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify"; // import toast
import { Pencil, Trash2, MessageCircle } from "lucide-react";
import "./ui.css";
import ConfirmModal from "./ConfirmModal.jsx";
import PostModal from "./PostModal.jsx";
import { usePost } from "../PostContext.jsx";
import FormatTimestamp from "./FormatTimestamp.jsx";
import { titleBadges } from "./titleBadges.jsx";

function DevotionPost({ id, userTitle, username, profilePic, likes, reports, content, bibleVerse,
    timestamp, owner, onDelete, likeStatus, repliesCount }) {
    const defaultProfilePic = "https://faithbookbucket.s3.amazonaws.com/empty_profile.jpg";
    const displayProfilePic = profilePic || defaultProfilePic;

    const formattedTimestamp = FormatTimestamp(timestamp);

    const [isExpanded, setIsExpanded] = useState(false);
    const [likeCount, setLikeCount] = useState(likes);
    const [isLiked, setIsLiked] = useState(likeStatus); // Track if user has liked
    const [isEditing, setIsEditing] = useState(false);
    const [edit, setEdit] = useState(content);
    const [displayContent, setDisplayContent] = useState(content);
    const [modal, setModal] = useState(false);
    const [postModal, setPostModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [updatedRepliesCount, setUpdatedRepliesCount] = useState(repliesCount);

    const handleReplyAdded = () => {
        setUpdatedRepliesCount(prevCount => prevCount + 1); // Increment the replies count
    };


    const { setSelectedPost } = usePost(); // get function to update selected post

    const likeUrl = `https://faithbook-production.up.railway.app/posts/${id}/like`;   // Ensure this matches the backend route
    const likeStatusUrl = `https://faithbook-production.up.railway.app/posts/${id}/like-status`;
    const editUrl = `https://faithbook-production.up.railway.app/posts/${id}`;

    const token = localStorage.getItem('token');
    const charLimit = 333;


    // edit and save a post
    const handleSave = async () => {
        if (edit === "") {
            alert("Input is required!");
            return
        }

        const inputRegex = /^[^\p{M}\x00-\x1F\x7F-\x9F]+$/u;

        // Check if the content matches the regex
        if (!inputRegex.test(edit)) {
            alert("Content contains invalid characters. Please use letters, numbers, and basic punctuation.");
            setIsEditing(false);  // Immediately stop editing
            setEdit(content);
            return;
        }

        if (isSaving) return;
        setIsSaving(true);

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
        } finally {
            setIsSaving(false);
        }
    };


    // delete
    const handleDelete = async () => {
        if (isDeleting) return;

        setIsDeleting(true); // Disable button
        try {
            const response = await axios.delete(editUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true
            });

            if (response.status === 200) {
                console.log("Post deleted successfully");
                setModal(false);
                onDelete(id);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsDeleting(false); // re-enable button
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

    const handleCommentClick = () => {
        const postDetails = {
            id,
            userTitle,
            username,
            profilePic,
            likes,
            reports,
            content,
            bibleVerse,
            timestamp,
            owner,
            onDelete,
            likeStatus,
            repliesCount
        };

        setSelectedPost(postDetails);
        setPostModal(true);
    }


    return (
        <div className="center card">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div className="flex-left" style={{ gap: "1rem" }}>
                    <img style={{
                        height: "3.5rem", width: "3.5rem", borderRadius: "50%",
                        objectFit: "cover", objectPosition: "center"
                    }}
                        src={displayProfilePic} alt={username} />
                    <div className="this"
                        style={{ gap: userTitle === "skeptic" ? "0.15rem" : "0.25rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <div style={{ fontWeight: "600" }}>
                                {username}
                            </div>
                            <span style={{ marginTop: "0.15rem" }}>
                                {titleBadges[userTitle]}
                            </span>
                        </div>
                        <div style={{ color: "gray", fontSize: "0.75rem" }}>{formattedTimestamp}</div>
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
                            <textarea
                                className="content input-text"
                                value={edit}
                                onChange={(e) => setEdit(e.target.value)}
                                required>
                            </textarea>
                        </div>
                        <div style={{ display: "flex", justifyContent: "end", gap: "0.5rem" }}>
                            <button
                                className="edit-button small-button"
                                onClick={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? "Saving..." : "Save"}
                            </button>
                            <button
                                className="cancel-button small-button"
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
                <div className="post-bottom">
                    <p>
                        <Heart
                            style={{
                                width: "1.25rem", height: "1.25rem",
                                color: isLiked ? "#FF5350" : "",
                                transition: "transform 0.25s ease"
                            }}
                            fill={isLiked ? "#FF5350" : "none"}
                            className="like-and-comment"
                            onClick={handleLike}
                        />
                        <span>{likeCount}</span>
                    </p>
                    <p>
                        <MessageCircle
                            style={{
                                width: "1.25rem", height: "1.25rem"
                            }}
                            className="like-and-comment"
                            onClick={handleCommentClick} />
                        <span>{updatedRepliesCount}</span>
                    </p>
                </div>
            </div>
            <ConfirmModal
                isOpen={modal}
                onClose={() => setModal(false)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                setisDeleting={setIsDeleting}
            />
            <PostModal
                isOpen={postModal}
                onClose={() => setPostModal(false)}
                onReplyAdded={handleReplyAdded}
            />
        </div>
    )
}

export default DevotionPost;
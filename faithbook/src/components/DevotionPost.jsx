import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // import toast
import { Heart, Pencil, Trash2, MessageCircle, Quote } from "lucide-react";
import "./ui.css";
import ConfirmModal from "./ConfirmModal.jsx";
import PostModal from "./PostModal.jsx";
import LikeModal from "./LikeModal.jsx";
import { usePost } from "../PostContext.jsx";
import FormatTimestamp from "./FormatTimestamp.jsx";
import { titleBadges } from "./titleBadges.jsx";

function DevotionPost({ id, userTitle, username, profilePic, likes, reports, content, title, bibleVerse,
    timestamp, owner, onDelete, likeStatus, repliesCount, likeDetails }) {
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
    const [likeModal, setLikeModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [updatedRepliesCount, setUpdatedRepliesCount] = useState(repliesCount);
    const [likedUsers, setLikedUsers] = useState([]);

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
            setEdit(edit)
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

    // when user clicks like button
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

    // when user clicks comment button
    const handleCommentClick = () => {
        const postDetails = {
            id,
            userTitle,
            username,
            profilePic,
            likes,
            reports,
            content,
            title,
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

    // liked users list ( when "others" clicked )
    const handleLikedUsers = async () => {
        const likedUsersUrl = `https://faithbook-production.up.railway.app/posts/${id}/liked-users`;
        try {
            if (likedUsers.length === 0) {      // only fetch if no data is cached
                const response = await axios.get(likedUsersUrl);
                setLikedUsers(response.data);      // cache fetched data
            }

        } catch (err) {
            console.error("Error fetching liked users", err.response?.data || err.message);
        } finally {
            setLikeModal(true);
        }
    }




    // Display users who liked the post 

    const formatLiker = (detail) => {
        if (!detail || detail.likers.length === 0) {
            return
        } else if (detail.likers.length === 1) {
            return (
                <span className="likers">
                    <img src={detail.likers[0].profilePicture}
                        style={{
                            width: "1.25rem", height: "1.25rem", borderRadius: "50%",
                            objectFit: "cover"
                        }} />
                    <span>&nbsp;{detail.likers[0].username.split(" ")[0]}</span>
                </span>
            )
        } else if (detail.likers.length === 2) {
            return (
                <span className="likers">
                    <img src={detail.likers[0].profilePicture}
                        style={{
                            width: "1.25rem", height: "1.25rem", borderRadius: "50%",
                            objectFit: "cover", marginRight: "-0.5rem"
                        }} />
                    <img src={detail.likers[1].profilePicture}
                        style={{
                            width: "1.25rem", height: "1.25rem", borderRadius: "50%",
                            objectFit: "cover"
                        }} />
                    <span>&nbsp;{detail.likers[0].username.split(" ")[0]} and&nbsp;</span>
                    <span>{detail.likers[1].username.split(" ")[0]}</span>
                </span>
            )
        } else {
            return (
                <span className="likers">
                    <img src={detail.likers[0].profilePicture}
                        style={{
                            width: "1.25rem", height: "1.25rem", borderRadius: "50%",
                            objectFit: "cover", marginRight: "-0.5rem"
                        }} />
                    <img src={detail.likers[1].profilePicture}
                        style={{
                            width: "1.25rem", height: "1.25rem", borderRadius: "50%",
                            objectFit: "cover", marginRight: "-0.5rem"
                        }} />
                    <img src={detail.likers[2].profilePicture}
                        style={{
                            width: "1.25rem", height: "1.25rem", borderRadius: "50%",
                            objectFit: "cover"
                        }} />
                    <span>&nbsp;{detail.likers[0].username.split(" ")[0]} ,&nbsp;</span>
                    <span>{detail.likers[1].username.split(" ")[0]}</span>
                    <span>&nbsp;and <span
                        style={{ fontWeight: "bold", cursor: "pointer" }}
                        onClick={handleLikedUsers}>others</span></span>
                </span>
            )
        }
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

            <div style={{ textAlign: "left", overflow: "hidden"}}>
                {/* Post title and bible verse */}
                <div className="purple-bar"
                    style={{
                        display: "flex", flexDirection: "column", gap: "0.5rem",
                        margin: "0.75rem 0"
                    }}>
                    <div className="bold">{title}</div>
                    {bibleVerse ?
                        <div style={{
                            display: "flex", background: "#edeceb", padding: "0.5rem",
                            borderRadius: "10px", justifyContent: "center", width: "max-content",
                            maxWidth: "95%"
                        }}>
                            <div>
                                <Quote style={{ transform: "rotate(180deg)" }}
                                    fill="#8b8a8a" size="0.7rem" color="#8b8a8a" />
                            </div>
                            <div className="display-verse">
                                
                                {bibleVerse}
                            </div>
                            <div style={{
                                display: "flex", alignItems: "flex-end"
                            }}>
                                <Quote size="0.7rem" fill="#8b8a8a" color="#8b8a8a" />
                            </div>
                        </div> : null}
                </div>
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
                        <span>{formatLiker(likeDetails)}</span>
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
            <LikeModal
                isOpen={likeModal}
                likedUsers={likedUsers}
                onClose={() => setLikeModal(false)}
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
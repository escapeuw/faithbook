import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import axios from "axios";
import { CircleHelp, Search, MessageCircleMore, MessageCircleHeart } from "lucide-react";
import "./ui.css";

function DevotionPost({ id, userTitle, username, profilePic, likes, reports, content, bibleVerse, timestamp }) {
    const defaultProfilePic = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158";
    const displayProfilePic = profilePic || defaultProfilePic;

    const formattedTimestamp = new Date(timestamp).toLocaleString();

    const [isExpanded, setIsExpanded] = useState(false);
    const [likeCount, setLikeCount] = useState(likes);
    const [isLiked, setIsLiked] = useState(false); // Track if user has liked

    const likeUrl = `https://faithbook-production.up.railway.app/posts/${id}/like`;   // Ensure this matches the backend route
    const likeStatusUrl = `https://faithbook-production.up.railway.app/posts/${id}/like-status`;
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

    // Fetch like status
    const checkLikeStatus = async () => {

        if (!token) return; // If no token, exit (user is not logged in)

        try {
            const response = await axios.get(likeStatusUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.isLiked) {
                setIsLiked(true);
            }
        } catch (error) {
            console.error('Error fetching like status:', error);
        }
    };

    useEffect(() => {
        checkLikeStatus(); // Check if the user has already liked the post when the component mounts
    }, [id]);


    return (
        <div className="center card">
            <div className="flex-left" style={{ gap: "1rem" }}>
                <img style={{ height: "3rem", width: "3rem", borderRadius: "50%" }}
                    src={displayProfilePic} alt={username} />
                <div className="this">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <p style={{ fontWeight: "600" }}>{username}</p>
                        <span style={{ marginTop: "0.15rem" }}>
                            {titleBadges[userTitle]}
                        </span>
                    </div>
                    <p style={{ color: "gray", fontSize: "0.85rem" }}>{formattedTimestamp}</p>
                </div>
            </div>
            <div style={{ textAlign: "left", overflow: "hidden" }}>
                <p className="purple-bar bold">{bibleVerse}</p>
                <p style={{ whiteSpace: "pre-wrap" }}>
                    {(isExpanded || content.length <= charLimit)
                        ? content
                        : content.substring(0, charLimit) + "..."}
                    {content.length > charLimit && (
                        <span onClick={() => setIsExpanded(!isExpanded)}
                            style={{ fontWeight: "500", color: "#4A90E2", cursor: "pointer" }}
                            onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                            onMouseLeave={(e) => e.target.style.textDecoration = "none"}>
                            {isExpanded ? " collapse" : " more"}
                        </span>
                    )}
                </p>
                <p style={{ fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "0.35rem" }} >
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
        </div>


    )
}

export default DevotionPost;
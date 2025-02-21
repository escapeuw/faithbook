import { useState } from "react";
import { Heart } from "lucide-react";
import axios from "axios";

function DevotionPost({ id, username, profilePic, likes, reports, content, bibleVerse, timestamp }) {
    const defaultProfilePic = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158";
    const displayProfilePic = profilePic || defaultProfilePic;

    const formattedTimestamp = new Date(timestamp).toLocaleString();

    const [isExpanded, setIsExpanded] = useState(false);
    const [likeCount, setLikeCount] = useState(likes);
    const [isLiked, setIsLiked] = useState(false); // Track if user has liked

    const charLimit = 333;

    const handleLike = async () => {
        const likeUrl = `https://faithbook-production.up.railway.app/posts/${id}/like`; // Ensure this matches the backend route
        const token = localStorage.getItem('token'); 
        
        if (isLiked) return; // prevent multiple likes on client side too

        try {
            const response = await axios.post(likeUrl, {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true
                });

            if (response.status === 201) {
                setLikeCount(response.data.likes);
                setIsLiked(true);
            }
        } catch (error) {
            console.error("Error liking the post:", error);
        }
    };

    return (
        <div className="center card">
            <div className="flex-left" style={{ gap: "1rem" }}>
                <img style={{ height: "3rem", width: "3rem", borderRadius: "50%" }}
                    src={displayProfilePic} alt={username} />
                <div className="this">
                    <p style={{ fontWeight: "600" }}>{username}</p>
                    <p style={{ color: "gray", fontSize: "0.85rem" }}>{formattedTimestamp}</p>
                </div>
            </div>
            <div style={{ textAlign: "left" }}>
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
                <p style={{ fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }} >
                    <Heart
                        style={{ width: "1.25rem", height: "1.25rem" }}
                        className="inline"
                        onClick={handleLike}
                    />
                    <span>{likeCount}</span>
                </p>
            </div>
        </div>


    )
}

export default DevotionPost;
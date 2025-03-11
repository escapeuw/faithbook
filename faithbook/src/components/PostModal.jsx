import "./ui.css";
import { useState, useEffect } from "react";
import { usePost } from "../PostContext";
import { Heart, X, CircleChevronRight } from "lucide-react";
import { titleBadges } from "./titleBadges.jsx";
import FormatTimestamp from "./FormatTimestamp.jsx";

const PostModal = ({ isOpen, onClose, onReplyAdded }) => {
    const [comment, setComment] = useState("");
    const [postReplies, setPostReplies] = useState([]);
    const [isPosting, setIsPosting] = useState(false);

    const { selectedPost, setSelectedPost } = usePost();

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


    useEffect(() => {

        if (!isOpen || !selectedPost?.id) return;

        const fetchReplies = async () => {
            try {
                const response = await fetch(`https://faithbook-production.up.railway.app/reply/${selectedPost.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData || "Failed to fetch replies");
                }
                const data = await response.json();
                setPostReplies(data);


            } catch (err) {
                console.error("Failed to fetch replies", err);
            }
        }

        fetchReplies();
    }, [isOpen]);

    if (!isOpen || !selectedPost) {
        return null;
    }


    const handleReply = async () => {
        if (isPosting) return; // ensures repeated request is impossible
        if (comment === "") {
            alert("Comments cannot be blank");
            return
        }
        const inputRegex = /^[^\p{M}\x00-\x1F\x7F-\x9F]+$/u;

        // Check if the content matches the regex
        if (!inputRegex.test(comment)) {
            alert("Content contains invalid characters. Please use letters, numbers, and basic punctuation.");
            return;
        }


        setIsPosting(true);

        try {
            const token = localStorage.getItem("token")
            const response = await fetch("https://faithbook-production.up.railway.app/reply/create", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    postId: selectedPost.id,
                    content: comment
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData || "Failed to post reply");
            }

            const newReply = await response.json();

            setPostReplies((prevPostReplies) => [newReply, ...prevPostReplies]); // caching new replies
            onReplyAdded();
        } catch (err) {
            console.error("Failed to post reply", err);
        } finally {
            setIsPosting(false);
            setComment("");
            alert("Comment posted successfully");
        }
    }


    const formattedTimestamp = FormatTimestamp(selectedPost.timestamp);

    return (
        <div className="modal-overlay">
            <div className="card post-modal center">
                <div style={{
                    display: "flex", justifyContent: "space-between",
                    borderBottom: "1px solid lightgray"
                }}
                >
                    <div className="flex-left" style={{ gap: "1rem" }}>
                        <img style={{
                            height: "3rem", width: "3rem", borderRadius: "50%",
                            objectFit: "cover", objectPosition: "center"
                        }}
                            src={selectedPost.profilePic} alt={selectedPost.username} />
                        <div className="this">
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <div style={{ fontWeight: "600" }}>
                                    {selectedPost.username}
                                </div>
                                <span style={{ marginTop: "0.15rem" }}>
                                    {titleBadges[selectedPost.userTitle]}
                                </span>
                            </div>
                            <div style={{ color: "gray", fontSize: "0.75rem" }}>
                                {formattedTimestamp}
                            </div>
                        </div>
                    </div>
                    <X size="1.25rem"
                        onClick={onClose} />
                </div>
                <div className="post-modal-inner">
                    <p className="purple-bar bold">
                        {selectedPost.bibleVerse}
                    </p>
                    <p className="post-modal-content">
                        {selectedPost.content}
                    </p>

                    <div className="comment-container">
                        {postReplies.map(reply => (
                            <div className="comment" key={reply.id}>
                                <img style={{
                                    height: "3rem", width: "3rem", borderRadius: "50%",
                                    objectFit: "cover", objectPosition: "center"
                                }}
                                    src={reply.User?.UserSpecific?.profilePic ||
                                        "https://faithbookbucket.s3.amazonaws.com/empty_profile.jpg"} />
                                <div>
                                    <div className="comment-box"
                                        style={{ display: "inline-block" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "500" }}>
                                            {reply.User?.username}
                                            <span style={{ marginTop: "0.15rem" }}>
                                                {titleBadges[reply.User?.title]}
                                            </span>
                                        </div>
                                        {reply.content}
                                    </div>
                                    <div className="comment-under">
                                        <span style={{ fontSize: "0.75rem" }}>{FormatTimestamp(reply.createdAt)}</span>
                                        <span>·</span>
                                        <span style={{ display: "flex", alignItems: "center"}}>
                                            <Heart size="1rem" style={{ paddingRight: "0.25rem" }} />{reply.likes}</span>
                                        <span style={{ fontWeight: "500", textAlign: "center" }}>Reply</span>
                                    </div>
                                </div>
                            </div>
                        )
                        )}
                    </div>
                </div>
                <div className="input-comment-container"
                    style={{
                        display: "flex", flexDirection: "column",
                        height: "15%", marginTop: "0.5rem"
                    }}>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="input-comment"
                        placeholder="Write a comment..."
                        required
                        maxLength={500}>
                    </textarea>
                    <div style={{
                        display: "flex", justifyContent: "flex-end", margin: "0.25rem"
                    }}>
                        <CircleChevronRight
                            onClick={handleReply}
                            color="#9b87f5"
                            style={{ cursor: "pointer" }} />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default PostModal;

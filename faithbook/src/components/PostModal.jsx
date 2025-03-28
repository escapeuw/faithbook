import "./ui.css";
import { useState, useEffect } from "react";
import { usePost } from "../PostContext";
import { Heart, X, CircleChevronRight } from "lucide-react";
import { titleBadges } from "./titleBadges.jsx";
import FormatTimestamp from "./FormatTimestamp.jsx";

const PostModal = ({ isOpen, onClose, onReplyAdded }) => {
    const [comment, setComment] = useState("");
    const [replyContent, setReplyContent] = useState("");
    const [postReplies, setPostReplies] = useState([]);
    const [isPosting, setIsPosting] = useState(false);
    const [isActiveReplyId, setIsActiveReplyId] = useState(null);
    const [newNestedReplyMap, setNewNestedReplyMap] = useState([]);
    const [nestedRepliesMap, setNestedRepliesMap] = useState({});

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

    // direct comment to post 
    const handleReply = async () => {
        if (isPosting) return; // ensures repeated request is impossible
        if (comment === "") {
            alert("Comments cannot be blank");
            return
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
    };

    // Fetch nested replies of a comment
    const fetchNestedReplies = async (parentReplyId) => {
        if (isPosting) return;

        setIsPosting(true);

        try {
            const response = await fetch(`https://faithbook-production.up.railway.app/reply/nested/${parentReplyId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setNestedRepliesMap(prev => ({
                ...prev,
                [parentReplyId]: data,  // Store replies under the corresponding comment
            }));


            // clear the cached newReplies if exists
            setNewNestedReplyMap(prev => {
                const { [parentReplyId]: _, ...rest } = prev;  // Remove the key from the map
                return rest;
            });
        } catch (error) {
            console.error("Error fetching replies:", error);
        } finally {
            setIsPosting(false);
        }
    };


    // display number of replies
    const openNestedReply = (reply) => {
        if (reply.nestedCount === 0) {
            return
        } else if (reply.nestedCount === 1) {
            return (
                <div
                    style={{ cursor: "pointer", width: "fit-content" }}
                    onClick={() => fetchNestedReplies(reply.id)}>View 1 reply</div>
            )
        } else {
            return (
                <div
                    style={{ cursor: "pointer", width: "fit-content" }}
                    onClick={() => fetchNestedReplies(reply.id)}>View all {reply.nestedCount} replies</div>
            )
        }
    }

    // reply to comments
    const handleNestedReply = async (reply) => {
        if (isPosting) return; // ensures repeated request is impossible
        if (replyContent === "") {
            alert("Replies cannot be blank");
            return
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
                    content: replyContent,
                    parentReplyId: reply.id
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData || "Failed to post reply");
            }

            const newReply = await response.json();

            setNewNestedReplyMap(prev => ({
                ...prev,
                [reply.id]: [...(prev[reply.id] || []), newReply]
            })); // caching new replies
            onReplyAdded();

        } catch (err) {
            console.error("Failed to post reply", err);
        } finally {
            setIsPosting(false);
            setReplyContent("");
            alert("Reply posted successfully");
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
                        <div className="this"
                            style={{ gap: selectedPost.userTitle === "skeptic" ? "0.15rem" : "0.25rem" }}>
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
                    <X className="x-button" size="1.25rem"
                        onClick={onClose} />
                </div>

                <div className="post-modal-inner">
                    <p className="purple-bar bold">
                        {selectedPost.title}
                    </p>
                    {selectedPost.bibleVerse ?
                    <p className="purple-bar bold"
                        style={{
                            whiteSpace: "pre-line", fontSize: "0.85rem", maxHeight: "50px",
                            overflowY: "auto", border: "1px solid lightgray", borderRadius: "3px", color: "#3b3b3b"
                        }}>{selectedPost.bibleVerse}</p> : null}
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
                                <div style={{ width: "85%", maxWidth: "90%" }}>
                                    <div className="comment-box">
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "500" }}>
                                            {reply.User?.username}
                                            <span style={{ marginTop: "0.15rem" }}>
                                                {titleBadges[reply.User?.title]}
                                            </span>
                                        </div>
                                        <div className="comment-content">
                                            {reply.content}
                                        </div>
                                    </div>
                                    <div className="comment-under">
                                        <span style={{ fontSize: "0.75rem", display: "flex", alignItems: "center" }}>
                                            {FormatTimestamp(reply.createdAt)}
                                        </span>
                                        <span></span>
                                        <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                            <Heart size="1rem" />
                                            {reply.likes}
                                        </span>
                                        <span style={{ fontWeight: "500", whiteSpace: "nowrap", cursor: "pointer" }}
                                            onClick={() => setIsActiveReplyId(reply.id)}>Reply</span>
                                    </div>

                                    {!nestedRepliesMap[reply.id] ? (
                                        <div style={{ margin: "0.25rem 1rem 0.5rem" }}>
                                            {openNestedReply(reply)}
                                        </div>
                                    ) : (nestedRepliesMap[reply.id]?.map(nestedReply => (
                                        <div className="nested-reply-wrapper" key={nestedReply.id}>
                                            <div className="comment" style={{ gap: "0.5rem" }}>
                                                <img style={{
                                                    height: "2rem", width: "2rem", borderRadius: "50%",
                                                    objectFit: "cover", objectPosition: "center"
                                                }}
                                                    src={nestedReply.User?.UserSpecific?.profilePic}
                                                    alt={nestedReply.username} />
                                                <div className="comment-box">
                                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "500" }}>
                                                        {nestedReply.User?.username}
                                                        <span style={{ marginTop: "0.15rem" }}>
                                                            {titleBadges[nestedReply.User?.title]}
                                                        </span>
                                                    </div>
                                                    <div className="comment-content">
                                                        {nestedReply.content}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="nested-comment-under">
                                                {FormatTimestamp(nestedReply.createdAt)}
                                            </div>
                                        </div>
                                    )))
                                    }

                                    {newNestedReplyMap[reply.id]?.map(nestedReply => (
                                        <div className="nested-reply-wrapper">
                                            <div className="comment">
                                                <img style={{
                                                    height: "1.5em", width: "1.5rem", borderRadius: "50%",
                                                    objectFit: "cover", objectPosition: "center"
                                                }}
                                                    src={nestedReply.User?.UserSpecific?.profilePic}
                                                    alt={nestedReply.username} />
                                                <div className="comment-box">
                                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "500" }}>
                                                        {nestedReply.User?.username}
                                                        <span style={{ marginTop: "0.15rem" }}>
                                                            {titleBadges[nestedReply.User?.title]}
                                                        </span>
                                                    </div>
                                                    <div className="comment-content">
                                                        {nestedReply.content}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="nested-comment-under">
                                                {FormatTimestamp(nestedReply.createdAt)}
                                            </div>
                                        </div>
                                    ))}

                                    {isActiveReplyId === reply.id && (
                                        <div className="input-reply-container">
                                            <textarea
                                                value={replyContent}
                                                onChange={(e) => setReplyContent(e.target.value)}
                                                className="reply-textarea"
                                                placeholder={`Reply to ${reply.User?.username} ...`}
                                                required
                                                maxLength={500}>
                                            </textarea>
                                            <div className="comment-actions">
                                                <CircleChevronRight
                                                    className="comment-send-icon"
                                                    onClick={() => handleNestedReply(reply)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="input-comment-container">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="input-comment"
                        placeholder="Write a comment..."
                        required
                        maxLength={500}>
                    </textarea>
                    <div className="comment-actions">
                        <CircleChevronRight
                            className="comment-send-icon"
                            onClick={handleReply} />
                    </div>
                </div>

            </div>
        </div >
    )
}

export default PostModal;

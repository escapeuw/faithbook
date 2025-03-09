import "./ui.css";
import { useState, useEffect } from "react";
import { usePost } from "../PostContext";
import { X, CircleChevronRight } from "lucide-react";

const PostModal = ({ isOpen, onClose }) => {
    const [comment, setComment] = useState("");

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


    if (!isOpen || !selectedPost) {
        return null;
    }




    const formattedTimestamp = new Date(selectedPost.timestamp).toLocaleString();

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
                                <p style={{ fontWeight: "600" }}>{selectedPost.username}</p>

                            </div>
                            <p style={{ color: "gray", fontSize: "0.75rem" }}>{formattedTimestamp}</p>
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
                        <div className="comment">
                            <img style={{
                                height: "3rem", width: "3rem", borderRadius: "50%",
                                objectFit: "cover", objectPosition: "center"
                            }}
                                src={"https://faithbookbucket.s3.amazonaws.com/empty_profile.jpg"} />
                            <div className="comment-box">Comment example</div>
                        </div>
                        <div className="comment">
                            <img style={{
                                height: "3rem", width: "3rem", borderRadius: "50%",
                                objectFit: "cover", objectPosition: "center"
                            }}
                                src={"https://faithbookbucket.s3.amazonaws.com/empty_profile.jpg"} />
                            <div className="comment-box">Comment example</div>
                        </div>
                        <div className="comment">
                            <img style={{
                                height: "3rem", width: "3rem", borderRadius: "50%",
                                objectFit: "cover", objectPosition: "center"
                            }}
                                src={"https://faithbookbucket.s3.amazonaws.com/empty_profile.jpg"} />
                            <div className="comment-box">Comment example</div>
                        </div>
                        <div className="comment">
                            <img style={{
                                height: "3rem", width: "3rem", borderRadius: "50%",
                                objectFit: "cover", objectPosition: "center"
                            }}
                                src={"https://faithbookbucket.s3.amazonaws.com/empty_profile.jpg"} />
                            <div className="comment-box">Comment example</div>
                        </div>
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
                            color="#9b87f5"
                            style={{ cursor: "pointer" }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostModal;

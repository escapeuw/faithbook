import { useEffect, useState } from "react";
import DevotionPost from "/src/components/DevotionPost.jsx";
import axios from "axios";
import { Camera, CircleHelp, Search, MessageCircleMore, MessageCircleHeart } from "lucide-react";
import imageCompression from 'browser-image-compression';
import { getAbbreviatedBook, getFullBookName } from "../utils/bookMapping";
import "/src/components/ui.css";

function Profile() {
    const [devotion, setDevotion] = useState("");
    const [postTitle, setPostTitle] = useState("");
    const [bibleVerse, setBibleVerse] = useState("");
    const [startBook, setStartBook] = useState("");
    const [startChapter, setStartChapter] = useState("");
    const [startVerse, setStartVerse] = useState("");
    const [endChapter, setEndChapter] = useState("");
    const [endVerse, setEndVerse] = useState("");
    const [showRange, setShowRange] = useState(false);

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profilePicture, setProfilePicture] = useState(null);
    const [isPostingDisabled, setIsPostingDisabled] = useState(false);
    const [likeStatus, setLikeStatus] = useState({});
    const [isFetching, setIsFetching] = useState(false);

    const updateDelete = (postId) => {
        setPosts((prevPosts) => prevPosts.filter(p => p.post.id !== postId));
    };


    const titleComponents = {
        "committed-believer": (
            <div className="user-title" style={{ backgroundColor: "#f2f2f2" }}>
                <MessageCircleHeart size="1rem" className="title-icon title-committed" />
                <span style={{ color: "gray", marginTop: "0.05rem" }}>
                    {user?.title}
                </span>
            </div>),
        "doubting-believer": (
            <div className="user-title" style={{ backgroundColor: "#f2f2f2" }}>
                <MessageCircleMore size="1rem" className="title-icon title-doubting" />
                <span style={{ color: "gray", marginTop: "0.05rem" }}>
                    {user?.title}
                </span>
            </div>),
        "seeker": (
            <div className="user-title" style={{ backgroundColor: "#f2f2f2" }}>
                <Search size="1rem" className="title-icon title-seeker" />
                <span style={{ color: "gray", marginTop: "0.05rem" }}>
                    {user?.title}
                </span>
            </div>),
        "skeptic": (
            <div className="user-title" style={{ backgroundColor: "#f2f2f2" }}>
                <CircleHelp size="1rem" className="title-icon title-skeptic" />
                <span style={{ color: "gray", marginTop: "0.05rem" }}>
                    {user?.title}
                </span>
            </div>),
    };



    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {

                const options = {
                    maxSizeMB: 0.25, // Max file size
                    maxWidthOrHeight: 800,
                    // Resize to fit within 6rem (96px)
                    useWebWorker: true, // Use web worker for faster processing
                };

                // Compress the image
                const compressedFile = await imageCompression(file, options);

                const formData = new FormData();
                formData.append("profilePicture", compressedFile);

                const response = await fetch("https://faithbook-production.up.railway.app/profile/upload-profile-picture", {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust auth method
                    },
                });

                const data = await response.json();
                if (data.success) {
                    setProfilePicture(data.imageUrl); // Update profile picture URL
                } else {
                    alert("Upload failed");
                }
            } catch (error) {
                console.error('Error during image compression:', error);
            }
        }
    };


    const handlePost = async (e) => {
        e.preventDefault();

        setIsPostingDisabled(true); // Disable button before sending request

        try {
            const response = await fetch("https://faithbook-production.up.railway.app/posts/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, title: postTitle, content: devotion, bibleVerse })
            });

            if (response.ok) {
                const newPost = await response.json();

                setPosts((prevPosts) => [{ post: newPost, usersWhoLiked: [] }, ...prevPosts]); // caching new post

                alert("Post created!");
                setDevotion(""); // Clear textarea
                setPostTitle(""); // Clear post title
            } else {
                alert("Failed to post.");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            // Re-enable the button whether the request succeeded or failed
            setIsPostingDisabled(false);
        }
    };


    const fetchVerse = async () => {
        if (isFetching) return;

        if (!startBook || !startChapter || !startVerse) {
            alert("Bible verse cannot be blank");
            return;
        }

        if ((!endChapter && endVerse) || (endChapter && !endVerse)) {
            alert("Both chapter and verse are required");
            return;
        }
        setIsFetching(true);

        const abbreviatedBook = getAbbreviatedBook(startBook.trim());
        const fullBook = getFullBookName(startBook.trim());

        const verseUrl = `https://faithbook-production.up.railway.app/verse?book=${abbreviatedBook}&chapter=${startChapter.trim()}&verse=${startVerse.trim()}`
            + (endChapter ? `&endChapter=${endChapter.trim()}` : "")
            + (endVerse ? `&endVerse=${endVerse.trim()}` : "");

        try {
            const res = await axios.get(verseUrl);
            const verses = res.data.bibleVerses.map(verse => `\n${verse.verse} ${verse.text}`).join('');

            if (postTitle === "") {
                const defaultTitle = `${fullBook} ${startChapter}:${startVerse}` + (endChapter ? ` - ${endChapter}:${endVerse}` : "");
                setPostTitle(defaultTitle);
            }
            const formattedVerse = `[${res.data.verseTitle}]${verses}`;
            setBibleVerse(formattedVerse);

        } catch (err) {
            console.error("Error:", err)
            setBibleVerse("")
        } finally {
            setIsFetching(false);
        }
    }




    useEffect(() => {

        const fetchUserData = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await fetch("https://faithbook-production.up.railway.app/user", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch user data");

                const data = await response.json();
                setUser(data);
                setProfilePicture(data.UserSpecific.profilePic);


                const response2 = await fetch(`https://faithbook-production.up.railway.app/posts/${data.id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (!response2.ok) throw new Error("Failer to fetch user's posts");

                const data2 = await response2.json();
                setPosts(data2);

                // like status
                const postIds = data2.map(p => p.post.id);

                const responseLike = await fetch("https://faithbook-production.up.railway.app/posts/like-status", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ postIds })
                });

                if (!responseLike.ok) throw new Error("Failed to fetch like status");

                const dataLike = await responseLike.json();


                const dataLikeHash = dataLike.reduce((acc, { postId }) => {
                    acc[postId] = true;
                    return acc;
                }, {});

                setLikeStatus(dataLikeHash);

            } catch (error) {
                console.error("Erorr fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return <div>Loading...</div>
    }


    return (
        (user && (
            <div className="wrapper">
                <div className="profile-container">
                    <div className="center card">
                        <div>
                            <label className="profile-picture-container" htmlFor="profilepic-upload">
                                <img className="profile-picture"
                                    src={profilePicture || "https://faithbookbucket.s3.amazonaws.com/empty_profile.jpg"}
                                    alt="Profile"
                                    style={{
                                        width: "6rem", height: "6rem", borderRadius: "50%",
                                        objectFit: "cover", objectPosition: "center"
                                    }} />
                                <div className="upload-hint"><Camera size="1.25rem" /></div>
                            </label>
                            <input
                                type="file"
                                id="profilepic-upload"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: "none" }} />
                        </div>
                        <div>
                            <h2 style={{ marginBottom: "0.75rem" }}>{user.username}</h2>
                            {titleComponents[user.title]}
                        </div>
                        <p>"Walking with faith, sharing daily devotions, and growing in Christ."</p>
                    </div>

                    <form className="write-post" onSubmit={handlePost}>
                        <div className="post-textarea">
                            <textarea className="post-title input-text"
                                value={postTitle}
                                onChange={(e) => setPostTitle(e.target.value)}
                                placeholder="write a title..."
                                required
                                maxLength={20}
                            />
                        </div>

                        {/* BibleVerse Section */}
                        <div className="post-textarea"
                            style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            {/* First Row - Default Inputs */}
                            <div style={{
                                display: "flex", maxWidth: "100%", alignItems: "center", justifyContent: "flex-end",
                                border: "1px solid black", borderRadius: "12px", width: "550px"
                            }}>
                                <input
                                    className="bible-input"
                                    type="text"
                                    value={startBook}
                                    onChange={(e) => setStartBook(e.target.value)}
                                    placeholder="Book (요, 요한복음)"
                                    required
                                />
                                <input
                                    className="bible-input"
                                    type="text"
                                    value={startChapter}
                                    onChange={(e) => setStartChapter(e.target.value)}
                                    placeholder="Chapter (e.g. 3)"
                                    required
                                />
                                <input
                                    className="bible-input"
                                    type="text"
                                    value={startVerse}
                                    onChange={(e) => setStartVerse(e.target.value)}
                                    placeholder="Verse (e.g. 16)"
                                    required
                                />
                                <button
                                    className="bible-to-button"
                                    type="button"
                                    onClick={() => {
                                        setShowRange(!showRange);
                                        setEndChapter("");
                                        setEndVerse("")
                                    }}
                                >
                                    {showRange ? "Cancel" : "To"}
                                </button>

                            </div>

                            {/* Second Row - Additional Inputs (Only Show When Toggled) */}
                            {showRange && (
                                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", justifyContent: "center", marginTop: "10px" }}>
                                    <span style={{ fontWeight: "400" }}>to</span>
                                    <input
                                        className="bible-input"
                                        type="text"
                                        value={endChapter}
                                        onChange={(e) => setEndChapter(e.target.value)}
                                        placeholder="Chapter (e.g. 3)"
                                    />
                                    <input
                                        className="bible-input"
                                        type="text"
                                        value={endVerse}
                                        onChange={(e) => setEndVerse(e.target.value)}
                                        placeholder="Verse (e.g. 16)"
                                    />
                                </div>
                            )}

                            {/* Apply Button - Always Visible */}
                            <button
                                className="bible-input-button"
                                type="button"
                                onClick={fetchVerse}
                                disabled={isFetching}
                                style={{ marginTop: "10px" }}
                            >
                                Apply
                            </button>
                        </div>


                        {/* Fetched Verse */}
                        <div style={{
                            whiteSpace: "pre-line", fontSize: "0.85rem",
                            maxHeight: "100px", maxWidth: "95%", overflowY: "auto", marginBottom: "0.5rem", border: "1px solid lightgray"
                        }}>
                            {bibleVerse}
                        </div>

                        {/* Post Content Section */}
                        <div className="post-textarea">
                            <textarea className="content input-text"
                                value={devotion}
                                onChange={(e) => setDevotion(e.target.value)}
                                placeholder="write something..."
                                required
                            />
                        </div>
                        <button type="submit" className="post-button"
                            disabled={isPostingDisabled}>Post</button>
                    </form>

                    {posts.length === 0 ?
                        (<div className="card">
                            <div style={{ textAlign: "center", height: "7rem" }}>
                                <p style={{ fontSize: "1.25rem", fontWeight: "500", color: "#666" }}>No posts yet!</p>
                                <p style={{ fontSize: "0.9rem", color: "#999" }}>
                                    Start sharing your thoughts with your friends.
                                </p>
                            </div>
                        </div>) :
                        (posts.map(p => (
                            <DevotionPost
                                likeDetails={{ likers: p.usersWhoLiked, others: p.othersCount }}
                                likeStatus={likeStatus[p.post.id] || false}
                                owner={true}
                                key={p.post.id}
                                timestamp={p.post.createdAt}
                                {...p.post}
                                profilePic={profilePicture}
                                userTitle={user.title}
                                username={user.username}
                                onDelete={updateDelete} />
                        )))
                    }
                </div>
            </div>
        ))
    )
}

export default Profile
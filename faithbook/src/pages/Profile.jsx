import { useEffect, useState } from "react";
import DevotionPost from "/src/components/DevotionPost.jsx";
import { Camera, CircleHelp, Search, MessageCircleMore, MessageCircleHeart } from "lucide-react";
import imageCompression from 'browser-image-compression';
import "/src/components/ui.css";

function Profile() {
    const [devotion, setDevotion] = useState("");
    const [bibleVerse, setBibleVerse] = useState("");
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profilePicture, setProfilePicture] = useState(null);


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
                    // Resize to fit within 6rem (96px)
                    useWebWorker: true, // Use web worker for faster processing
                };

                // Compress the image
                const compressedFile = await imageCompression(file, options);

                // Create a preview URL for the compressed image (for immediate display)
                const compressedFileUrl = URL.createObjectURL(compressedFile);

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

        const response = await fetch("https://faithbook-production.up.railway.app/posts/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, bibleVerse, content: devotion })
        });

        if (response.ok) {
            alert("Post created!");
            setDevotion(""); // Clear textarea
            setBibleVerse(""); // clear bibleVerse
        } else {
            alert("Failed to post.");
        }
    };

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
                            <textarea className="verse input-text"
                                value={bibleVerse}
                                onChange={(e) => setBibleVerse(e.target.value)}
                                placeholder="include bible verse...  e.g. Genesis 1:1"
                                required
                                maxLength={20}
                            />
                        </div>
                        <div className="post-textarea">
                            <textarea className="content input-text"
                                value={devotion}
                                onChange={(e) => setDevotion(e.target.value)}
                                placeholder="write something..."
                                required
                            />
                        </div>
                        <button type="submit" className="post-button">Post</button>
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
                        (posts.map(post => (
                            <DevotionPost
                                key={post.id}
                                timestamp={post.createdAt}
                                {...post}
                                profilePic={post.User?.UserSpecific?.profilePic}
                                userTitle={post.User?.title}
                                username={post.User?.username} />
                        )))
                    }
                </div>
            </div>
        ))
    )
}

export default Profile
import { useEffect, useState } from "react";
import DevotionPost from "/src/components/DevotionPost.jsx";
import { CircleHelp, Search, MessageCircleMore, MessageCircleHeart } from "lucide-react";
import "/src/components/ui.css";

function Profile() {
    const [devotion, setDevotion] = useState("");
    const [bibleVerse, setBibleVerse] = useState("");
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const titleComponents = {
        "committed-believer": (
            <div className="user-title" style={{ backgroundColor: "#f2f2f2" }}>
                <MessageCircleHeart className="title-icon title-committed" />
                <span style={{ color: "gray", marginTop: "0.2rem" }}>
                    {user?.title}
                </span>
            </div>),
        "doubting-believer": (
            <div className="user-title" style={{ backgroundColor: "#f2f2f2" }}>
                <MessageCircleMore className="title-icon title-doubting" />
                <span style={{ color: "gray", marginTop: "0.2rem" }}>
                    {user?.title}
                </span>
            </div>),
        "seeker": (
            <div className="user-title" style={{ backgroundColor: "#f2f2f2" }}>
                <Search className="title-icon title-seeker" />
                <span style={{ color: "gray", marginTop: "0.2rem" }}>
                    {user?.title}
                </span>
            </div>),
        "skeptic": (
            <div className="user-title" style={{ backgroundColor: "#f2f2f2" }}>
                <CircleHelp className="title-icon title-skeptic" />
                <span style={{ color: "gray", marginTop: "0.2rem" }}>
                    {user?.title}
                </span>
            </div>),
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
                        <img style={{ width: "6rem", height: "6rem", borderRadius: "50%" }}
                            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" />
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
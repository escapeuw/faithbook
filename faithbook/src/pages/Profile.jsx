import { useEffect, useState } from "react";
import DevotionPost from "/src/components/DevotionPost.jsx";
import "/src/components/ui.css";

function Profile() {
    const [devotion, setDevotion] = useState("");
    const [bibleVerse, setBibleVerse] = useState("");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const handlePost = async (e) => {
        e.preventDefault();

        const response = await fetch("https://faithbook-production.up.railway.app/posts/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.userId, bibleVerse, devotion })
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

    const posts = [
        {
            username: "Christine Kim",
            profilePic: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
            content: "Today I reflected on God's endless love and mercy. It reminds me to be more compassionate to others.",
            bibleVerse: "1 John 4:19 - We love because he first loved us.",
            timestamp: "2 hours ago",
        },
        {
            username: "Jane Smith",
            profilePic: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
            content: "Finding peace in His presence during my morning devotion.",
            bibleVerse: "Psalm 46:10 - Be still, and know that I am God.",
            timestamp: "5 hours ago",
        },
    ];



    return (
        (user && (
            <div className="wrapper">
                <div className="profile-container">
                    <div className="profile center card">
                        <img style={{ width: "6rem", height: "6rem", borderRadius: "50%" }}
                            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" />
                        <h2>{user.username}</h2>
                        <h3>{user.title}</h3>
                        <p>"Walking with faith, sharing daily devotions, and growing in Christ."</p>
                    </div>
                    <form onSubmit={handlePost}>
                        <textarea
                            value={bibleVerse}
                            onChange={(e) => setBibleVerse(e.target.value)}
                            placeholder="include bible verse..."
                            required
                        />
                        <textarea
                            value={devotion}
                            onChange={(e) => setDevotion(e.target.value)}
                            placeholder="Write something..."
                            required
                        />
                        <button type="submit">Post</button>
                    </form>
                    <DevotionPost {...posts[0]} />
                </div>
            </div>
        ))
    )
}

export default Profile
import DevotionPost from "/src/components/DevotionPost.jsx";
import { useEffect, useState } from "react";
import "/src/components/ui.css";

function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        setLoading(true);
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await fetch("https://faithbook-production.up.railway.app/posts", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch posts");

                const data = await response.json();
                setPosts(data);

            } catch (error) {
                console.error("Erorr fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);


    const example = [
        {
            username: "John Doe",
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
        (loading ? <div>Loading posts...</div> :
            <div className="wrapper">
                <div className="feed-container">
                    {posts.map(post => (
                        <DevotionPost
                            key={post.id}
                            {...post}
                            timestamp={post.createdAt}
                            userTitle={post.User?.title}
                            username={post.User?.username} /> // access username in User model
                    ))}
                </div>
            </div>
        ));
}
export default Feed;
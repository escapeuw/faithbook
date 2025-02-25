import DevotionPost from "/src/components/DevotionPost.jsx";
import { useEffect, useState } from "react";
import "/src/components/ui.css";

function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);


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

                const token = localStorage.getItem("token");
                const responseUser = await fetch("https://faithbook-production.up.railway.app/user", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                });
                if (!responseUser.ok) throw new Error("Failed to fetch user data");

                const dataUser = await responseUser.json();
                setUser(dataUser);

            } catch (error) {
                console.error("Erorr fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        (loading ? <div>Loading posts...</div> :
            <div className="wrapper">
                <div className="feed-container">
                    {posts.map(post => (
                        <DevotionPost
                            key={post.id}
                            owner={post.User?.id === user.id}
                            {...post}
                            profilePic={post.User?.UserSpecific?.profilePic}
                            timestamp={post.createdAt}
                            userTitle={post.User?.title}
                            username={post.User?.username} />) // access username in User model
                    )}
                </div>
            </div>
        ));
}
export default Feed;
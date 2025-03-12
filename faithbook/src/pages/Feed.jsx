import DevotionPost from "/src/components/DevotionPost.jsx";
import { useEffect, useState } from "react";
import "/src/components/ui.css";

function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [likeStatus, setLikeStatus] = useState({});

    const updateDelete = (postId) => {
        setPosts((prevPosts) => prevPosts.filter(post => post.id !== postId));
    };

    useEffect(() => {
        setLoading(true);
        const fetchPosts = async () => {
            setLoading(true);
            try {
                // posts
                const response = await fetch("https://faithbook-production.up.railway.app/posts", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch posts");

                const data = await response.json();
                
                setPosts(data);


                // user info
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



                // like status
                const postIds = data.map(d => d.post.id);

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
                    {posts.map(p => (
                        <DevotionPost
                            likeDetails={{ likers: p.usersWhoLiked, others: p.othersCount }}
                            key={p.post.id}
                            likeStatus={likeStatus[p.post.id] || false}
                            owner={p.post.User?.id === user.id}
                            {...p.post}
                            profilePic={p.post.User?.UserSpecific?.profilePic}
                            timestamp={p.post.createdAt}
                            userTitle={p.post.User?.title}
                            username={p.post.User?.username}
                            onDelete={updateDelete}
                        />) // access username in User model
                    )}
                </div>
            </div>
        ));
}
export default Feed;
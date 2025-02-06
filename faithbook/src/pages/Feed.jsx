import DevotionPost from "/src/components/DevotionPost.jsx";

function Feed() {
    const posts = [
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
        <div className="container mx-auto px-4 pt-20 pb-10">
            <div className="max-w-2xl mx-auto space-y-6">
                {posts.map((post, index) => (
                    <DevotionPost key={index} {...post} />
                ))}
            </div>
        </div>
    );
}
export default Feed;
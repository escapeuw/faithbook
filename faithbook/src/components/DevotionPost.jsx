
function DevotionPost({ username, profilePic, content, bibleVerse, timestamp }) {
    const defaultProfilePic = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158";
    const displayProfilePic = profilePic || defaultProfilePic;
    
    console.log(timestamp);

    const formattedTimestamp = new Date(timestamp).toLocaleString();
    
    return (
        <div className="center card">
            <div className="flex-left" style={{ gap: "1rem" }}>
                <img style={{ height: "3rem", width: "3rem", borderRadius: "50%" }}
                    src={displayProfilePic} alt={username} />
                <div className="this">
                    <p style={{ fontWeight: "600" }}>{username}</p>
                    <p style={{ color: "gray", fontSize: "0.85rem" }}>{formattedTimestamp}</p>
                </div>
            </div>
            <div style={{ textAlign: "left" }}>
                <p className="purple-bar bold">{bibleVerse}</p>
                <p>{content}</p>
            </div>
        </div>


    )
}

export default DevotionPost;

function DevotionPost({ username, profilePic, content, bibleVerse, timestamp }) {
    return (
        <div className="center card">
            <div className="flex-left" style={{ gap: "1rem" }}>
                <img style={{ height: "3rem", width: "3rem", borderRadius: "50%" }} src={profilePic} />
                <div className="this">
                    <p style={{ fontWeight: "600" }}>{username}</p>
                    <p style={{ color: "gray", fontSize: "0.85rem" }}>{timestamp}</p>
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
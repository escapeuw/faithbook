
function DevotionPost({ username, profilePic, content, bibleVerse, timestamp }) {
    return (
        <div>
            <div>
                <div>
                    <img style={{ width: "70px", height: "70px", borderRadius: "50%" }} src={profilePic} />
                </div>
                <p>{username}</p>
                <p>{timestamp}</p>

            </div>
            <div>
                <p>{bibleVerse}</p>
                <p>{content}</p>
            </div>
        </div>

    )
}

export default DevotionPost;
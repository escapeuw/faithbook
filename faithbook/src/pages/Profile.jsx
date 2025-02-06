import { useState } from "react";
import DevotionPost from "/src/components/DevotionPost.jsx";

function Profile() {
    const [devotion, setDevotion] = useState("");
    const [bibleVerse, setBibleVerse] = useState("");

    const handlePost = () => {
        console.log("Posted:", { devotion, bibleVerse });
        setDevotion("");
        setBibleVerse("");
    }

    return (
        <div>
            <img style={{ width: "70px", height: "70px", borderRadius: "50%" }}
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" />
            <h2>Display Name</h2>
            <p>profile-bio:
                "Walking with faith, sharing daily devotions, and growing in Christ."
            </p>
        </div>
    )
}

export default Profile
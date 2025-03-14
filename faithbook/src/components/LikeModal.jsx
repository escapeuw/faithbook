import { useEffect } from "react";
import "./ui.css";
import { X } from "lucide-react";

const LikeModal = ({ isOpen, likedUsers, onClose }) => {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // Disable scrolling

        } else {
            // Enable scrolling again when the modal is closed
            document.body.style.overflow = "";
        }

        // Clean up: Ensure that scrolling is enabled when the component is unmounted or modal is closed
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]); // This effect runs whenever isOpen changes

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="card center"
                style={{
                    display: "flex", flexDirection: "column", width: "28rem", zIndex: "20000",
                    height: "55%", maxHeight: "55vh", maxWidth: "100%"
                }}>
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid gray",
                    position: "relative"
                }}>
                    <h3 style={{ flex: "1" }}>Likes</h3>
                    <X size="1.25rem"
                        onClick={onClose} />
                </div>
                <div style={{
                    maxHeight: "45vh", overflowY: "auto",
                    scrollbarWidth: "none",  // For Firefox
                    msOverflowStyle: "none" // For Internet Explorer/Edge
                }}>
                    {likedUsers.map(data => (
                        <div style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between", height: "4.5rem"
                        }} >
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem", maxWidth: "75%", }}>
                                <img src={data.UserSpecific.profilePic}
                                    style={{ width: "3.5rem", height: "3.5rem", borderRadius: "50%", objectFit: "cover" }} />
                                <div>{data.username}</div>
                            </div>
                            <div style={{
                                backgroundColor: "#aa9af5", color: "white", fontWeight: "300",
                                borderRadius: "5px", padding: "0.25rem 0.75rem"
                            }}>Add Friend</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default LikeModal;

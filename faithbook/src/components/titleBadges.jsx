import { CircleHelp, Search, MessageCircleMore, MessageCircleHeart } from "lucide-react";

export const titleBadges = {
    "committed-believer": (
        <div className="tooltip-container">
            <MessageCircleHeart
                className="title-icon title-committed"
                size="1rem" />
            <div className="tooltip">Committed-Believer</div>
        </div>
    ),
    "doubting-believer": (
        <div className="tooltip-container">
            <MessageCircleMore
                className="title-icon title-doubting"
                size="1rem" />
            <div className="tooltip">Doubting-Believer</div>
        </div>
    ),
    "seeker": (
        <div className="tooltip-container">
            <Search
                className="title-icon title-seeker"
                size="1rem" />
            <div className="tooltip">Seeker</div>
        </div>
    ),
    "skeptic": (
        <div className="tooltip-container">
            <CircleHelp
                className="title-icon title-skeptic"
                size="0.95rem" />
            <div className="tooltip">Skeptic</div>
        </div>
    )
};
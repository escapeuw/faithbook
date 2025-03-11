import dayjs from "dayjs";

function FormatTimestamp(timestamp) {
    const now = dayjs();
    const postTime = dayjs(timestamp);

    const minuteDiff = now.diff(postTime, 'minute');
    const hourDiff = now.diff(postTime, 'hour');
    const dayDiff = now.diff(postTime, 'day');

    if (minuteDiff < 1) {
        return "Just now"
    }
    else if (minuteDiff < 60) {
        return `${minuteDiff} minute${minuteDiff > 1 ? 's' : ''} ago`;
    }
    else if (hourDiff < 24) {
        return `${hourDiff} hour${hourDiff > 1 ? 's' : ''} ago`;
    } 
    else if (dayDiff < 7) {
        return `${dayDiff} day${dayDiff > 1 ? 's' : ''} ago`;
    }
    else {
        return postTime.format('MMMM DD, YYYY');
    }
    
}


export default FormatTimestamp;
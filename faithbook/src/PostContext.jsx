import { createContext, useContext, useState } from "react";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
    const [selectedPost, setSelectedPost] = useState(null);

    return (
        <PostContext.Provider value={{ selectedPost, setSelectedPost }}>
            {children}
        </PostContext.Provider>
    );
};

export const usePost = () => useContext(PostContext);
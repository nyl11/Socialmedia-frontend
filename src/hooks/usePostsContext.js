
import { PostsContext } from "../context/PostContext";
import { useContext } from "react";

export const usePostsContext =()=>{
    const context =useContext(PostsContext)

     if(!context){
        throw new Error("usePostContext must be used inside an PostsContextProvider");
        
     }

    return context
}
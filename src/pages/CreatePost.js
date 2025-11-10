import { useEffect, useState } from "react";
import { usePostsContext } from "../hooks/usePostsContext";

import PostDetails from "../components/PostDetails";
import LeftSidebar from "../components/LeftSidebar";

import PostForm from "../components/PostForm";
import { useAuthContext } from "../hooks/useAuthContext";

const CreatePost = () => {
  const { posts, dispatch } = usePostsContext();
  const [activePost, setActivePost] = useState(null);

  const { user } = useAuthContext();

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/posts", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_POSTS", payload: json });
      }
    };

    if (user) fetchPosts();
  }, [dispatch, user]);

  return (
    <div className="home">
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Center Post Area */}
      <div className="main-content">
        <div className="posts-form">
          <PostForm />
        </div>
        <div className="posts-container">
          {activePost ? (
            <PostDetails
              post={activePost}
              onBack={() => setActivePost(null)}
              canDelete={true}
            />
          ) : (
            posts &&
            posts.map((post) => (
              <PostDetails
                key={post._id}
                post={post}
                canDelete={true}
                onCommentClick={() => setActivePost(post)}
              />
            ))
          )}
        </div>
      </div>

    </div>
  );
};

export default CreatePost;

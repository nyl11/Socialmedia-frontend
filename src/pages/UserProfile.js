import { useEffect, useState } from "react";
import { usePostsContext } from "../hooks/usePostsContext";
import { useAuthContext } from "../hooks/useAuthContext";

import PostDetails from "../components/PostDetails";
import LeftSidebar from "../components/LeftSidebar";
import Profile from "../components/Profile"; // ✅ New import

const UserProfile = () => {
  const { posts, dispatch } = usePostsContext();
  const { user } = useAuthContext();

  const [activePost, setActivePost] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await response.json();

        if (response.ok) {
          setProfile(data);
        } else {
          console.error(data.error || 'Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const json = await response.json();

        if (response.ok) {
          dispatch({ type: "SET_POSTS", payload: json });
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };

    if (user) {
      fetchUserProfile();
      fetchPosts();
    }
  }, [dispatch, user]);

  return (
    <div className="home">
      <LeftSidebar />
      <div className="main-content">
        <Profile profile={profile} setProfile={setProfile} /> {/* ✅ Reusable profile component */}

        <div className="posts-container-UserProfile">
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

export default UserProfile;

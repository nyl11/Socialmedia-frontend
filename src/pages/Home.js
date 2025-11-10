import React, { useEffect, useState } from 'react';
import { usePostsContext } from '../hooks/usePostsContext';
import PostDetails from '../components/PostDetails';
import LeftSidebar from '../components/LeftSidebar';
import SortToggle from '../components/SortToggle'; 

const Home = () => {
  const { posts, dispatch } = usePostsContext();
  const [activePost, setActivePost] = useState(null);
  const [sortBy, setSortBy] = useState("new");
 

  useEffect(() => {
    const fetchAllPost = async () => {
      const response = await fetch(`/api/posts/all?sort=${sortBy}`);
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'SET_POSTS', payload: json });
      }
    };
    fetchAllPost();
  }, [dispatch, sortBy]);
// debugger
  return (
    <div className="home">
      <LeftSidebar />

      <div className="allpost">
        <SortToggle sortBy={sortBy} setSortBy={setSortBy}  /> {/* ✅ use it */}
        
 
        {activePost ? (
          <PostDetails post={activePost} onBack={() => setActivePost(null)} />
        ) : (
          posts &&
          posts.map((post) => (
            <PostDetails key={post._id} post={post} onCommentClick={() => setActivePost(post)} />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;



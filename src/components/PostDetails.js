import { usePostsContext } from "../hooks/usePostsContext";
import { FaTrash } from 'react-icons/fa';
import LikeButtons from './LikeButtons';
import { FaRegComment } from 'react-icons/fa';
import CommentSection from './CommentSection';
import ConfirmModal from './ConfirmModal';
import { useState } from 'react';
import { FaArrowLeftLong } from "react-icons/fa6";

const PostDetails = ({ post, canDelete = false, onCommentClick = null, onBack = null }) => {
  const { dispatch } = usePostsContext();
  const [showModal, setShowModal] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0); // local state for live update

  const timeAgo = (date) => {
  const now = new Date();
  const seconds = Math.floor((now - new Date(date)) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (let [unit, value] of Object.entries(intervals)) {
    const count = Math.floor(seconds / value);
    if (count >= 1) {
      return count === 1 ? `${count} ${unit} ago` : `${count} ${unit}s ago`;
    }
  }
  return "just now";
};
   
  const handleDelete = async () => {
    const token = JSON.parse(localStorage.getItem('user'))?.token;
    if (!token) return;

    const response = await fetch('/api/posts/' + post._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      dispatch({ type: 'DELETE_POST', payload: post._id });
    }
    setShowModal(false);
  };

  return (
    <div className="post-details">
      {onBack && (
        <div className="back">
        <button className="back" onClick={onBack} style={{ marginBottom: '10px' }}><FaArrowLeftLong /> </button>
       
        </div>
       
      )}
  
      <p><strong>Author:</strong> {post.username}</p>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
  
  {post.image && (
  <img 
   src={`http://localhost:5000/${post.image}`}
    alt={post.title} 
    style={{ maxWidth: "100%", height: "auto", marginTop: "10px" }} 
    onError={(e) => {
      console.log('Image failed to load:', e.target.src);
      console.log('post.image value:', post.image);
    }}
  />
)}

      <p>{post.url}</p>
      
       <p>{timeAgo(post.createdAt)}</p>

      <div className="votes_comment_count">
        <p>Votes: <span style={{ margin: "0 10px" }}>{post.votes}</span></p>
        <p>Comments: <span style={{ margin: "0 10px" }}>{commentsCount}</span></p>
        
      </div>

      <hr />

      <div className="like_cmt">
        <LikeButtons post={post} />
        <div className="comment">
          {onCommentClick && (
            <button onClick={() => onCommentClick(post)}>
              <FaRegComment  /> Comment
            </button>
          )}
        </div>
      </div>

      {canDelete && (
        <>
          <span onClick={() => setShowModal(true)} className="delete-button">
            <FaTrash size={20} />
          </span>
          <ConfirmModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={handleDelete}
            message="Are you sure you want to delete this post?"
          />
        </>
      )}

      {/* Show comments only in single-post view */}
      {onBack && (
        <div style={{ marginTop: '20px' }}>
          <CommentSection
            postId={post._id}
            onCommentsChange={(count) => {
              setCommentsCount(count); // update local count
              dispatch({
                type: 'UPDATE_POST_COMMENTS_COUNT',
                payload: {
                  postId: post._id,
                  commentsCount: count,
                },
              });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PostDetails;

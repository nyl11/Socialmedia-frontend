import { useEffect, useState } from "react";
import { usePostsContext } from "../hooks/usePostsContext";

const CommentSection = ({ postId, onCommentsChange }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const token = JSON.parse(localStorage.getItem('user'))?.token;

  const { dispatch } = usePostsContext();

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok) {
        setComments(data);
        if (onCommentsChange) onCommentsChange(data.length);
        dispatch({
          type: 'UPDATE_POST_COMMENTS_COUNT',
          payload: { postId, commentsCount: data.length }
        });
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // Add new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ text: newComment })
      });

      const data = await res.json();
      if (res.ok) {
        setComments(data);
        setNewComment('');
        if (onCommentsChange) onCommentsChange(data.length);
        dispatch({
          type: 'UPDATE_POST_COMMENTS_COUNT',
          payload: { postId, commentsCount: data.length }
        });
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("Add comment error:", err);
    }
  };

  // Load comments on mount or when postId changes
  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    
    <div className="comments-section">
      <div className="heading_cmt"><strong>Comments</strong></div>
      <hr/>

       <form onSubmit={handleAddComment}>
        <div className="write_cmt">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          required
        />
        <button type="submit">Post </button>
      </div>
      </form>
      <div className="scrollable-cmt">
      {comments.length > 0 ? (
        comments.map((c, i) => (
          <div key={i} className="comment">
            <p><strong>User:</strong> {c.username}</p>
            <p>{c.text}</p>
          </div>
        ))
      ) : <p>No comments yet.</p>}
      </div>
   </div>
   
  );
};

export default CommentSection;

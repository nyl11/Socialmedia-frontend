import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import { usePostsContext } from '../hooks/usePostsContext';

const LikeButtons = ({ post }) => {
  const { user } = useAuthContext();
  const { dispatch } = usePostsContext();
  const [voteType, setVoteType] = useState(null);

  useEffect(() => {
    const userId = user?._id;
    const vote = post.votedUsers?.find(v => v.userId === userId);
    // debugger
    setVoteType(vote ? vote.voteType : null);
  }, [post.votedUsers, user]);

  const handleVote = async (voteChange) => {
    const token = user?.token;
    if (!token) return;

    const res = await fetch(`/api/posts/${post._id}/vote`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ voteChange })
    });

    const json = await res.json();
    if (!res.ok) return alert(json.error);

    dispatch({
      type: 'UPDATE_POST_VOTE',
      payload: {
        postId: post._id,
        votes: json.votes,
        votedUsers: json.votedUsers,
      }
    });

    // Toggle vote
    if (voteChange === 1) {
      setVoteType(voteType === 'up' ? null : 'up');
    } else {
      setVoteType(voteType === 'down' ? null : 'down');
    }
  };

  return (
    <div className="votes">
      <button className={voteType === 'up' ? 'voted-up' : ''} onClick={() => handleVote(voteType === 'up' ? 0 : 1)}>
        {voteType === 'up' ? <FaThumbsUp /> : <FiThumbsUp />} <span>Support</span>
      </button>
      <button className={voteType === 'down' ? 'voted-down' : ''} onClick={() => handleVote(voteType === 'down' ? 0 : -1)}>
        {voteType === 'down' ? <FaThumbsDown /> : <FiThumbsDown />} <span>Oppose</span> 
      </button>
    </div>
  );
};

export default LikeButtons;

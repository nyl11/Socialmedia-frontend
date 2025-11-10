import { createContext, useReducer } from "react";

export const PostsContext = createContext();

export const PostsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_POSTS':
      return {
        posts: action.payload,
      };

    case 'CREATE_POST':
      return {
        posts: [action.payload, ...state.posts],
      };

    case 'DELETE_POST':
      return {
        posts: state.posts.filter((p) => p._id !== action.payload),
      };

    case 'UPDATE_POST_VOTE':
      return {
        posts: state.posts.map((p) =>
          p._id === action.payload.postId
            ? {
                ...p,
                votes: action.payload.votes,
                votedUsers: action.payload.votedUsers,
              }
            : p
        ),
      };
case 'UPDATE_POST_COMMENTS_COUNT':
  return {
    posts: state.posts.map((p) =>
      p._id === action.payload.postId
        ? {
            ...p,
            commentsCount: action.payload.commentsCount,
          }
        : p
    ),
  };
    default:
      return state;
  }
};

export const PostsContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(PostsReducer, {
    posts: null,
  });

  return (
    <PostsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </PostsContext.Provider>
  );
};

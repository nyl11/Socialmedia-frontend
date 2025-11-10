import { useAuthContext } from './useAuthContext';
import { usePostsContext } from './usePostsContext';

//to logout we should remove data from localstorage
export const useLogout = () =>{
   const { dispatch } =useAuthContext()
   const { dispatch: workoutsDispatch } =usePostsContext()
    const logout=()=>{
      //remove user form localstorage
      localStorage.removeItem('user')

      //dispatch logout acton
      dispatch({type:'LOGOUT'})
      
      workoutsDispatch({type: 'SET_POSTS', payload:null})

   } 
   return {logout}
}
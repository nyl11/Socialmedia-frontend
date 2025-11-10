import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  // Accept FormData instead of separate args
  const signup = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/signup', {
        method: 'POST',
        body: formData // ✅ Send FormData directly
      });

      const json = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setError(json.error || "Signup failed");
        return;
      }

      // save user to localStorage
      localStorage.setItem('user', JSON.stringify(json));

      // update auth context
      dispatch({ type: 'LOGIN', payload: json });

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError("Something went wrong. Please try again.");
      console.error("Signup error:", err);
    }
  };

  return { signup, isLoading, error };
};

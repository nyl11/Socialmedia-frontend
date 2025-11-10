import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();

    const login = async (username, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const json = await response.json();//this json represents token and username

            if (!response.ok) {
                setIsLoading(false);
                setError(json.error);
                return;
            }
            
            //save the user to local storage
            localStorage.setItem('user', JSON.stringify(json));

            //update auth context
            dispatch({ type: 'LOGIN', payload: json });//here also json represents token 
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            setError("Something went wrong. Please try again.");
            console.error("Signup error:", err);
        }
    };

    return { login, isLoading, error };
};

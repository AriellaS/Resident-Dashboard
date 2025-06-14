import { useState } from 'react';

export default function useToken() {

    // need to use local storage ??? just save it in the state memory. so cant be accessed by the user as easily?

    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        try {
            return JSON.parse(tokenString);
        } catch (err) {
            return '';
        }
    }

    const [token, setToken] = useState(getToken());

    const saveToken = (token) => {
        const tokenString = JSON.stringify(token);
        localStorage.setItem('token', tokenString);
        setToken(token);
    }

    const removeToken = () => {
        localStorage.removeItem('token');
        setToken('');
    }

    return {
        setToken: saveToken,
        removeToken,
        token
    }
}


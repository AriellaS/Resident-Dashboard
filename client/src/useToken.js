import { useState } from 'react';

export default function useToken() {


    // need to use local storage ??? just save it in the state memory. so cant be accessed by the user as easily?

    const getToken = () => {
        const tokenString = localStorage.getItem('token');
        return JSON.parse(tokenString);
    }

    const [token, setToken] = useState(getToken());

    const saveToken = (token) => {
        const tokenString = JSON.stringify(token);
        localStorage.setItem('token', tokenString);
        setToken(tokenString);
    }

    return {
        setToken: saveToken,
        token
    }
}


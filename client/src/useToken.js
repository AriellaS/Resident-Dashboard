import { useState } from 'react';

export default function useToken() {

    const getToken = () => {
        return JSON.parse(localStorage.getItem('token'))?.data.token;
    }

    const [token, setToken] = useState(getToken());

    const saveToken = (token) => {
        localStorage.setItem('token', JSON.stringify(token));
        setToken(token.data.token);
    }

    return {
        setToken: saveToken,
        token
    }
}


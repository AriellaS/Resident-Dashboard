import { useState } from 'react';

export default function useCurrentUser() {

    const getCurrentUser = () => {
        const userString = localStorage.getItem('currentUser');
        return JSON.parse(userString);
    }

    const [currentUser, setCurrentUser] = useState(getCurrentUser());

    const saveCurrentUser = (user) => {
        const userString = JSON.stringify(user);
        localStorage.setItem('currentUser', userString);
        setCurrentUser(user);
    }

    const removeCurrentUser = () => {
        localStorage.removeItem('currentUser');
        setCurrentUser('');
    }

    return {
        setCurrentUser: saveCurrentUser,
        removeCurrentUser,
        currentUser
    }
}

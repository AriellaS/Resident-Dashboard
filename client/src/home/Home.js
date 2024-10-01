import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import ajax from '~/util';

const Home = () => {

    const [data, setData] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        ajax.request('get', '/info')
            .then(res => setData(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleLogout = async() => {
        try {
            await ajax.request('post','/logout');
            localStorage.removeItem('token');
            navigate('/login');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            { data }
            <input value="Log Out" type="button" onClick={handleLogout} />
        </div>
    )
};

export default Home;

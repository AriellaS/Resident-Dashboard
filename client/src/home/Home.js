import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {

    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get('/api/info')
            .then(res => setData(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            { data }
        </div>
    )
}

export default Home;

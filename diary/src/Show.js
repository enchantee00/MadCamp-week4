import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Show = () => {
    const location = useLocation();
    const userId = location.state?.userId;
    return (
        <div>
            <h1>Show.js</h1>
            <h2>${userId}</h2>
        </div>
    );
};

export default Show;

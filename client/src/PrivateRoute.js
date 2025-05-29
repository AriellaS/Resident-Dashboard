import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import useToken from '~/useToken';

const PrivateRoute = ({ component: Component, ...rest }) => {

    const { pathname } = useLocation();
    const { token, setToken, removeToken } = useToken();

    const isAuthenticated = !!token;

    const REFRESH_BEFORE_EXPIRY = 60; //seconds

    useEffect(() => {
        async function refreshToken() {
            if (token) {
                let jwtPayload = JSON.parse(window.atob(token.split('.')[1]));
                if ((jwtPayload.exp - REFRESH_BEFORE_EXPIRY)*1000 < new Date().getTime()) {
                    axios.post("/api/refresh")
                        .then(res => {
                            setToken(res.data.accessToken);
                        }).catch(err => {
                            console.error(err)
                            removeToken();
                        });
                }
            }
        }
        refreshToken();
    });

    return isAuthenticated ? ( <Component {...rest} /> ) : ( <Navigate to={`/login?next=${pathname}`} /> );
}

export default PrivateRoute;

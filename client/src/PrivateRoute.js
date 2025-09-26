import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import useToken from '~/useToken';
import useCurrentUser from '~/useCurrentUser';

const PrivateRoute = ({ component: Component, changePwNotRequired, ...rest }) => {

    const { pathname } = useLocation();
    const { token, setToken, removeToken } = useToken();
    const { currentUser, setCurrentUser } = useCurrentUser();

    const userIsAuthenticated = !!token;
    const userRequiresPwChange = !!currentUser && currentUser.changepw_required;
    const pageAccessibleToUser = userIsAuthenticated && (changePwNotRequired || !userRequiresPwChange);

    const REFRESH_BEFORE_EXPIRY = 60; //seconds

    useEffect(() => {
        async function refreshToken() {
            if (token) {
                try {
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
                } catch (err) {
                    console.log(err);
                }
            }
        }
        refreshToken();
    });

    if (pageAccessibleToUser) {
        return (
            <Component currentUser={currentUser} setCurrentUser={setCurrentUser} {...rest} />
        )
    } else {
        return (
            <Navigate to={userIsAuthenticated ? `/changepw` : `/login?next=${pathname}`}/>
        )
    }
}

export default PrivateRoute;

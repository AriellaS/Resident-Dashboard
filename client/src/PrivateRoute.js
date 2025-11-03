import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import useToken from '~/useToken';
import useCurrentUser from '~/useCurrentUser';

const PrivateRoute = ({ component: Component, verificationRequired, pwChangeRequired, ...rest }) => {

    const { pathname } = useLocation();
    const { token, setToken, removeToken } = useToken();
    const { currentUser, setCurrentUser } = useCurrentUser();

    const userIsAuthenticated = !!token;
    const userVerified = !!currentUser && currentUser.account_verified;
    const userRequiresPwChange = !!currentUser && currentUser.changepw_required;
    const pageAccessibleToUser = userIsAuthenticated && (!verificationRequired || userVerified) && (!pwChangeRequired || !userRequiresPwChange);

    useEffect(() => {
        async function refreshToken() {
            if (token) {
                try {
                    let jwtPayload = JSON.parse(window.atob(token.split('.')[1]));
                    if (jwtPayload.exp*1000 < new Date().getTime()) {
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
            if (!token && Cookies.get('refreshToken')) {
                axios.post("/api/refresh")
                    .then(res => {
                        setToken(res.data.accessToken);
                    }).catch(err => {
                        console.error(err)
                        removeToken();
                    });
            }
        }
        refreshToken();
    });

    if (pageAccessibleToUser) {
        return (
            <Component currentUser={currentUser} setCurrentUser={setCurrentUser} {...rest} />
        )
    }
    if (!userIsAuthenticated) {
        return (
            <Navigate to={`/login?next=${pathname}`}/>
        )
    }
    if (!userVerified) {
        return (
            <Navigate to={`/verify`}/>
        )
    }
    return (
        <Navigate to={`/changepw`}/>
    )
}

export default PrivateRoute;

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import useToken from '~/useToken';
import useCurrentUser from '~/useCurrentUser';
import ajax from '~/util.js';
import TextInputWithLabel from '~/login/TextInputWithLabel';
import * as S from '~/login/styles';

const logoPath = "/favicon/favicon.svg";

const Login = () => {

    const [formState, setFormState] = useState({
        email: "",
        password: ""
    });

    const [errorState, setErrorState] = useState({
        isError: false,
msg: ""
    });

    const navigate = useNavigate();
    const { token, setToken, removeToken } = useToken();
    const { setCurrentUser } = useCurrentUser();
    const { search } = useLocation();
    const next = new URLSearchParams(search).get('next');

    useEffect(() => {
        if (token) {
            if (next) {
                navigate(next);
            } else {
                navigate('/');
            }
        }
        if (!token && Cookies.get('refreshToken')) {
            axios.post("/api/refresh")
                .then(res => {
                    setToken(res.data.accessToken);
                    if (next) {
                        navigate(next);
                    } else {
                        navigate('/');
                    }
                }).catch(err => {
                    console.error(err)
                    removeToken();
                });
        }
    });

    const handleSubmit = async(e) => {
        e.preventDefault();
         await ajax.request('post', '/login', {
            email: formState.email,
            password: formState.password
         }).then(res => {
             if (res.data === "User not found") {
                 setErrorState({
                     isError: true,
                     msg: "User not found"
                 });
             } else if (res.data === "Invalid login credentials") {
                 setErrorState({
                     isError: true,
                     msg: "The password you entered is incorrect"
                 });
             } else {
                 setErrorState({
                     isError: false,
                     msg: ""
                 });
                 setToken(res.data.accessToken);
                 setCurrentUser(res.data.user);
                 if (next) {
                     navigate(next);
                 } else {
                     navigate('/');
                 }
             }
         }).catch(err => {
             console.log(err);
             setErrorState({
                 isError: true,
                 msg: "Login failed"
             });
         });
    };

    return (
        <S.CenterScreenContainer>
            <S.Container>
                <S.Image src={logoPath} alt="EvalMD Logo" />
                <S.Header children="Login to your account" />
                <form onSubmit={handleSubmit}>
                    <TextInputWithLabel
                        value={formState.email}
                        placeholder="Enter your email"
                        text="Email"
                        onChange={e => {setFormState({ ...formState, email: e.target.value})} }
                        type="email"
                    />
                    <TextInputWithLabel
                        value={formState.password}
                        placeholder="Enter your password"
                        text="Password"
                        onChange={e => {setFormState({ ...formState, password: e.target.value})} }
                        type="password"
                    />
                    <S.Button
                        type="submit"
                        text="Log In"
                    />
                </form>
                <S.StyledAlertBox state={errorState.isError ? "ERROR" : "HIDDEN"} msg={errorState.msg} />
                {/*<S.StyledLink to={"/signup"} children="Need an acccount?" />*/}
            </S.Container>
        </S.CenterScreenContainer>
    )
}

export default Login;

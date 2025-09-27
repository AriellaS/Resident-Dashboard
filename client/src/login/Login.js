import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import ajax from "~/util.js"
import TextInputWithLabel from '~/login/TextInputWithLabel';
import * as S from '~/login/styles';

const logoPath = "/favicon/favicon.svg";

const Login = ({ setToken, setCurrentUser }) => {

    const [formState, setFormState] = useState({
        email: "",
        password: ""
    });

    const [errorState, setErrorState] = useState({
        isError: false,
        msg: ""
    });

    const navigate = useNavigate();
    const { search } = useLocation();
    const next = new URLSearchParams(search).get('next');

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

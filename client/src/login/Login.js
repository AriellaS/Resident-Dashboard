import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ajax from "~/util.js"
import TextInputWithLabel from '~/login/TextInputWithLabel';
import * as S from '~/login/styles';

const Login = ({ setToken, setCurrentUser }) => {

    const [formState, setFormState] = useState({
        email: "",
        password: ""
    });

    const [errorState, setErrorState] = useState({
        isError: false,
        errorMsg: ""
    });

    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
         await ajax.request('post', '/login', {
            email: formState.email,
            password: formState.password
         }).then(res => {
             setErrorState({
                 isError: false,
                 errorMsg: ""
             });
             setToken(res.data.accessToken);
             setCurrentUser(res.data.user);
             navigate("/");
         }).catch(err => {
             setErrorState({
                 isError: true,
                 errorMsg: err.response.data
             });
         });
    };

    return (
        <S.CenterScreenContainer>
            <S.Container>
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
                <S.StyledErrorBox isError={errorState.isError} errorMsg={errorState.errorMsg} />
                <S.StyledLink to={"/signup"} children="Need an acccount?" />
            </S.Container>
        </S.CenterScreenContainer>
    )
}

export default Login;

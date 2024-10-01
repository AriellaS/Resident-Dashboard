import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ajax from '~/util';
import TextInputWithLabel from '~/login/TextInputWithLabel';
import ErrorBox from '~/login/ErrorBox';
import * as S from '~/login/styles';

const Signup = ({ setToken }) => {

    const [formState, setFormState] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [errorState, setErrorState] = useState({
        isError: false,
        errorMsg: ""
    });

    const navigate = useNavigate();

    const getErrorMsg = () => {
        switch(true) {
            case !formState.firstname: return 'First name is required';
            case !formState.lastname: return 'Last name is required';
            case !formState.email: return 'Email is required';
            case !formState.password: return 'Password is required';
            case formState.password !== formState.confirmPassword: return 'Passwords do not match';
            default: return false;
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        const errorMsg = getErrorMsg();
        if (errorMsg) {
            return setErrorState({
                isError: true,
                errorMsg: errorMsg
            });
        }
        await ajax.request('post', '/users', {
            firstname: formState.firstname,
            lastname: formState.lastname,
            email: formState.email,
            password: formState.password
        }).then(res => {
            setErrorState({
                isError: false,
                errorMsg: "",
            });
            setToken(res.data.accessToken);
            navigate('/');
        }).catch(err => {
            setErrorState({
                isError: true,
                errorMsg: err.response.data
            });
        });
    }

    return (
        <S.Container>
            <ErrorBox isError={errorState.isError} errorMsg={errorState.errorMsg} />
            <S.Header children="Create a new account" />
            <form onSubmit={handleSubmit}>
                <TextInputWithLabel
                    value={formState.firstname}
                    placeholder="Enter your first name"
                    text="First Name"
                    onChange={e => {setFormState({ ...formState, firstname: e.target.value})} }
                />
                <TextInputWithLabel
                    value={formState.lastname}
                    placeholder="Enter your last name"
                    text="Last Name"
                    onChange={e => {setFormState({ ...formState, lastname: e.target.value})} }
                />
                <TextInputWithLabel
                    value={formState.email}
                    placeholder="Enter your Montefiore email"
                    text="Email"
                    onChange={e => {setFormState({ ...formState, email: e.target.value})} }
                />
                <TextInputWithLabel
                    value={formState.password}
                    placeholder="Create a password"
                    text="Password"
                    onChange={e => {setFormState({ ...formState, password: e.target.value})} }
                    type="password"
                />
                <TextInputWithLabel
                    value={formState.confirmPassword}
                    placeholder="Confirm your password"
                    text="Confirm Password"
                    onChange={e => {setFormState({ ...formState, confirmPassword: e.target.value})} }
                    type="password"
                />
                <S.Button
                    value="Sign Up"
                    type="submit"
                />
            </form>
            <S.StyledLink to="/login" children="Already have an acccount?" />
        </S.Container>
    )
}

export default Signup;

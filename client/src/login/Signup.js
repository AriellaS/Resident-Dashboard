import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ajax from '~/util';
import TextInputWithLabel from '~/login/TextInputWithLabel';
import * as S from '~/login/styles';

const Signup = ({ setToken, setCurrentUser }) => {

    const [formState, setFormState] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "RESIDENT"
    });

    const [errorState, setErrorState] = useState({
        isError: false,
        msg: ""
    });

    const navigate = useNavigate();

    const emailIsValid = (email) => {
        let emailPattern = /^([\w-]+(?:\.[\w-]+)*)@(montefiore\.org|einsteinmed\.edu)$/i;
        return emailPattern.test(formState.email);
    }

    const getErrorMsg = () => {
        switch(true) {
            case !formState.firstname: return 'First name is required';
            case !formState.lastname: return 'Last name is required';
            case !formState.email: return 'Email is required';
            case !emailIsValid(): return 'Email needs to be @montefiore.org or @einsteinmed.edu';
            case !formState.password: return 'Password is required';
            case formState.password.length < 8: return 'Password must be at least 8 characters';
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
                msg: errorMsg
            });
        }
        await ajax.request('post', '/users', {
            firstname: formState.firstname,
            lastname: formState.lastname,
            email: formState.email,
            password: formState.password,
            role: formState.role
        }).then(res => {
            if (res.data === "Email is already in use") {
                setErrorState({
                    isError: true,
                    msg: "An account already exists for this email"
                });
            } else {
                setErrorState({
                    isError: false,
                    msg: "",
                });
                setToken(res.data.accessToken);
                setCurrentUser(res.data.user);
                navigate('/');
            }
        }).catch(err => {
            setErrorState({
                isError: true,
                msg: "Unable to create account"
            });
            console.log(err);
        });
    }

    return (
        <S.CenterScreenContainer>
            <S.Container>
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
                        type="email"
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
                    <S.StyledFancyRadio
                        name="roletoggle"
                        values={["RESIDENT", "ATTENDING"]}
                        texts={["Resident", "Attending"]}
                        default={0}
                        onChange={e => {setFormState({ ...formState, role: e.target.value})} }
                    />
                    <S.Button
                        text="Sign Up"
                        type="submit"
                    />
                </form>
                <S.StyledAlertBox state={errorState.isError ? "ERROR" : "HIDDEN"} msg={errorState.msg} />
                <S.StyledLink to="/login" children="Already have an account?" />
            </S.Container>
        </S.CenterScreenContainer>
    )
}

export default Signup;

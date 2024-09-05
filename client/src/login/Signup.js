import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

import TextInput from '~/login/TextInput';
import ErrorBox from '~/login/ErrorBox';
import styles from '~/login/styles';

const Signup = () => {

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

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!formState.firstname) {
            return setErrorState({
                isError: true,
                errorMsg: 'First name is required'
            });
        }
        if (!formState.lastname) {
            return setErrorState({
                isError: true,
                errorMsg: 'Last name is required'
            });
        }
        if (!formState.email) {
            return setErrorState({
                isError: true,
                errorMsg: 'Email is required'
            });
        }
        if (!formState.password) {
            return setErrorState({
                isError: true,
                errorMsg: 'Password is required'
            });
        }
        if (formState.password !== formState.confirmPassword) {
            return setErrorState({
                isError: true,
                errorMsg: 'Passwords do not match'
            });
        }

        try {
            await axios.post('api/users', {
                firstname: formState.firstname,
                lastname: formState.lastname,
                email: formState.email,
                password: formState.password
            });
            setErrorState({
                isError: false,
                errorMsg: "",
            });
            navigate('/');
        } catch(err) {
            console.error(err)
            setErrorState({
                isError: true,
                errorMsg: err.response.data
            });
        };
    }

    return (
        <div style={styles.box}>
            <ErrorBox isError={errorState.isError} errorMsg={errorState.errorMsg} />
            <div style={styles.boxHeader} children="Create a new account" />
            <form onSubmit={handleSubmit}>
                <TextInput
                    value={formState.firstname}
                    placeholder="Enter your first name"
                    text="First Name"
                    onChange={e => {setFormState({ ...formState, firstname: e.target.value})} }
                />
                <TextInput
                    value={formState.lastname}
                    placeholder="Enter your last name"
                    text="Last Name"
                    onChange={e => {setFormState({ ...formState, lastname: e.target.value})} }
                />
                <TextInput
                    value={formState.email}
                    placeholder="Enter your Montefiore email"
                    text="Email"
                    onChange={e => {setFormState({ ...formState, email: e.target.value})} }
                />
                <TextInput
                    value={formState.password}
                    placeholder="Create a password"
                    text="Password"
                    onChange={e => {setFormState({ ...formState, password: e.target.value})} }
                    type="password"
                />
                <TextInput
                    value={formState.confirmPassword}
                    placeholder="Confirm your password"
                    text="Confirm Password"
                    onChange={e => {setFormState({ ...formState, confirmPassword: e.target.value})} }
                    type="password"
                />
                <input
                    value="Create Account"
                    type="submit"
                    style={styles.button}
                />
            </form>
            <div style={styles.link.container}>
                <Link to="/login" children="Already have an acccount?" style={styles.link.text} />
            </div>
        </div>
    )
}

export default Signup;

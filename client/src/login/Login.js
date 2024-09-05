import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

import TextInput from '~/login/TextInput';
import ErrorBox from '~/login/ErrorBox';
import styles from '~/login/styles';

const Login = ({ setToken }) => {

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
        try {
            const token = await axios.post('api/login', {
                email: formState.email,
                password: formState.password
            });
            setErrorState({
                isError: false,
                errorMsg: ""
            });
            setToken(token);
            navigate("/");
        } catch(err) {
            setErrorState({
                isError: true,
                errorMsg: err.response.data
            });
        };
    }

    return (
        <div style={styles.box}>
            <ErrorBox isError={errorState.isError} errorMsg={errorState.errorMsg} />
            <div style={styles.boxHeader} children="Login to your account" />
            <form onSubmit={handleSubmit}>
                <TextInput
                    value={formState.email}
                    placeholder="Enter your email"
                    text="Email"
                    onChange={e => {setFormState({ ...formState, email: e.target.value})} }
                />
                <TextInput
                    value={formState.password}
                    placeholder="Enter your password"
                    text="Password"
                    onChange={e => {setFormState({ ...formState, password: e.target.value})} }
                    type="password"
                />
                <input
                    value="Log In"
                    type="submit"
                    style={styles.button}
                />
            </form>
            <div style={styles.link.container}>
                <Link to={"/signup"} children="Need an acccount?" style={styles.link.text} />
            </div>
        </div>
    )
}

export default Login;

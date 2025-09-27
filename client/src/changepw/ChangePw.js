import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ajax from '~/util';
import * as S from '~/changepw/styles'

const ChangePw = ({ currentUser, setCurrentUser }) => {

    const [formState, setFormState] = useState({
        password: "",
        confirmPassword: "",
    });

    const [alert, setAlert] = useState({
        state: "HIDDEN",
        msg: ""
    });

    const navigate = useNavigate();

    const getErrorMsg = () => {
        switch(true) {
            case !formState.password: return 'Password is required';
            case formState.password.length < 8: return 'Password must be at least 8 characters';
            case formState.password !== formState.confirmPassword: return 'Passwords do not match';
            default: return false;
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errorMsg = getErrorMsg();
        if (errorMsg) {
            return setAlert({
                state: "ERROR",
                msg: errorMsg
            });
        }
        await ajax.request('put', `/changepw`, { password: formState.password })
            .then(res => {
                if (res.data === "Password changed") {
                    setCurrentUser({ ...currentUser, changepw_required: false});
                    setAlert({
                        state: "SUCCESS",
                        msg: "Password changed successfully"
                    });
                    navigate('/');
                }
            }).catch(err => {
                console.log(err);
                setAlert({
                    state: "ERROR",
                    msg: "Failed to change password"
                });
            });
    }

    return (
        <S.CenterScreenContainer>
            <S.Container>
                <S.Header children="Create new password" />
                <form onSubmit={handleSubmit}>
                    <S.TextInput
                        value={formState.password}
                        placeholder="New password"
                        onChange={e => {setFormState({ ...formState, password: e.target.value })} }
                        type='password'
                    />
                    <S.TextInput
                        value={formState.confirmPassword}
                        placeholder="Confirm new password"
                        onChange={e => {setFormState({ ...formState, confirmPassword: e.target.value })} }
                        type='password'
                    />
                    <S.Button
                        type="submit"
                        text="Submit"
                        onClick={handleSubmit}
                    />
                </form>
                <S.StyledAlertBox state={alert.state} msg={alert.msg} />
            </S.Container>
        </S.CenterScreenContainer>
    )
}

export default ChangePw;

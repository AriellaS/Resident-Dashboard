import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useToken from '~/useToken';
import useCurrentUser from '~/useCurrentUser';
import ajax from '~/util';
import * as S from '~/changepw/styles'

const ChangePw = () => {

    const [formState, setFormState] = useState({
        password: "",
        confirmPassword: "",
    });

    const [alert, setAlert] = useState({
        state: "HIDDEN",
        msg: ""
    });

    const navigate = useNavigate();
    const params = useParams();
    const { setToken } = useToken();
    const { currentUser, setCurrentUser } = useCurrentUser();

    const pwResetToken = params.token;

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
        if (pwResetToken) {
            await ajax.request('put', `/changepw/token/${pwResetToken}`, { password: formState.password })
                .then(res => {
                    setToken(res.data.accessToken);
                    setCurrentUser(res.data.user);
                    setAlert({
                        state: "SUCCESS",
                        msg: "Password changed successfully"
                    });
                    navigate('/');
                }).catch(err => {
                    setAlert({
                        state: "ERROR",
                        msg: "The link you used is invalid or expired"
                    });
                });

        } else {
            await ajax.request('put', `/changepw`, { password: formState.password })
                .then(res => {
                    setCurrentUser({ ...currentUser, changepw_required: false});
                    setAlert({
                        state: "SUCCESS",
                        msg: "Password changed successfully"
                    });
                    navigate('/');
                }).catch(err => {
                    console.log(err);
                    setAlert({
                        state: "ERROR",
                        msg: "Failed to change password"
                    });
                });
        }
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
                { pwResetToken && <S.StyledLink to={'/forgotpw'} children={'Click here to get a new link'}/> }
            </S.Container>
        </S.CenterScreenContainer>
    )
}

export default ChangePw;

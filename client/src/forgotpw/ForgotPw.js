import { useState } from 'react';
import ajax from '~/util';
import * as S from '~/forgotpw/styles';

const ForgotPw = () => {

    const [formState, setFormState] = useState({
        email: "",
    });

    const [alert, setAlert] = useState({
        state: "HIDDEN",
        msg: ""
    });

    const handleRequestPasswordReset = async (e) => {
        e.preventDefault();
        await ajax.request('put', `/forgotpw`, { email: formState.email})
            .then(res => {
                if (res.data === "User not found") {
                    setAlert({
                        state: "ERROR",
                        msg: "No account with this email exists"
                    });
                }
                if (res.data === "Password reset link sent") {
                    setAlert({
                        state: "SUCCESS",
                        msg: "Check your email for a password reset link!"
                    });
                }
            }).catch(err => {
                console.log(err);
                setAlert({
                    state: "ERROR",
                    msg: "Failed to send code"
                });
            });
    }

    return (
        <S.CenterScreenContainer>
            <S.Container>
                <S.Header children="Forgot password?" />
                <S.SubHeader children={`No worries, enter your email for reset instructions.`} />
                <form onSubmit={handleRequestPasswordReset}>
                    <S.TextInput
                        value={formState.email}
                        placeholder="Email"
                        onChange={e => {setFormState({ ...formState, email: e.target.value })} }
                    />
                    <S.Button
                        type="submit"
                        text="Reset Password"
                        onClick={handleRequestPasswordReset}
                    />
                </form>
                <S.StyledAlertBox state={alert.state} msg={alert.msg} />
            </S.Container>
        </S.CenterScreenContainer>
    )

}

export default ForgotPw;

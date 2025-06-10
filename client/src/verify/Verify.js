import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CodeInput from '~/verify/CodeInput';
import ajax from '~/util';
import * as S from '~/verify/styles';

const NUM_DIGITS = 6;

const logoPath = "/favicon/favicon.svg";

const Verify = ({ currentUser, setCurrentUser }) => {

    const [userEmail, setUserEmail] = useState();
    const [inputs, setInputs] = useState(new Array(NUM_DIGITS).fill(""));
    const [alert, setAlert] = useState({
        state: "HIDDEN",
        msg: ""
    });

    const userId = currentUser._id;
    const navigate = useNavigate();

    const handleVerify = async () => {
        const code = inputs.join("");
        await ajax.request('put', `/verify`, { code: code })
            .then(res => {
                if (res.data === "Verification code is incorrect") {
                    setAlert({
                        state: "ERROR",
                        msg: "The code you entered is incorrect"
                    });
                } else if (res.data === "User verified") {
                    setCurrentUser({ ...currentUser, email_verified: true });
                    setAlert({
                        state: "SUCCESS",
                        msg: "Account verified"
                    });
                    navigate('/');
                }
            }).catch(err => {
                console.log(err);
                if (err.response.data === "User is already verified") {
                    setAlert({
                        state: "ERROR",
                        msg: "Your account is already verified"
                    });
                    setCurrentUser({ ...currentUser, email_verified: true });
                    navigate('/');
                } else {
                    setAlert({
                        state: "ERROR",
                        msg: "Failed to verify your account"
                    });
                }
            });
    }

    const handleRequestNewCode = async () => {
        console.log(alert)
        await ajax.request('put', `/verify/new`)
            .then(res => {
                setAlert({
                    state: "SUCCESS",
                    msg: "New code was sent to your email"
                });
            }).catch(err => {
                console.log(err);
                setAlert({
                    state: "ERROR",
                    msg: "Failed to send code"
                });
            });
    }

    useEffect(() => {
        async function fetchData() {
            await ajax.request('get',`/users/id/${userId}`)
                .then(res => {
                    setUserEmail(res.data.email);
                }).catch(err => {
                    console.log(err);
                });
        }
        fetchData();
    }, [userId]);

    return (
        <S.CenterScreenContainer>
            <S.Container>
                <S.Image src={logoPath} alt="EvalMD Logo" />
                <S.Header children="Enter Verification Code" />
                <S.SubHeader children={`We sent a code to ${userEmail}`} />
                <CodeInput inputs={inputs} setInputs={setInputs} handleVerify={handleVerify} />
                <S.SmallTextContainer>
                    <S.SmallTextUnderlined children={'Click here'} onClick={handleRequestNewCode} />
                    <S.SmallText children={'to resend verification code.'} />
                </S.SmallTextContainer>
                <S.StyledAlertBox state={alert.state} msg={alert.msg} />
            </S.Container>
        </S.CenterScreenContainer>
    )

}

export default Verify;

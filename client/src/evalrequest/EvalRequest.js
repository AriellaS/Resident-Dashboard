import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ajax from '~/util';
import * as S from '~/evalrequest/styles';
import Navbar from '~/shared/Navbar';
import AlertBox from '~/shared/AlertBox';

const EvalRequest = () => {

    const params = useParams();
    const userId = params.id;

    const [userData, setUserData] = useState({
        firstname: "",
        lastname: "",
        id: userId,
    });

    const [formState, setFormState] = useState({
        note: "",
    });

    const [submissionState, setSubmissionState] = useState(false);

    const [errorState, setErrorState] = useState({
        isError: false,
        msg: ""
    });

    useEffect(() => {
        async function fetchData() {
            await ajax.request('get',`/users/id/${userId}`)
                .then(res => {
                    setUserData({
                        firstname: res.data.firstname,
                        lastname: res.data.lastname,
                        pgy: res.data.pgy,
                        id: userId
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        }
        fetchData();
    }, [userId]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!formState.note) {
            return setErrorState({
                isError: true,
                msg: "Make sure you add a note!"
            });
        }
       await ajax.request('post', `/users/id/${userId}/evalrequest`, {
            note: formState.note
        }).then(res => {
            setSubmissionState(true);
            setErrorState({
                isError: false,
                msg: ""
            });
        }).catch(err => {
            console.log(err);
            setErrorState({
                isError: true,
                msg: "Unable to request eval"
            });
        });
    }

    return (
        <S.ScreenContainer>
            <Navbar />
            <S.CenterScreenContainer>
                <S.Container>
                    <S.Header children={`Request evaluation from ${userData.firstname} ${userData.lastname}`} />
                    <hr />
                    {submissionState ? (
                        <div>
                            <S.StyledCheckGlyph />
                            <S.SubmissionText children={`Request sent!`} />
                        </div>
                    ) : (
                    <form onSubmit={handleSubmit}>
                        <S.QuestionsContainer>
                            <S.QuestionContainer>
                                <S.QuestionText children="Add a short note to remind them which procedure you're requesting feedback on." />
                                <S.TextInput onChange={e => {setFormState({ ...formState, note: e.target.value})} } />
                            </S.QuestionContainer>
                        </S.QuestionsContainer>
                        <S.Button text="Submit" type="submit" />
                    </form>
                    )}
                    <AlertBox state={errorState.isError ? "ERROR" : "HIDDEN"} msg={errorState.msg} />
                </S.Container>
            </S.CenterScreenContainer>
        </S.ScreenContainer>
    )
}

export default EvalRequest;

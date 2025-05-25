import React, {useState, useEffect} from 'react';
import EvalForm from '~/eval/EvalForm';
import ajax from '~/util';
import { useParams } from 'react-router-dom';
import * as S from '~/eval/styles';
import Navbar from '~/shared/Navbar';

const Eval = () => {

    const params = useParams();
    const userId = params.id;

    const [userData, setUserData] = useState({
        firstname: "",
        lastname: ""
    });

    const [formState, setFormState] = useState({
        briefing: "",
        rating: ""
    });

    const [submissionState, setSubmissionState] = useState(false);

    const [errorState, setErrorState] = useState({
        isError: false,
        errorMsg: ""
    });

    useEffect(() => {
        async function fetchData() {
            await ajax.request('get',`/users/id/${userId}`)
                .then(res => {
                    setUserData({
                        firstname: res.data.firstname,
                        lastname: res.data.lastname,
                    })
                })
                .catch(err => {
                    console.log(err);
                    // have error state for user not found
                });
        }
        fetchData();
    }, [userId]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!formState.briefing || !formState.rating) {
            setErrorState({
                isError: true,
                errorMsg: "Please complete the required fields"
            });
            return;
        }
        await ajax.request('post', '/evals', {
            type: "ATTENDING2RESIDENT",
            evaluatee: userId,
            briefing: formState.briefing,
            rating: formState.rating
        }).then(res => {
            setSubmissionState(true);
            setErrorState({
                isError: false,
                errorMsg: ""
            });
        }).catch(err =>  {
            setErrorState({
                isError: true,
                errorMsg: "Error submitting form"
            });
        });
    };

    if (submissionState) {
        return (
            <S.CenterScreenContainer>
                <Navbar />
                <S.Container>
                    <S.StyledCheckGlyph />
                    <hr />
                    <S.SubmissionText children={`Evaluation submitted for ${userData.firstname} ${userData.lastname}`} />
                </S.Container>
            </S.CenterScreenContainer>
        )
    }

    return (
        <S.ScreenContainer>
            <Navbar />
            <S.CenterScreenContainer>
                <S.Container>
                    <S.Header children={`Evaluation for ${userData.firstname} ${userData.lastname}`} />
                    <S.StyledErrorBox isError={errorState.isError} errorMsg={errorState.errorMsg} />
                    <EvalForm />
                </S.Container>
            </S.CenterScreenContainer>
        </S.ScreenContainer>
    )
}

export default Eval;

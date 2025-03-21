import React, {useState, useEffect} from 'react';
import Question from '~/eval/Question';
import ajax from '~/util';
import { useParams } from 'react-router-dom';
import * as S from '~/eval/styles';

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
                <S.Container>
                    <S.StyledCheckGlyph />
                    <hr />
                    <S.SubmissionText children={`Evaluation submitted for ${userData.firstname} ${userData.lastname}`} />
                </S.Container>
            </S.CenterScreenContainer>
        )
    }

    return (
        <S.CenterScreenContainer>
            <S.Container>
                <S.Header children={`Evaluation for ${userData.firstname} ${userData.lastname}`} />
                <form onSubmit={handleSubmit}>
                    <Question
                        type="radio"
                        name="briefing"
                        text="How was the pre-operative briefing performed with this resident?"
                        optionValues={["PHONE","DAYOF","NONE"]}
                        optionTexts={["Text/Phone Call", "Discussion day of surgery", "No briefing"]}
                        onChange={e => setFormState({...formState, briefing: e.target.value}) }
                    />
                    <Question
                        type="radio"
                        name="rating"
                        text="How would you rate this resident's preparation for the surgery?"
                        optionValues={["5","4","3","2","1"]}
                        optionTexts={["5 (most prepared)","4","3","2","1 (least prepared)"]}
                        onChange={e => setFormState({...formState, rating: e.target.value}) }
                    />
                    <S.Button
                        value="Submit"
                        type="submit"
                    />
                </form>
                <S.StyledErrorBox isError={errorState.isError} errorMsg={errorState.errorMsg} />
            </S.Container>
        </S.CenterScreenContainer>
    )
}

export default Eval;

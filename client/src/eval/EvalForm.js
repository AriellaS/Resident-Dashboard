import React, {useState} from 'react';
import Question from '~/eval/Question';
import { Pages, Questions } from  '~/shared/AttendingToResidentEvalForm';
import * as S from '~/eval/styles';
import ajax from '~/util';

const EvalForm = (props) => {

    const [pageState, setPageState] = useState(0);

    const [formState, setFormState] = useState(Object.fromEntries(Questions.map(q => (
        [q.name, q.type==='DATE' ? null : ""]
    ))));

    const [submissionState, setSubmissionState] = useState(false);

    const [errorState, setErrorState] = useState({
        isError: false,
        errorMsg: ""
    });

    const isOnLastPage = () => {
        return pageState >= Pages.length - 1
    }

    const handleBack = () => { handleSetPage(pageState - 1) }
    const handleNext = () => { handleSetPage(pageState + 1) }

    const handleSetPage = (page) => {
        if (page > -1 & page < Pages.length) {
            if (page > pageState) {
                window.scrollTo(0,0);
            }
            setPageState(page);
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        await ajax.request('post', `/users/id/${props.userData.id}/evals`, {
            type: "ATTENDING2RESIDENT",
            form: formState,
        }).then(res => {
            setSubmissionState(true);
            setErrorState({
                isError: false,
                errorMsg: ""
            });
        }).catch(err =>  {
            console.log(err)
            setErrorState({
                isError: true,
                errorMsg: "Error submitting form"
            });
        });
    };

    if (submissionState) {
        return (
            <div>
                <S.StyledCheckGlyph />
                <hr />
                <S.SubmissionText children={`Evaluation submitted for ${props.userData.firstname} ${props.userData.lastname}`} />
            </div>
        )
    }

    return (
        <div>
            {Pages[pageState].text}
            <S.QuestionsContainer>
                {Questions.filter(q => q.page === Pages[pageState].name).map(q => (
                    <Question
                        key={q.name}
                        name={q.name}
                        type={q.type}
                        text={q.questionText}
                        value={formState[q.name]}
                        optionValues={q.type==='RADIO' ?
                                [...Array(q.optionTexts.length).keys()] : null
                        }
                        optionTexts={q.type==='RADIO' ? q.optionTexts : null}
                        onChange={e => {
                            q.type==='DATE' ? setFormState({...formState, [q.name]: e}) : setFormState({...formState, [q.name]: e.target.value}) }
                        }
                    />
                ))}
            </S.QuestionsContainer>
            <S.HorizontalContainer>
                <S.NavButton
                    text="Back"
                    onClick={handleBack}
                    disabled={pageState <= 0}
                />
                {isOnLastPage() ? (
                    <S.NavButton
                        text="Submit"
                        variant="success"
                        onClick={handleSubmit}
                    />
                ) : (
                    <S.NavButton
                        text="Next"
                        onClick={handleNext}
                        disabled={pageState >= Pages.length - 1}
                    />
                )}
            </S.HorizontalContainer>
            <S.ProgressBar now={pageState/(Pages.length - 1) * 100}/>
            <S.StyledErrorBox isError={errorState.isError} errorMsg={errorState.errorMsg} />
        </div>
    )
}

export default EvalForm;

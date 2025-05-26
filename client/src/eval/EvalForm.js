import React, {useState} from 'react';
import Question from '~/eval/Question';
import { Pages, Questions } from  '~/shared/AttendingToResidentEvalForm';
import * as S from '~/eval/styles';

const EvalForm = () => {

    const [pageState, setPageState] = useState(0);

    const [formState, setFormState] = useState(Object.fromEntries(Questions.map(q => (
        [q.name, q.type.includes('TEXT') ? "" : null]
    ))));

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
                        onChange={e => setFormState({...formState, [q.name]: e.target.value}) }
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
        </div>
    )
}

export default EvalForm;

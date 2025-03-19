import React from 'react';
import * as S from '~/eval/styles';

const Question = (props) => {

    if  (props.type === 'radio') {
        return (
            <S.QuestionContainer>
                <hr />
                <S.QuestionText>{props.text}</S.QuestionText>
                <S.OptionsContainer>
                    {props.optionValues.map((optionValue, i) => {
                        let id = `${props.name}_${i}`;
                        return (
                            <div key={id}>
                                <input type="radio" id={id} name={props.name} value={optionValue}/>
                                <S.OptionText htmlFor={id}>
                                    {props.optionTexts[i]}
                                </S.OptionText>
                            </div>
                        )
                    })}
                </S.OptionsContainer>
            </S.QuestionContainer>
        )
    }
}

export default Question;

import * as S from '~/eval/styles';

const Question = (props) => {

    if  (props.type === 'RADIO') {
        return (
            <S.QuestionContainer>
                <hr />
                <S.QuestionText>{props.text}</S.QuestionText>
                <S.OptionsContainer>
                    {props.optionValues.map((optionValue, i) => {
                        let id = `${props.name}_${i}`;
                        return (
                            <div key={id}>
                                <input type='radio' id={id} name={props.name} value={optionValue} onChange={props.onChange}/>
                                <S.OptionText htmlFor={id}>
                                    {props.optionTexts[i]}
                                </S.OptionText>
                            </div>
                        )
                    })}
                </S.OptionsContainer>
            </S.QuestionContainer>
        )
    } else if (props.type === 'SHORT_TEXT') {
        return (
            <S.QuestionContainer>
                <hr />
                <S.QuestionText>{props.text}</S.QuestionText>
                <S.TextInput />
            </S.QuestionContainer>
        )
    } else if (props.type === 'LONG_TEXT') {
        return (
            <S.QuestionContainer>
                <hr />
                <S.QuestionText>{props.text}</S.QuestionText>
                <S.TextArea/>
            </S.QuestionContainer>
        )
    }
}

export default Question;

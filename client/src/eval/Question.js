import * as S from '~/eval/styles';
import { DatePicker } from 'rsuite';

const Question = (props) => {
    const questionHeading = (
        <S.QuestionText>
            {props.text}
            {props.note && (
                <S.QuestionNote children={props.note}/>
            )}
        </S.QuestionText>
    )
    if  (props.type === 'RADIO') {
        return (
            <S.QuestionContainer>
                <hr />
                {questionHeading}
                <S.OptionsContainer>
                    {props.optionValues.map((optionValue, i) => {
                        let id = `${props.name}_${i}`;
                        return (
                            <div key={id}>
                                <input
                                    type='radio'
                                    id={id}
                                    name={props.name}
                                    value={optionValue}
                                    checked={props.value===optionValue + ''}
                                    onChange={props.onChange}
                                />
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
                {questionHeading}
                <S.TextInput onChange={props.onChange} value={props.value} />
            </S.QuestionContainer>
        )
    } else if (props.type === 'LONG_TEXT') {
        return (
            <S.QuestionContainer>
                <hr />
                {questionHeading}
                <S.TextArea onChange={props.onChange} value={props.value} />
            </S.QuestionContainer>
        )
    } else if (props.type === 'DATE') {
        return (
            <S.QuestionContainer>
                <hr />
                {questionHeading}
                <DatePicker
                    oneTap
                    defaultValue={new Date()}
                    value={props.value}
                    onChange={props.onChange}
                    format='MM/dd/yyyy'
                    editable={false}
                />
            </S.QuestionContainer>
        )
    }
}

export default Question;

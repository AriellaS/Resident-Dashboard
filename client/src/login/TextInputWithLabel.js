import * as S from "~/login/styles";

const TextInputWithLabel = (props) => {
    return (
        <S.TextInputContainer>
            <S.TextInputLabel>{props.text}</S.TextInputLabel>
            <S.TextInput
                value={props.value}
                placeholder={props.placeholder}
                onChange={props.onChange}
                type={props.type}
            />
        </S.TextInputContainer>
    )
}
export default TextInputWithLabel;

import React from 'react'
import * as S from '~/login/styles';

const ErrorBox = (props) => {

    if (props.isError) {
        return (
            <S.ErrorBoxContainer>
                <S.WarningGlyph />
                <S.ErrorBoxMessage>{props.errorMsg}</S.ErrorBoxMessage>
            </S.ErrorBoxContainer>
        )
    }
}

export default ErrorBox;

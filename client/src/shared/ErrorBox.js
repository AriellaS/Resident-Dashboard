import styled from 'styled-components';
import { ExclamationTriangle } from 'react-bootstrap-icons';

const errorColor = "#ff9900";

const ErrorBoxContainer = styled.div`
    background-color: #fff8ed;
    border-radius: 5px;
    border: 1px solid ${errorColor};
    display: flex;
    flex-direction: row;
    padding: 8px;
    width: 100%
`;

const ErrorBoxMessage = styled.div`
    color: errorColor;
    font-size: 13px;
    font-family: helvetica;
    margin-left: 5px;
`;

export const WarningGlyph = styled(ExclamationTriangle)`
    size: 20;
    color: ${errorColor};
`;

const ErrorBox = (props) => {

    if (props.isError) {
        return (
            <ErrorBoxContainer className={props.className}>
                <WarningGlyph />
                <ErrorBoxMessage>{props.errorMsg}</ErrorBoxMessage>
            </ErrorBoxContainer>
        )
    }
}

export default ErrorBox;

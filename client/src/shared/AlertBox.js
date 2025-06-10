import styled from 'styled-components';
import { Exclamation } from 'react-bootstrap-icons';
import { Check } from 'react-bootstrap-icons';
import { accentColor } from '~/shared';

const errorColorLight = "#fff8ed";
const errorColorDark = "#ff9900";

const successColor = accentColor;

const AlertContainer = styled.div`
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    padding: 8px;
    width: 100%;
    margin: 15px 0 15px 0;
`;

const ErrorContainer = styled(AlertContainer)`
    background-color: ${errorColorLight};
`;

const SuccessContainer = styled(AlertContainer)`
    background-color: ${successColor};
`;

const AlertMessage = styled.div`
    font-size: 13px;
    font-family: helvetica;
`;

const ErrorMessage = styled(AlertMessage)`
    color: ${errorColorDark};
`;

const SuccessMessage = styled(AlertMessage)`
    color: white;
`

export const ErrorGlyph = styled(Exclamation)`
    size: 50;
    color: ${errorColorDark};
`;

export const SuccessGlyph = styled(Check)`
    size: 20;
    color: white;
`;

const ErrorBox = ({ state, msg }) => {
    if (state==="ERROR") {
        return (
            <ErrorContainer>
                <ErrorGlyph />
                <ErrorMessage>{msg}</ErrorMessage>
            </ErrorContainer>
        )
    } else if (state==="SUCCESS") {
        return (
            <SuccessContainer>
                <SuccessGlyph />
                <SuccessMessage>{msg}</SuccessMessage>
            </SuccessContainer>
        )
    }
}

export default ErrorBox;

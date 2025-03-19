import styled from 'styled-components';
import * as shared from '~/shared';
import ErrorBox from '~/shared/ErrorBox';
import { CheckCircle } from 'react-bootstrap-icons';

export const Header = styled.div`
    font-size: 25px;
`;

export const QuestionContainer = styled.div`
    background-color: white;
    margin: 20px;
    padding: 5px;
    border-radius: 10px;
`;

export const QuestionText = styled.div`
    margin-bottom: 20px;
    margin-top: 20px;
    font-size: 18px;
    text-align: left;
`;

export const OptionsContainer = styled.div`
    text-align: left;
`;

export const OptionText = styled.label`
    padding: 10px;
    font-size: 15px;
`;

export const StyledErrorBox = styled(ErrorBox)`
    margin: 10px;
`;

export const StyledCheckGlyph = styled(CheckCircle)`
    font-size: 50px;
    color: ${shared.accentColor};
    margin: 10px 0;
`;

export const SubmissionText = styled.div`
    font-size: 20px;
    margin: 20px 0;
`;

export const Container = shared.Container;
export const Button = shared.Button;

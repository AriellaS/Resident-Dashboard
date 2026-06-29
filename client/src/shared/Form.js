import styled from 'styled-components';
import * as shared from '~/shared';
import { CheckCircle } from 'react-bootstrap-icons';

export const Header = styled.div`
    font-size: min(6vw, 25px);
`;

export const QuestionContainer = styled.div`
    background-color: white;
    margin: 20px;
    border-radius: 10px;
`;

export const QuestionsContainer = styled.div`
    //max-height: 65vh;
    //overflow: auto;
`;

export const QuestionText = styled.div`
    margin-bottom: 20px;
    margin-top: 20px;
    font-size: min(4vw, 18px);
    text-align: left;
`;

export const QuestionNote = styled.div`
    font-size: min(3.5vw, 15px);
    color: #a3a3a3;
`;

export const OptionsContainer = styled.div`
    text-align: left;
`;

export const OptionText = styled.label`
    padding: 3px 0 0 5px;
    font-size: min(4vw, 15px);
`;

export const StyledCheckGlyph = styled(CheckCircle)`
    font-size: 50px;
    color: ${shared.accentColor};
    margin: 10px 0;
`;

export const SubmissionText = styled.div`
    font-size: min(4.5vw, 20px);
    margin: 20px 0;
`;

export const TextInput = styled(shared.TextInput)`
    padding: min(3vw, 10px);
`;

export const TextArea = styled(shared.TextArea)`
`;





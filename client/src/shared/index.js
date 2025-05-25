import styled from 'styled-components';
import BootstrapButton from 'react-bootstrap/Button';
import TextareaAutosize from 'react-textarea-autosize';

export const accentColor = "#008ae0";
export const borderRadius = "10px";
export const boxShadow = "3px 5px 10px -2px gray";

export const Container = styled.section`
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow: auto;
    border-radius: ${borderRadius};
    box-shadow: ${boxShadow};
    text-align: center;
    background-color: white;
    padding: 30px;
`;

export const TextInput = styled.input`
    width: 100%;
    padding: min(3vw, 15px);
    outline: none;
    border: 2px solid #f0f0f0;
    border-radius: ${borderRadius};
    -webkit-transition: 0.5s;
    &:focus {
        border: 2px solid ${accentColor};
    }
`;

export const TextArea = styled(TextareaAutosize)`
    width: 100%;
    padding: min(3vw, 15px);
    outline: none;
    border: 2px solid #f0f0f0;
    border-radius: ${borderRadius};
    -webkit-transition: 0.5s;
    &:focus {
        border: 2px solid ${accentColor};
    }
`;

const StyledBootstrapButton = styled(BootstrapButton)`
    background-color: ${accentColor};
    border-radius: 0px;
    color: white;
    border: none;
    width: 100%;
    height: 45px;
    font-size: min(3.5vw, 18px);
    margin-top: 20px;
    @media (max-width: 768px) {
        &:hover {
            background-color: ${accentColor};
        }
    }
`;

export const Button = (props) => {
    return (<StyledBootstrapButton {...props}>{props.text}</StyledBootstrapButton>)
}

export const CenterScreenContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    min-height: 100vh;
`;

export const ScreenContainer = styled.div`
`;



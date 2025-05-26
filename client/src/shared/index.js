import styled from 'styled-components';
import BootstrapButton from 'react-bootstrap/Button';
import TextareaAutosize from 'react-textarea-autosize';

export const accentColor = "#008ae0";
export const borderRadius = "10px";
export const boxShadow = "3px 5px 10px -2px gray";

export const CenterScreenContainer = styled.div`
    align-items: center;
    text-align: center;
    @media (min-width: 768px) {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
`;

export const Container = styled.section`
    width: 100%;
    max-width: 500px;
    text-align: center;
    background-color: white;
    padding: 30px;
    @media (min-width: 768px) {
        box-shadow: ${boxShadow};
        border-radius: ${borderRadius};
    }
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
    border-radius: 0px;
    color: white;
    border: none;
    width: 100%;
    height: 45px;
    font-size: min(3.5vw, 18px);
    margin-top: 20px;
`;

export const Button = (props) => {
    return (<StyledBootstrapButton {...props}>{props.text}</StyledBootstrapButton>)
}

export const ScreenContainer = styled.div`
`;



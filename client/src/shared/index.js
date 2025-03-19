import styled from 'styled-components';

export const accentColor = "#008ae0";

export const Container = styled.section`
    width: 50%;
    max-width: 400px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    box-shadow: 3px 5px 10px -2px gray;
    position: absolute;
    text-align: center;
    background-color: white;
    padding: 30px;
`;

export const TextInput = styled.input`
    width: 90%;
    padding: 15px;
    outline: none;
    border: 2px solid #f0f0f0;
    border-radius: 7px;
    -webkit-transition: 0.5s;
    &:focus {
        border: 2px solid ${accentColor};
    }
`;

export const Button = styled.input`
    background-color: ${accentColor};
    //border-radius: 7px;
    color: white;
    font-weight: bold;
    border: none;
    width: 100%;
    height: 45px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 20px;
    &:hover {
        filter: brightness(0.95);
    }
`;



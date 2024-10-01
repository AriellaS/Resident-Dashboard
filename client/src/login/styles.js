import styled from 'styled-components';
import { ExclamationTriangle } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import * as shared from '~/shared';

const errorColor = "#ff9900";
const accentColor = shared.accentColor;

export const TextInputContainer = styled.div`
    padding: 10px 0px 10px 0px;
    text-align: left;
    font-size: 16px;
`;

export const TextInputLabel = styled.div`
    color: #303030;
    padding-bottom: 5px;
`;

export const Header = styled.div`
    font-size: 20px;
    font-weight: bold;
    padding: 10px;
`;

export const StyledLink = styled(Link)`
    font-size: 13px;
    padding-top: 20px;
    color: ${accentColor};
    display: block;
`;

export const ErrorBoxContainer = styled.div`
    background-color: #fff8ed;
    border-radius: 5px;
    border: 1px solid ${errorColor};
    display: flex;
    flex-direction: row;
    width: 90%;
    padding: 8px;
    margin-bottom: 5px;
`;

export const ErrorBoxMessage = styled.div`
    color: errorColor;
    font-size: 13px;
    font-family: helvetica;
    margin-left: 5px;
`;

export const WarningGlyph = styled(ExclamationTriangle)`
    size: 20;
    color: ${errorColor};
`;

export const Container = shared.Container;
export const Button = shared.Button;
export const TextInput = shared.TextInput;

import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as shared from '~/shared';
import FancyRadio from '~/shared/FancyRadio';
import ErrorBox from '~/shared/ErrorBox';

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

export const StyledFancyRadio = styled(FancyRadio)`
    margin-top: 10px;
`;

export const StyledErrorBox = styled(ErrorBox)`
    margin-bottom: 5px;
`;

export const Container = shared.Container;
export const Button = shared.Button;
export const TextInput = shared.TextInput;

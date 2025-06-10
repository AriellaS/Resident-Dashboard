import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as shared from '~/shared';
import FancyRadio from '~/shared/FancyRadio';
import AlertBox from '~/shared/AlertBox';

const accentColor = shared.accentColor;

export const TextInputContainer = styled.div`
    padding: 10px 0px 10px 0px;
    text-align: left;
`;

export const TextInputLabel = styled.div`
    color: #303030;
    padding-bottom: 5px;
`;

export const StyledLink = styled(Link)`
    font-size: min(3.5vw, 15px);
    margin-top: 20px;
    color: ${accentColor};
    display: block;
`;

export const StyledFancyRadio = styled(FancyRadio)`
    margin-top: 10px;
    font-size: min(4vw, 16px);
`;

export const StyledAlertBox = styled(AlertBox)`
    margin-top: 15px;
`;

export const TextInput = styled(shared.TextInput)`
    width: 100%;
    font-size: 16px;
`;

export const Container = shared.Container;
export const CenterScreenContainer = shared.CenterScreenContainer;
export const Button = shared.Button;
export const Header = shared.Header;

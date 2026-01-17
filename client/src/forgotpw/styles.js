import styled from 'styled-components';
import * as shared from '~/shared';
import AlertBox from '~/shared/AlertBox';

export const StyledAlertBox = styled(AlertBox)`
    margin-top: 20px;
`;

export const TextInput = styled(shared.TextInput)`
    margin-bottom: 20px;
`;

export const SubHeader = styled(shared.SubHeader)`
    color: gray;
    font-size: min(3.5vw, 16px);
    margin: 10px;
`;

export const Container = shared.Container;
export const CenterScreenContainer = shared.CenterScreenContainer;
export const Header = shared.Header;
export const Button = shared.Button;

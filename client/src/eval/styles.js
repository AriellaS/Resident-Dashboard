import styled from 'styled-components';
import * as shared from '~/shared';
import BootstrapProgressBar from 'react-bootstrap/ProgressBar';

export const AttributesReminder = styled.div`
    font-size: min(3.5vw, 16px);
`;

export const RoleText = styled.div`
    color: ${shared.accentColor};
    font-family: 'Helvetica';
`;

export const NavButton = styled(shared.Button)`
    width: 100px;
`;

export const HorizontalContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

export const ProgressBar = styled(BootstrapProgressBar)`
    margin-top: 20px;
`;

export const Container = shared.Container;
export const CenterScreenContainer = shared.CenterScreenContainer;
export const ScreenContainer = shared.ScreenContainer;
export const Button = shared.Button;
export * from '~/shared/Form';

import * as shared from '~/shared';
import styled from 'styled-components';

export const TextContainer = styled.div`
    font-size: min(4vw, 20px);
    padding: 10px;
    * {
        margin: 10px 0;
    }
`;

export const RoleText = styled.div`
    color: ${shared.accentColor};
    font-family: 'Helvetica';
    margin-top: 15px;
`;

export const Button = styled(shared.Button)`
    margin-bottom: 10px;
`;

export const Container = shared.Container;
export const CenterScreenContainer = shared.CenterScreenContainer;
export const ScreenContainer = shared.ScreenContainer;


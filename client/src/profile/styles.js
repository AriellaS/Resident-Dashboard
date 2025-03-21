import * as shared from '~/shared';
import styled from 'styled-components';

export const Image = styled.img`
    width: 60%;
    border-radius: 10px;
`;

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

export const Button = shared.Button;
export const Container = shared.Container;
export const CenterScreenContainer = shared.CenterScreenContainer;


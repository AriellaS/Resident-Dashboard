import * as shared from '~/shared';
import styled from 'styled-components';

export const Image = styled.img`
    width: 80%;
    border-radius: 10px;
`;

export const TextContainer = styled.div`
    font-size: 20px;
    padding: 10px;
    * {
        margin: 10px 0;
    }
`;

export const Button = shared.Button;
export const Container = shared.Container;



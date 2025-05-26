import styled from 'styled-components';
import * as shared from '~/shared';

export const SearchBar = styled(shared.TextInput)`
    box-shadow: ${shared.boxShadow};
    margin-bottom: 20px;
    font-size: 16px;
`;

export const SearchContainer = styled.div`
    text-align: center;
    width: 80%;
    max-width: 500px;
    top: 40%;
    position: fixed;
    @media (max-width: 768px) {
        top: 20%;
    }
`;

export const CenterScreenContainer = shared.CenterScreenContainer;
export const ScreenContainer = shared.ScreenContainer;


import styled from 'styled-components';
import ListGroup from 'react-bootstrap/ListGroup';
import * as shared from '~/shared';

export const SearchBar = styled(shared.TextInput)`
    box-shadow: ${shared.boxShadow};
    //margin-bottom: 20px;
    font-size: 16px;
`;

export const SearchContainer = styled.div`
    text-align: center;
    width: 80%;
    max-width: 500px;
    margin-top: 20vh;
    @media (max-width: 768px) {
        top: 20%;
    }
`;

export const StyledListGroup = styled(ListGroup)`
    border-radius: 0px;
`;

export const CenterScreenContainer = shared.CenterScreenContainer;
export const ScreenContainer = shared.ScreenContainer;


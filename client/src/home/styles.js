import styled from 'styled-components';
import ListGroup from 'react-bootstrap/ListGroup';
import * as shared from '~/shared';

export const SearchBar = styled(shared.TextInput)`
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

export const StyledListGroupItem = styled(ListGroup.Item)`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

export const SearchText_Name = styled.div`
`;

export const SearchText_Pgy = styled.div`
    margin-left: 5px;
    color: gray
`;

export const CenterScreenContainer = shared.CenterScreenContainer;
export const ScreenContainer = shared.ScreenContainer;


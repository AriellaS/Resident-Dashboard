import styled from 'styled-components';
import ListGroup from 'react-bootstrap/ListGroup';
import * as shared from '~/shared';
import { Envelope } from 'react-bootstrap-icons';
import Badge from 'react-bootstrap/Badge';

export const HomeContentsContainer = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    width: 80%;
    max-width: 500px;
    margin-top: 20vh;
    @media (max-width: 768px) {
        top: 20%;
    }
    gap: 40px;
`;

export const SearchContainer = styled.div``;

export const SearchBar = styled(shared.TextInput)`
    font-size: 16px;
    font-family: var(--bs-btn-font-family);
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

export const InboxButton = styled(shared.Button)`
    background-color: white;
    border: solid ${shared.accentColor} 1px;
    color: ${shared.accentColor};
    font-size: 16px;
    padding: min(3vw, 15px);
    height: auto;
    display: flex;
    gap: 5px;
    justify-content: center;
    align-items: center;
`;

export const StyledBadge = styled(Badge)`
    border: solid ${shared.accentColor} 1px;
    color: ${shared.accentColor}
`;

export const StyledEnvelope = styled(Envelope)``;

export const CenterScreenContainer = shared.CenterScreenContainer;
export const ScreenContainer = shared.ScreenContainer;


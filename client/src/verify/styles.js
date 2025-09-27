import styled from 'styled-components';
import * as shared from '~/shared';
import AlertBox from '~/shared/AlertBox';

export const DigitInput = styled(shared.TextInput)`
    width: 50px;
`;

export const DigitInputContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
`;

export const CodeInputContainer = styled.div`
    padding-top: 20px;
    padding-bottom: 20px;
`;

export const SmallText = styled.div`
    font-size: min(2.5vw, 13px);
    text-align: left;
`;

export const SmallTextUnderlined = styled(SmallText)`
    text-decoration: underline;
    margin-right: 3px;
    cursor: pointer;
`;

export const SmallTextContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

export const StyledAlertBox = styled(AlertBox)`
    margin-top: 20px;
`;

export const Button = styled(shared.Button)`
    margin-top: 20px
`;

export const Container = shared.Container;
export const CenterScreenContainer = shared.CenterScreenContainer;
export const Header = shared.Header;
export const SubHeader = shared.SubHeader;

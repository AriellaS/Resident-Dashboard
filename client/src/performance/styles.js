import styled from 'styled-components';
import * as shared from '~/shared';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';

export const Container = styled(shared.Container)`
    max-width: 1000px;
`;

export const PageTitle = styled.div`
    font-size: min(6vw, 50px);
    cursor: pointer
`;

export const DashboardItem = styled.div`
    background-color: var(--bs-light);
    padding: 1.5vw;
    margin: 2vw;
    max-width: 80vw;
`;

export const PieChartContainer = styled.div`
    width: 500px;
    height: 200px;
    max-width: 80vw;
`;

export const HorizontalContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
`;

export const VerticalContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const DashboardItemHeading = styled.div`
    font-size: 1.5vw;
`;

export const BarChartHeading = styled.div`
    font-size: 1vw;
    margin-bottom: 10px;
`;

export const DashboardItemLargeText = styled.div`
    font-size: 9vw;
`;

export const ProgressBar = styled(CircularProgressbarWithChildren)`
    width: 12vw;
    min-width: 50px;
    margin: 10px;
`;

export const ProgressBarText = styled.div`
    font-size: 1vw;
`;

export const CenterScreenContainer = shared.CenterScreenContainer;
export const ScreenContainer = shared.ScreenContainer;
export const Header = shared.Header;
export const accentColor = shared.accentColor;

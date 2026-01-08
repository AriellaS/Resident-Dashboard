import styled, { keyframes } from 'styled-components';
import * as shared from '~/shared';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';

export const PageTitle = styled.div`
    font-size: min(6vw, 50px);
    cursor: pointer
`;

export const Container = styled(shared.Container)`
    max-width: 900px;
    overflow-x: hidden;
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

export const DashboardItem = styled.div`
    background-color: var(--bs-light);
    padding: 15px;
    margin: 15px;
    align-items: center;
`;

export const PieChartContainer = styled.div`
    width: 500px;
    height: 200px;
    max-width: 75vw;
    font-size: min(3vw, 18px);
`;

export const BarChartContainer = styled.div`
    width: 200px;
    margin: 10px;
    align-self: flex-end
`;

export const DashboardItemHeading = styled.div`
    font-size: 20px;
`;

export const BarChartHeading = styled.div`
    font-size: 12px;
    margin-bottom: 10px;
`;

export const DashboardItemLargeText = styled.div`
    font-size: min(30vw, 80px);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 85%
`;

export const ProgressBar = styled(CircularProgressbarWithChildren)`
    width: 12vw;
    min-width: 150px;
    margin: 10px;
`;

export const ProgressBarText = styled.div`
    font-size: 12px;
`;

export const WrittenFeedbackContainer = styled.div`
    margin: 20px;
`;

export const WrittenFeedbackText = styled.div`
    min-height: 100px;
    padding-left: 10vw;
    padding-right: 10vw;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const fadeInOut = keyframes`
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
`;

export const FadingText = styled.div`
  animation: ${fadeInOut} 2s ease-in-out infinite;
`;

export const CenterScreenContainer = shared.CenterScreenContainer;
export const ScreenContainer = shared.ScreenContainer;
export const Header = shared.Header;
export const accentColor = shared.accentColor;
export const Button = shared.Button;

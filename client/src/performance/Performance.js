import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, BarChart, Bar, XAxis, Cell, Legend, Tooltip, Text, ResponsiveContainer } from 'recharts';
import 'react-circular-progressbar/dist/styles.css';
import { Questions, SUBSPECIALTIES } from  '~/shared/AttendingToResidentEvalForm';
import Navbar from '~/shared/Navbar';
import ajax from '~/util';
import * as S from '~/performance/styles';

const Performance = () => {

    const params = useParams();
    const userId = params.id;

    const emptyEvalData = Questions.filter(q => q.type==='RADIO').map(({ page, name, optionTexts }) => ({
        page,
        name,
        data: optionTexts.map(o => ({ name: o, count: 0 }))
    }));

    const [numEvals, setNumEvals] = useState(0);
    const [evalData, setEvalData] = useState(emptyEvalData);

    const subspecialtyData = evalData.find(d => d.name==='SUBSPECIALTY').data;
    const barData = evalData.filter(d => ['PREP_RATING','GUIDANCE','PERFORMANCE'].includes(d.name));

    const calculateScore = (questionData) =>  {
        let scoreSum = 0;
        let countSum = 0;
        questionData.forEach((option, i) => {
            scoreSum += option.count * (i+1);
            countSum += option.count;
        });
        return countSum === 0 ? 0 : scoreSum / (countSum * questionData.length) * 100;
    }

    const CustomizedAxisTick = (props) => {
        const {x, y, payload} = props;
        return (
            <Text x={x} y={y} width={75} angle={-45} textAnchor="end" verticalAnchor="start" style={{fontSize: '0.6vw'}}>{payload.value}</Text>
        )
    };

    useEffect(() => {
        async function fetchData() {
            await ajax.request('get', `/users/id/${userId}/evals`)
                .then(res => {
                    setNumEvals(res.data.length);
                    setEvalData(evalData.map(q => ({
                        ...q,
                        data: q.data.map((o,i) => ({
                            ...o,
                            count: res.data.flatMap(d => d.form).filter(f => f.name===q.name && f.option===i+'').length
                        }))
                    })));
                })
                .catch(err => { console.log(err) });
        }
        fetchData();
    }, [userId, evalData]);

    return (
        <S.ScreenContainer>
            <Navbar />
            <S.CenterScreenContainer>
                <S.Container>
                    <S.HorizontalContainer>
                        <S.DashboardItem>
                            <S.DashboardItemHeading children="Total Evals Recieved"/>
                            <S.DashboardItemLargeText children={numEvals}/>
                        </S.DashboardItem>
                        <S.DashboardItem>
                            <S.DashboardItemHeading children="Subspecialties"/>
                            <S.PieChartContainer>
                            <ResponsiveContainer width='100%' >
                                <PieChart>
                                    <Pie
                                        data={subspecialtyData}
                                        dataKey='count'
                                        innerRadius='50%'
                                        outerRadius='80%'
                                        fill="#8884d8"
                                        isAnimationActive={true}
                                    >
                                        {subspecialtyData.map((sd, i) => (
                                            <Cell key={i} fill={SUBSPECIALTIES.find(s => s.name===sd.name)?.color || '#ccc'} />
                                        ))}
                                    </Pie>
                                    <Legend align='left' verticalAlign='bottom' layout='vertical' />
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            </S.PieChartContainer>
                        </S.DashboardItem>
                    </S.HorizontalContainer>
                    <S.DashboardItem>
                        <S.DashboardItemHeading children="Attributes"/>
                        <S.HorizontalContainer>
                            {evalData.filter(d => d.page === 'ATTRIBUTES').map((d,i) => (
                                <S.ProgressBar
                                    key={i}
                                    value={calculateScore(d.data)}
                                    strokeWidth={10}
                                    styles={{path: { stroke: S.accentColor }}}
                                >
                                    <S.ProgressBarText children={Questions.find(q => q.name===d.name).questionText} />
                                    <S.ProgressBarText children={parseInt(calculateScore(d.data))+'%'} />
                                </S.ProgressBar>
                            ))}
                        </S.HorizontalContainer>
                    </S.DashboardItem>
                    <S.DashboardItem>
                        <S.HorizontalContainer>
                            {barData.map((d,i) => {
                                return (
                                    <ResponsiveContainer aspect={1} width='25%' key={i} style={i > 0 ? { marginLeft: '50px' } : {}}>
                                        <S.BarChartHeading children={Questions.find(q => d.name===q.name).questionText}/>
                                        <BarChart
                                            barSize={15}
                                            data={d.data}
                                        >
                                            <Bar dataKey="count" fill={S.accentColor} />
                                            <XAxis interval={0} height={50} tick={<CustomizedAxisTick />} dataKey="name" />
                                            <Tooltip />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )
                            })}
                        </S.HorizontalContainer>
                    </S.DashboardItem>
                </S.Container>
            </S.CenterScreenContainer>
        </S.ScreenContainer>
    )
}

export default Performance;

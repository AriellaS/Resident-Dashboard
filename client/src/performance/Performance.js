import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PieChart, Pie, BarChart, Bar, XAxis, Cell, Legend, Tooltip, Text, ResponsiveContainer } from 'recharts';
import 'react-circular-progressbar/dist/styles.css';
import { Questions, SUBSPECIALTIES } from  '~/shared/AttendingToResidentEvalForm';
import Navbar from '~/shared/Navbar';
import ajax from '~/util';
import * as S from '~/performance/styles';

const Performance = () => {

    const params = useParams();
    const navigate = useNavigate();
    const userId = params.id;

    const emptyEvalData = Questions.filter(q => q.type==='RADIO').map(({ page, name, optionTexts }) => ({
        page,
        name,
        data: optionTexts.map(o => ({ name: o, count: 0 }))
    }));

    const [evals, setEvals] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [user, setUser] = useState({
        firstname: "",
        lastname: "",
        pgy: null,
    });

    const filteredEvals = selectedSpecialty ? evals.filter(e => e.form.find(f => f.name==='SUBSPECIALTY').option===SUBSPECIALTIES.findIndex(s => s.name===selectedSpecialty)+'') : evals;
    const evalData = emptyEvalData.map(q => ({
        ...q,
        data: q.data.map((o,i) => ({
            ...o,
            count: filteredEvals.flatMap(e => e.form)?.filter(f => f.name===q.name && f.option===i+'').length
        }))
    }));
    const specialtyData = SUBSPECIALTIES.map((s,i) => ({
            name: s.name,
            count: evals.flatMap(e => e.form)?.filter(f => f.name==='SUBSPECIALTY' && f.option===i+'').length
    }));
    const barData = evalData.filter(d => ['PREP_RATING','GUIDANCE','PERFORMANCE'].includes(d.name));
    const selectedSpecialtyColor = SUBSPECIALTIES.find(s => s.name===selectedSpecialty)?.color;

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
            <Text x={x} y={y} width={75} angle={-45} textAnchor="end" verticalAnchor="start" style={{fontSize: '8px'}}>{payload.value}</Text>
        )
    };

    useEffect(() => {
        async function fetchData() {
            await ajax.request('get', `/users/id/${userId}/evals`)
                .then(res => {
                    setEvals(res.data.evals);
                    setUser({
                        firstname: res.data.user.firstname,
                        lastname: res.data.user.lastname,
                        pgy: res.data.user.pgy
                    });
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
                    <S.PageTitle
                        onClick={() => navigate('..', { relative: "path" })}
                        children={`${user.firstname} ${user.lastname}, PGY-${user.pgy}`}
                    />
                    <S.HorizontalContainer>
                        <S.DashboardItem>
                            <S.DashboardItemHeading children="Total Evals Recieved"/>
                            <S.DashboardItemLargeText children={evals.length}/>
                        </S.DashboardItem>
                        <S.DashboardItem onClick={() => setSelectedSpecialty('')}>
                            <S.DashboardItemHeading children="Subspecialties"/>
                            <S.PieChartContainer>
                                <ResponsiveContainer width='100%' >
                                    <PieChart>
                                        <Pie
                                            data={specialtyData}
                                            dataKey='count'
                                            innerRadius='50%'
                                            outerRadius='80%'
                                            isAnimationActive={false}
                                        >
                                            {specialtyData?.map((sd, i) => (
                                                <Cell
                                                    key={i}
                                                    fill={SUBSPECIALTIES.find(s => s.name===sd.name)?.color || '#ccc'}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setSelectedSpecialty(sd.name)
                                                    }}
                                                />
                                            ))}
                                        </Pie>
                                        <Legend align='left' verticalAlign='middle' layout='vertical' />
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </S.PieChartContainer>
                        </S.DashboardItem>
                    </S.HorizontalContainer>
                    <S.DashboardItem>
                        <S.HorizontalContainer>
                            {evalData.filter(d => d.page === 'ATTRIBUTES').map((d,i) => (
                                <S.ProgressBar
                                    key={i}
                                    value={calculateScore(d.data)}
                                    strokeWidth={10}
                                    styles={{path: { stroke: selectedSpecialtyColor || S.accentColor }}}
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
                                    <S.BarChartContainer key={i}>
                                        <ResponsiveContainer aspect={1}>
                                        <S.BarChartHeading children={Questions.find(q => d.name===q.name).questionText}/>
                                        <BarChart
                                            barSize={15}
                                            data={d.data}
                                        >
                                            <Bar dataKey="count" fill={selectedSpecialtyColor || S.accentColor} />
                                            <XAxis interval={0} height={50} tick={<CustomizedAxisTick />} dataKey="name" />
                                            <Tooltip />
                                        </BarChart>
                                    </ResponsiveContainer>
                                    </S.BarChartContainer>
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

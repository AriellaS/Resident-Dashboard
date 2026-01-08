import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PieChart, Pie, BarChart, Bar, XAxis, Cell, Legend, Tooltip, Text, ResponsiveContainer } from 'recharts';
import Carousel from 'react-bootstrap/Carousel';
import 'react-circular-progressbar/dist/styles.css';
import { Questions, SUBSPECIALTIES } from  '~/shared/AttendingToResidentEvalForm';
import Navbar from '~/shared/Navbar';
import ajax from '~/util';
import * as S from '~/performance/styles';

const Performance = () => {

    const params = useParams();
    const navigate = useNavigate();
    const userId = params.id;

    const [evals, setEvals] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [user, setUser] = useState({
        firstname: "",
        lastname: "",
        pgy: null,
    });
    const [AISummary, setAISummary] = useState("");
    const [AISummaryLoading, setAISummaryLoading] = useState(false);

    const emptyNumericalData = Questions.filter(q => q.type==='RADIO').map(({ page, name, questionText, optionTexts }) => ({
        page,
        name,
        questionText,
        data: optionTexts.map(o => ({ name: o, count: 0 }))
    }));
    const emptyWrittenData = Questions.filter(q => q.type==='LONG_TEXT').map(({ page, name, questionText }) => ({
        page,
        name,
        questionText
    }));

    const filteredEvals = selectedSpecialty ? evals.filter(e => e.form.find(f => f.name==='SUBSPECIALTY').option===SUBSPECIALTIES.findIndex(s => s.name===selectedSpecialty)+'') : evals;
    const numericalData = emptyNumericalData.map(q => ({
        ...q,
        data: q.data.map((o,i) => ({
            ...o,
            count: filteredEvals.flatMap(e => e.form)?.filter(f => f.name===q.name && f.option===i+'').length
        }))
    }));
    const writtenData = emptyWrittenData.map(q => ({
        ...q,
        data: filteredEvals.flatMap(e => e.form)?.filter(f => f.name===q.name).flatMap(f => f.option)
    }));
    const specialtyData = SUBSPECIALTIES.map((s,i) => ({
            name: s.name,
            count: evals.flatMap(e => e.form)?.filter(f => f.name==='SUBSPECIALTY' && f.option===i+'').length
    }));
    const barData = numericalData.filter(d => ['PREP_RATING','GUIDANCE','PERFORMANCE'].includes(d.name));
    const selectedSpecialtyColor = SUBSPECIALTIES.find(s => s.name===selectedSpecialty)?.color;

    const condensedQuestionSchemaForLLM = Questions.map(({ name, questionText, optionTexts }) => ({
            name,
            questionText,
            ...(optionTexts && { optionTexts })
        }));

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

    const generateAIReport = async () => {
        setAISummaryLoading(true);
        await ajax.request('post', `/users/id/${userId}/evals/aisummary`, { questionSchema: condensedQuestionSchemaForLLM }).then(res => {
            setAISummary(res.data.aiSummary);
            setAISummaryLoading(false);
        }).catch(err => {
            console.log(err)
            setAISummary("Error generating AI report!");
            setAISummaryLoading(false);
        });
    }

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
    }, [userId]);

    return (
        <S.ScreenContainer>
            <Navbar />
            <S.CenterScreenContainer>
                <S.Container>
                    <S.PageTitle
                        onClick={() => navigate('..', { relative: "path" })}
                        children={`${user.firstname} ${user.lastname}, PGY-${user.pgy}`}
                    />
                    <S.DashboardItem>
                        {AISummaryLoading ?
                            <S.FadingText>{"Generating summary..."}</S.FadingText> :
                            !AISummary && <S.Button text="Generate AI summary" onClick={generateAIReport} />
                        }
                        {AISummary}
                    </S.DashboardItem>
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
                            {numericalData.filter(d => d.page === 'ATTRIBUTES').map((d,i) => (
                                <S.ProgressBar
                                    key={i}
                                    value={calculateScore(d.data)}
                                    strokeWidth={10}
                                    styles={{path: { stroke: selectedSpecialtyColor || S.accentColor }}}
                                >
                                    <S.ProgressBarText children={d.questionText} />
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
                                        <S.BarChartHeading children={d.questionText}/>
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
                    <S.DashboardItem>
                        <S.WrittenFeedbackContainer>
                            <S.DashboardItemHeading children="Areas of Strength"/>
                            <Carousel interval={null} indicators={false} variant='dark' >
                                {writtenData.find(d => d.name==='POSITIVE').data?.filter(t => t!=='').map((text,i) => {
                                    return (
                                        <Carousel.Item key={i}>
                                            <S.WrittenFeedbackText>{text}</S.WrittenFeedbackText>
                                        </Carousel.Item>
                                    )
                                })}
                            </Carousel>
                        </S.WrittenFeedbackContainer>
                        <S.WrittenFeedbackContainer>
                            <S.DashboardItemHeading children="Areas for Improvement"/>
                            <Carousel interval={null} indicators={false} variant='dark'>
                                {writtenData.find(d => d.name==='NEGATIVE').data?.filter(t => t!=='').map((text,i) => {
                                    return (
                                        <Carousel.Item key={i}>
                                            <S.WrittenFeedbackText>{text}</S.WrittenFeedbackText>
                                        </Carousel.Item>
                                    )
                                })}
                            </Carousel>
                        </S.WrittenFeedbackContainer>
                    </S.DashboardItem>
                </S.Container>
            </S.CenterScreenContainer>
        </S.ScreenContainer>
    )
}

export default Performance;

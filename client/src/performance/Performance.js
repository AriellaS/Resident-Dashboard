import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Questions } from  '~/shared/AttendingToResidentEvalForm';
import ajax from '~/util';
import * as S from '~/performance/styles';

const Performance = () => {

    const params = useParams();
    const userId = params.id;

    const [barData, setBarData] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState('');

    useEffect(() => {
        async function fetchData() {
            await ajax.request('get', `/users/id/${userId}/evals`)
                .then(res => {
                    setBarData(compileBarData(res.data));
                })
                .catch(err => { console.log(err) });
        }
        fetchData();
    });

    type Datum = {
        name: string,
        count: number
    }

    type Series = {
        label: string,
        data: Datum[]
    }

    const compileBarData = (evalData) => {
        let series: Series[] = [];
        Questions.forEach(q => {
            let answers = [];
            evalData.forEach(e => {
                if (!selectedSpecialty || e.form.find(el => { return el.name==='SUBSPECIALTY' }).option===selectedSpecialty) {
                    answers.push(e.form.find(el => { return el.name===q.name }).option);
                }
            });
            let data: Datum[] = [];
            if (q.type==='RADIO') {
                q.optionTexts.forEach((o,i) => {
                    data.push({
                        name: o,
                        count: answers.filter(a => { return a===i+'' }).length,
                    });
                });
            }
            series.push({
                label: q.name,
                data
            });
        });
        return series;
    }

    return (
        <S.CenterScreenContainer>
            {barData.map((s,i) => {
                if (Questions[i].type==='RADIO') {
                    return (
                        <ResponsiveContainer key={i} aspect={1} width='100%'>
                            <BarChart data={s.data} barSize={70} margin={{ right: 10, bottom: 120 }}>
                                <CartesianGrid strokeDasharray="1 1" />
                                <XAxis dataKey="name" angle={-45} textAnchor='end'/>
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                {Questions[i].name==='SUBSPECIALTY' ? (
                                    <Bar
                                        onClick={(d,i) => setSelectedSpecialty(i+'')}
                                        dataKey="count"
                                        fill="#8884d8"
                                    />
                                ) : (
                                    <Bar
                                        dataKey="count"
                                        fill="#8884d8"
                                    />
                                )}
                            </BarChart>
                        </ResponsiveContainer>
                    )
                } else {
                    return <div key={i}></div>
                }
            })}
        </S.CenterScreenContainer>
    )
}

export default Performance;

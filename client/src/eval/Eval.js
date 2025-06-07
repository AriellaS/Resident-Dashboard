import React, { useState, useEffect } from 'react';
import EvalForm from '~/eval/EvalForm';
import { useParams } from 'react-router-dom';
import * as S from '~/eval/styles';
import ajax from '~/util';
import Navbar from '~/shared/Navbar';

const Eval = () => {

    const params = useParams();
    const userId = params.id;

    const [userData, setUserData] = useState({
        firstname: "",
        lastname: "",
        id: userId,
    });

    useEffect(() => {
        async function fetchData() {
            await ajax.request('get',`/users/id/${userId}`)
                .then(res => {
                    setUserData({
                        firstname: res.data.firstname,
                        lastname: res.data.lastname,
                        id: userId
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        }
        fetchData();
    }, [userId]);

    return (
        <S.ScreenContainer>
            <Navbar />
            <S.CenterScreenContainer>
                <S.Container>
                    <S.Header children={`Evaluation for ${userData.firstname} ${userData.lastname}`} />
                    <EvalForm userData={userData} />
                </S.Container>
            </S.CenterScreenContainer>
        </S.ScreenContainer>
    )
}

export default Eval;

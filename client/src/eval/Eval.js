import React, {useState, useEffect} from 'react';
import EvalForm from '~/eval/EvalForm';
import { useParams } from 'react-router-dom';
import * as S from '~/eval/styles';
import ajax from '~/util';

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
            await ajax.request('get',`/users/id/${userData.id}`)
                .then(res => {
                    setUserData({
                        ...userData,
                        firstname: res.data.firstname,
                        lastname: res.data.lastname,
                    })
                })
                .catch(err => {
                    console.log(err);
                    // TODO have error state for user not found
                });
        }
        fetchData();
    }, [userData]);

    return (
        <S.CenterScreenContainer>
            <S.Container>
                <S.Header children={`Evaluation for ${userData.firstname} ${userData.lastname}`} />
                <EvalForm userData={userData} />
            </S.Container>
        </S.CenterScreenContainer>
    )
}

export default Eval;

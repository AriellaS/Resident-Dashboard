import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as S from '~/profile/styles';
import ajax from '~/util';

const profpicpath = "/default_profpic.jpg";

const Profile = () => {

    const navigate = useNavigate();
    const params = useParams();
    const userId = params.id;

    const [userData, setUserData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        role: "",
    });

    useEffect(() => {
        async function fetchData() {
            await ajax.request('get',`/users/id/${userId}`)
                .then(res => {
                    setUserData({
                        firstname: res.data.firstname,
                        lastname: res.data.lastname,
                        email: res.data.email,
                        role: res.data.role
                    })
                })
                .catch(err => {
                    console.log(err);
                    // have error state for user not found
                });
        }
        fetchData();
    }, [userId]);

    const getName = () => {
        return `${userData.firstname} ${userData.lastname}`
    }

    const handleEvaluate = () => {
        navigate('eval');
    }

    return (
        <S.Container>
            <S.Image src={profpicpath} alt='profile' />
            <S.TextContainer>
                <div>{getName()}</div>
                <div>{userData.email}</div>
                <div>{userData.role}</div>
            </S.TextContainer>
            <hr />
            <S.Button
                value="Evaluate"
                type="button"
                onClick={handleEvaluate}
            />
            <S.Button
                value="See Performance"
                type="button"
            />
        </S.Container>
    )

};

export default Profile;

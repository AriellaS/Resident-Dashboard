import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import * as S from '~/profile/styles';
import ajax from '~/util';
import Navbar from '~/shared/Navbar';

const Profile = ({ currentUser }) => {

    const navigate = useNavigate();
    const params = useParams();
    const userId = params.id;

    const [user, setUser] = useState({
        firstname: "",
        lastname: "",
        email: "",
        role: "",
        pgy: null,
        emailVerified: false,
    });

    const [errorState, setErrorState] = useState(false);

    useEffect(() => {
        async function fetchData() {
            await ajax.request('get',`/users/id/${userId}`)
                .then(res => {
                    setUser({
                        firstname: res.data.firstname,
                        lastname: res.data.lastname,
                        email: res.data.email,
                        role: res.data.role,
                        pgy: res.data.pgy,
                        emailVerified: res.data.email_verified
                    })
                    setErrorState(false);
                }).catch(err => {
                    console.log(err);
                    setErrorState(true);
                });
        }
        fetchData();
    }, [userId]);

    const getName = () => {
        return `${user.firstname} ${user.lastname}`
    }

    const handleEvaluate = () => {
        navigate('eval');
    }

    const handleSeePerformance = () => {
        navigate('performance');
    }

    return (
        <S.ScreenContainer>
            <Navbar />
            <S.CenterScreenContainer>
                <S.Container>
                    {errorState || !user.emailVerified ? <div>User not found.</div> :
                    <div>
                        <QRCode value={`${window.location.origin}/users/${userId}`} />
                        <S.TextContainer>
                            <div>{getName()}</div>
                            <div>{user.email}</div>
                            <S.RoleText children={`${user.role}${user.pgy ? `, PGY-${user.pgy}` : ''}`} />
                        </S.TextContainer>
                        <hr />
                        {currentUser.role==='ATTENDING' && user.role==='RESIDENT' && (
                            <S.Button
                                text='Evaluate'
                                type='button'
                                onClick={handleEvaluate}
                            />
                        )}
                        {(currentUser.role==='ATTENDING' || currentUser._id===userId) && user.role==='RESIDENT' && (
                            <S.Button
                                text='See Performance'
                                type='button'
                                onClick={handleSeePerformance}
                            />
                        )}
                    </div>
                    }
                </S.Container>
            </S.CenterScreenContainer>
        </S.ScreenContainer>
    )

};

export default Profile;

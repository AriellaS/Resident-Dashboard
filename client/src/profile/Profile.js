import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import * as S from '~/profile/styles';
import ajax from '~/util';
import Navbar from '~/shared/Navbar';

const Profile = ({ currentUser }) => {

    const navigate = useNavigate();
    const params = useParams();
    const [searchParams] = useSearchParams();
    const userId = params.id;

    const [user, setUser] = useState({
        firstname: "",
        lastname: "",
        email: "",
        role: "",
        pgy: null,
        accountVerified: false,
    });

    const [errorState, setErrorState] = useState(false);
    const evalRequestId = searchParams.get('evalRequestId');

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
                        accountVerified: res.data.account_verified,
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
        navigate({
            pathname: 'eval',
            search: `${!evalRequestId ? '' : `?evalRequestId=${evalRequestId}`}`
        });
    }

    const handleSeePerformance = () => {
        navigate({
            pathname: 'performance',
            search: `${!evalRequestId ? '' : `?evalRequestId=${evalRequestId}`}`
        });
    }

    const handleRequestEval = () => {
        navigate('evalrequest');
    }

    return (
        <S.ScreenContainer>
            <Navbar />
            <S.CenterScreenContainer>
                <S.Container>
                    {errorState || !user.accountVerified ? <div>User not found.</div> :
                    <div>
                        <QRCode value={`${window.location.origin}/users/${userId}`} />
                        <S.TextContainer>
                            <div>{getName()}</div>
                            <div>{user.email}</div>
                            <S.RoleText children={`${user.role}${user.role==='RESIDENT' ? `, PGY-${user.pgy}` : ''}`} />
                        </S.TextContainer>
                        <hr />
                        {currentUser.role==='FACULTY' && user.role==='RESIDENT' && (
                            <S.Button
                                text='Evaluate'
                                type='button'
                                onClick={handleEvaluate}
                            />
                        )}
                        {(currentUser.role==='FACULTY' || currentUser._id===userId) && (user.role==='RESIDENT' || user.role==='ALUM') && (
                            <S.Button
                                text='See Performance'
                                type='button'
                                onClick={handleSeePerformance}
                            />
                        )}
                        {currentUser.role==='RESIDENT' && user.role==='FACULTY' && (
                            <S.Button
                                text='Request Evaluation'
                                type='button'
                                onClick={handleRequestEval}
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

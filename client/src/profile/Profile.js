import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as S from '~/profile/styles';
import ajax from '~/util';
import Navbar from '~/shared/Navbar';

const profpicpath = "/default_profpic.jpg";

const Profile = ({ currentUser }) => {

    const navigate = useNavigate();
    const params = useParams();
    const userId = params.id;

    const [user, setUser] = useState({
        firstname: "",
        lastname: "",
        email: "",
        role: "",
    });

    useEffect(() => {
        async function fetchData() {
            await ajax.request('get',`/users/id/${userId}`)
                .then(res => {
                    setUser({
                        firstname: res.data.firstname,
                        lastname: res.data.lastname,
                        email: res.data.email,
                        role: res.data.role
                    })
                }).catch(err => {
                    console.log(err);
                    // have error state for user not found
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

    return (
        <S.ScreenContainer>
            <Navbar />
            <S.CenterScreenContainer>
                <S.Container>
                    <S.Image src={profpicpath} alt='profile' />
                    <S.TextContainer>
                        <div>{getName()}</div>
                        <div>{user.email}</div>
                        <S.RoleText children={user.role} />
                    </S.TextContainer>
                    <hr />
                    <S.Button
                        text="Evaluate"
                        type="button"
                        onClick={handleEvaluate}
                        disabled={user.role==="ATTENDING"}
                    />
                    <S.Button
                        text="See Performance"
                        type="button"
                        disabled={user.role==="ATTENDING" || currentUser.role==="RESIDENT"}
                    />
                </S.Container>
            </S.CenterScreenContainer>
        </S.ScreenContainer>
    )

};

export default Profile;

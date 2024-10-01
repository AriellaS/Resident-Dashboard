import React, {useState, useEffect} from 'react';
import styles from '~/eval/styles';
import Question from '~/eval/Question';
import ajax from '~/util';
import { useParams } from 'react-router-dom';

const Eval = () => {

    const params = useParams();
    const userId = params.id;

    const [userData, setUserData] = useState({
        firstname: "",
        lastname: "",
        email: "",
    });

    useEffect(() => {
        async function fetchData() {
            await ajax.request('get',`/users/id/${userId}`)
                .then(res => {
                    setUserData({
                        firstname: res.data.firstname,
                        lastname: res.data.lastname,
                    })
                })
                .catch(err => {
                    console.log(err);
                    // have error state for user not found
                });
        }
        fetchData();
    }, [userId]);


    return (
        <div style={styles.container}>
            <div style={styles.header} children={`Evaluation for ${userData.firstname} ${userData.lastname}`} />
            <hr />
            <Question
                type="radio"
                text="How was the pre-operative briefing performed with the resident?"
                options={["Text/Phone Call", "Discussion day of surgery", "No briefing"]}
                name="q1"
            />
            <Question
                type="radio"
                text="How would you rate the resident's preparation for the surgery?"
                options={["1","2","3","4","5"]}
                name="q2"
            />

        </div>
    )
}

export default Eval;

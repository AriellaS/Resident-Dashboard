import React from 'react';
import styles from '~/eval/styles';

const Question = (props) => {

    if  (props.type === 'radio') {
        return (
            <div style={styles.question}>
                <div>{props.text}</div>
                {props.options.map((option, i) => {
                    return (
                        <label style={styles.option.label}>
                            <input type="radio" id={i} name={props.name} value={option} style={styles.option.radio}/>
                            {option}
                        </label>
                    )
                })}
            </div>
        )
    }
}

export default Question;

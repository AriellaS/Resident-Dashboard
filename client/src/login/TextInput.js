import React from "react";
import styles from "~/login/styles";

const TextInput = (props) => {
    return (
        <div style={styles.inputContainer}>
            <div style={styles.text}>{props.text}</div>
            <input
                value={props.value}
                placeholder={props.placeholder}
                onChange={props.onChange}
                type={props.type}
                style={styles.input}
            />
        </div>
    )
}
export default TextInput;

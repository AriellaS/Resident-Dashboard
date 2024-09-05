import React from 'react'
import { ExclamationTriangle } from 'react-bootstrap-icons';

import styles from '~/login/styles';

const ErrorBox = (props) => {

    if (props.isError) {
        return (
            <div style={styles.errorBox.container}>
                <ExclamationTriangle style={styles.errorBox.glyph}/>
                <div style={styles.errorBox.message}>{props.errorMsg}</div>
            </div>
        )
    }
}

export default ErrorBox;

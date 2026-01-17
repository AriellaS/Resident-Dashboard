import { useRef } from 'react';
import styled from 'styled-components';
import * as shared from '~/shared';

const DigitInput = styled(shared.TextInput)`
    width: 50px;
`;

const DigitInputContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
`;

const CodeInputContainer = styled.div`
    padding-top: 20px;
    padding-bottom: 20px;
`;

const Button = styled(shared.Button)`
    margin-top: 20px
`;

const NUM_DIGITS = 6;

const CodeInput = ({ inputs, setInputs, handleVerify }) => {

    const inputRefs = useRef([]);

    const handleKeyDown = (i, e) => {
        const key = e.key;
        if (key === "Backspace" || key === "Delete") {
            if (i > 0 && !inputs[i]) {
                inputRefs.current[i-1].focus();
            }
        }
    }

    return (
        <CodeInputContainer>
            <form onSubmit={handleVerify}>
                <DigitInputContainer>
                    {[...Array(NUM_DIGITS)].map((_,i) => (
                        <DigitInput
                            key={i}
                            inputMode="decimal"
                            pattern="[0-9]"
                            ref={ref => inputRefs.current[i] = ref}
                            value={inputs[i]}
                            autoFocus={i===0}
                            maxLength={1}
                            onKeyDown={e => handleKeyDown(i, e)}
                            onChange={(e) => {
                                const value = e.target.value;
                                setInputs(inputs.map((input,index) => index===i ? value : input))
                                if (value && i < NUM_DIGITS - 1) {
                                    inputRefs.current[i+1].focus();
                                }
                            }}
                        />
                    ))}
                </DigitInputContainer>
                <Button text="Verify" onClick={handleVerify} />
            </form>
        </CodeInputContainer>
    )
}

export default CodeInput;

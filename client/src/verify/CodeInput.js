import { useRef } from 'react';
import * as S from '~/verify/styles';

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
        <S.CodeInputContainer>
            <form onSubmit={handleVerify}>
                <S.DigitInputContainer>
                    {[...Array(NUM_DIGITS)].map((_,i) => (
                        <S.DigitInput
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
                </S.DigitInputContainer>
                <S.Button text="Verify" onClick={handleVerify} />
            </form>
        </S.CodeInputContainer>
    )
}

export default CodeInput;

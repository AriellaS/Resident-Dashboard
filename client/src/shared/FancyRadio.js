import styled from 'styled-components';
import { accentColor } from '~/shared';

const Container = styled.div`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    width: 100%;
`;

const OptionContainer = styled.div`
    flex: 1;
`;

const StyledInput = styled.input`
    display: none;
    &:checked + label {
        background-color: ${accentColor};
        color: white;
    }
`;

const StyledLabel = styled.label`
    border: solid 1px ${accentColor};
    width: 100%;
    display: inline-block;
    padding: .75rem 0;
    transition:   border-color .15s ease-out,
          color .25s ease-out,
          background-color .15s ease-out,
          box-shadow .15s ease-out;
    &:hover {
        cursor: pointer;
    }
`;

const FancyRadio = (props) => {
    return (
        <Container className={props.className}>
            {props.values.map((option, i) => {
                return (
                    <OptionContainer key={i}>
                        <StyledInput
                            type='radio'
                            name={props.name}
                            value={props.values[i]}
                            id={props.values[i]}
                            defaultChecked={props.default===i}
                            onChange={props.onChange}
                        />
                        <StyledLabel htmlFor={props.values[i]}>{props.texts[i]}</StyledLabel>
                    </OptionContainer>
                )
            })}
        </Container>
    )
};

export default FancyRadio;

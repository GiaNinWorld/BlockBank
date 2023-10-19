import React from "react";
import { Container, TextInput, MaskTextInput } from './Styles';
import Text from '../Text';

const Input = ({ width, icon, placeholder, mask, value, type, options, onChangeText }) => {
    return (
        <Container width={width}>
            {icon && icon}

            {mask
            ? <MaskTextInput value={value} type={type} options={options} onChangeText={(text) => onChangeText(text)} placeholder={placeholder} color="#DBDBDB" />
            : <Text black color="#DBDBDB"> {value} </Text>
            }
            
        </Container>
    )
}

export default Input
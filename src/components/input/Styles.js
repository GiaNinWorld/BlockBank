import styled from "styled-components";
import { TextInputMask } from 'react-native-masked-text';

export const Container = styled.View`
    width: ${({width}) => width ? width : '100%'};
    height: 60px;
    padding: 8px;
    margin-top: 10%;
    background-color: #3d3d3d;
    border-radius: 6px;
    flex-direction: row;
    align-items: center;
`
export const TextInput = styled.TextInput`
    width: 100%;
    margin-left: 4px;
    font-weight: bold;
`

export const MaskTextInput = styled(TextInputMask)`
    width: 100%;
    margin-left: 4px;
    font-weight: bold;
`
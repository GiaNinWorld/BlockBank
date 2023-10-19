import styled from "styled-components";
import { Dimensions } from "react-native";

const { height } = Dimensions.get('screen')

export const ScrollView = styled.ScrollView`
    width: 100%;
    height: 100%;
`

export const Container = styled.View`
    width: 100%;
    height: ${height}px;
    flex: 1;
    justify-content: space-between;
    align-items: center;
    background-color: #1e1e1e;
`
export const Content = styled.View`
    width: 95%;
    padding: 30px;
    border-radius: 12px;
    background-color: #292929;
    align-items: center;
`
export const View = styled.View`
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
`

export const Button = styled.TouchableOpacity`
    width: 90%;
    height: 55px;
    margin-top: 5%;
    margin-bottom: 10%;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    margin-top: 25px;
    margin-bottom: 30%
`
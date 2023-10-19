import React from "react";
import styled from "styled-components";

export const Container = styled.View`
    width: 100%;
    align-items: center;
    margin-bottom: 5%;
`
export const Content = styled.View`
    width: 100%;
    height: 180px;
    background-color: #FF6962;
    border-radius: 20px;
`

export const Strip = styled.View`
    width: 100%;
    height: 30px;
    margin-top: 25px;
    background-color: #BDBDBD;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
`
export const Text = styled.Text`
    width: auto;
    max-height: 22px;
    margin-top: 8px;
    color: #DBDBDB;
    font-size: ${({ fontSize }) => fontSize ? fontSize : '14px'};
    font-weight: ${({ bold }) => bold ? 'bold' : 'normal'};
`

export const TextDate = styled.Text`
    width: auto;
    margin-top: 8px;
    margin-left: 1%;
    color: #DBDBDB;
    font-size: 12px;
`

export const TextCVV = styled.Text`
    margin-right: 40px;

`
export const View = styled.View`
    width: 80%;
    margin-top: 55px;
`

export const ViewInformation = styled.View`
    width: 100%;
    padding: 14px;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
`

export const ImageItem = styled.Image`
  width: 30%;
  height: 30%;
  margin-bottom: 10px;
  margin-left: -20px;
`;

export const ImageItemOne = styled.Image`
  width: 80px;
  height: 80px;
  margin-bottom: -10px;
  margin-left: -12px;
`;

export const ImageItemTwo = styled.Image`
  width: 60px;
  height: 60px;
`;
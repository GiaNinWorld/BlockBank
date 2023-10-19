import React from "react";
import { Container, Content, Strip, TextCVV, View, TextDate, ViewInformation, ImageItem, ImageItemOne, ImageItemTwo, Text} from './Styles';

const Card = ({ data, back, icon }) => {
    return (
        <Container>
            <Content>
                {back
                    ? <Strip>
                        <TextCVV> {data.cvv} </TextCVV>
                      </Strip>
                    :
                    <ViewInformation>
                        <View>
                            <Text bold fontSize='18px' > {data.number} </Text>
                            <Text fontSize='16px' > {data.name} </Text>
                            <TextDate> {data.validate} </TextDate>
                        </View>
                        {icon === '63' && (
                            <ImageItem source={require("../../../assets/elo.png")} />
                        )}
                        {icon === '65' && (
                            <ImageItem source={require("../../../assets/elo.png")} />
                        )}
                        {icon === '55' && (
                            <ImageItemTwo source={require("../../../assets/masterCard.png")} />
                        )}
                        {icon === '41' && (
                            <ImageItemOne source={require("../../../assets/visa.png")} />
                        )}
                        {icon === '42' && (
                            <ImageItemOne source={require("../../../assets/visa.png")} />
                        )}
                        {icon === '49' && (
                            <ImageItemOne source={require("../../../assets/visa.png")} />
                        )}
                    </ViewInformation>
                }

            </Content>
        </Container>
    )
}

export default Card
import React from "react";
import styled from 'styled-components';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';

import Text from '../components/Text';

export default MyCardsScreen = () => {
    const navigation = useNavigation();

    const myCards = [
        {
            id: "1",
            color: "#ff6c55",
            number: "1234",
            exp: "10/2023",
            logo: require("../../assets/visa.png"),
        },
        {
            id: "2",
            color: "#974FF2",
            number: "3456",
            exp: "12/2023",
            logo: require("../../assets/elo.png"),
        },
        {
            id: "3",
            color: "#974FF2",
            number: "3456",
            exp: "12/2023",
            logo: require("../../assets/masterCard.png"),
        },
    ]

    const renderCard = ({ item }) => (
        <CardContainer>
            <CardInfo>
                <CardLogoContainer bgColor={item.color}>
                    { item.id == '2' || item.id == '1'
                        ? <CardLogo2 source={item.logo} resizeMode="contain" /> : <CardLogo source={item.logo} resizeMode="contain" />
                    }
                    
                </CardLogoContainer>
                <CardDetails>
                    <Text heavy>
                        &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;
                        <Text medium heavy>
                            {item.number}
                        </Text>
                    </Text>
                    <Text small heavy color="#727479" margin="4%">
                        {item.exp}
                    </Text>
                </CardDetails>
            </CardInfo>
            <CardActions>
                <Remove>
                    <Text heavy color="#727479">Remove</Text>
                </Remove>
                <Update onPress={() => navigation.navigate('Card')}>
                    <Text heavy>Update</Text>
                </Update>
            </CardActions>
        </CardContainer>
    )

    return (
        <Container>
            <Text center heavy title color="#FF6962" margin="16%">BlockCards</Text>

            <Cards data={myCards} renderItem={renderCard} />

            <StatusBar style='light' />
        </Container>
    );
};

const Container = styled.SafeAreaView`
    flex: 1;
    background-color: #1e1e1e;
`;

const Cards = styled.FlatList`
    padding:  0 8px;
    margin-top: 32px;
`;

const CardContainer = styled.View`
    background-color: #292929;
    margin-bottom: 16px;
    padding: 16px;
    border-radius: 8px;
`;

const CardInfo = styled.View`
    flex-direction: row;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-color: #393939;
    padding-bottom: 12px;
    margin-bottom: 12px;
`;

const CardLogoContainer = styled.View`
    width: 64px;
    height: 64px;
    background-color: ${(props) => props.bgColor};
    align-items: center;
    justify-content: center;
    border-radius: 32px;
`;

const CardLogo2 = styled.Image`
    width: 60px;
    height: 60px;
`;

const CardLogo = styled.Image`
    width: 40px;
    height: 40px;
`;

const CardDetails = styled.View`
    flex: 1;
    align-items: flex-end;
`;

const CardActions = styled.View`
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
`;
const Remove = styled.TouchableOpacity`
    margin-right: 32px;
`;

const Update = styled.TouchableOpacity`
    background-color: #3d3d3d;
    padding: 8px 16px;
    border-radius: 6px;
`;
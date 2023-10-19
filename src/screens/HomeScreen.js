import React, { useContext, useEffect, useState } from "react";
import { Dimensions, TouchableOpacity, LogBox } from "react-native";
import styled from "styled-components";
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { LineChart } from "react-native-chart-kit";
import { useNavigation } from '@react-navigation/native';

import { FirebaseContext } from "../../FirebaseContext";
import { UserContext } from './../../UseContext';

import Text from '../components/Text';
import transactions from './transactionsData';

export default HomeScreen = () => {
    LogBox.ignoreAllLogs();
    const [user, setUser] = useContext(UserContext);
    const firebase = useContext(FirebaseContext);
    const navigation = useNavigation();
    const [maxValue, setMaxValue] = useState(null);
    const [minValue, setMinValue] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            const uid = firebase.getCurrentUser().uid;
            const userInfo = await firebase.getUserInfo(uid);
            
            try {
                if (userInfo.saldo != user.saldo) {
                    setUser({ ...user, saldo: userInfo.saldo });
                }
                else {
                    
                }
            }
            catch {
                
            }
        };
        
        const intervalId = setInterval(() => {
            fetchUserInfo();
        }, 1000); // Executar a cada 1 segundos
        
        // Limpar o intervalo quando o componente for desmontado
        return () => {
            clearInterval(intervalId);
        };

    }, []);

    useEffect(() => {
        fetch('http://192.168.100.84:5000/dolar')
            .then((response) => response.text()) 
            .then((text) => {
                const values = text.split(';'); 
                setMaxValue(parseFloat(values[0])); 
                setMinValue(parseFloat(values[1])); 
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);
    
    const renderPurchase = ({ item }) => (
        <Purchase key={item.id}>
            <PurchaseInfo>
                <Text>{item.product}</Text>
                <Text>{item.receiver}</Text>
                <Text small color="#727479">{item.means} - {item.purchaseDate}</Text>
            </PurchaseInfo>
            <Text heavy>{item.price}</Text>
        </Purchase>
    );    

    let imageUrl;
    switch (user.profilePhotoUrl) {
        case 19:
            imageUrl = require("../../assets/profile.png");
            break;
        case 20:
            imageUrl = require("../../assets/profileOne.png");
            break;
        case 21:
            imageUrl = require("../../assets/profileTwo.png");
            break;
        default:
            imageUrl = ""; // URL padrão ou vazia caso o índice não corresponda a uma imagem específica
    }

    return (
        <Container>
            <Header>
                <ProfilePhoto source={imageUrl} />
                <Welcome>
                    <Text heavy medium>
                        Bem-Vindo,
                    </Text>
                    <Text>{user.username}</Text>
                </Welcome>
                
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <FontAwesome5 name="cog" size={24} color="#565656" />
                </TouchableOpacity>
            </Header>

            <Text center title black>
                R$ {user.saldo}
            </Text>
            <Text center heavy color="#727479">
                Saldo Atual
            </Text>

            <Chart>
                <LineChart 
                    data={{
                        labels: ["28/09", "29/09", "03/10", "04/10", "Min", "Max"],
                        datasets: [ 
                            {
                                data: [
                                    5.03,
                                    5.03,
                                    5.06,
                                    5.16,
                                    minValue,
                                    maxValue
                                ],
                                color: (opacity = 1) => `rgba(255, 105, 98, ${opacity})`, // Define uma cor diferente para esta linha
                            },
                            {
                                data: [
                                    5.03,
                                    5.03,
                                    5.06,
                                    5.16
                                ],
                                color: (opacity = 1) => `rgba(81, 150, 244, ${opacity})`, // Define a cor para esta linha
                            },
                        ],
                    }}
                    width={Dimensions.get("window").width}
                    height={250}
                    yAxisLabel="R$ "
                    chartConfig={{
                        backgroundGradientFrom: "#1e1e1e",
                        backgroundGradientTo: "#1e1e1e",
                        color: (opacity = 1) => `rgba(81, 150, 244, ${opacity})`,
                        labelColor: () => `rgba(255, 255, 255, 0.2)`,
                        strokeWidth: 3,
                    }}
                    withVerticalLines={false}
                    withHorizontalLines={false}
                    bezier
                />
            </Chart>
            <Adjust>
                <Text center heavy color="#727479">Cotação em tempo real dólar</Text>
            </Adjust>
            <Purchases ListHeaderComponent={
                <>
                    <TransactionsHeader>
                        <Text>Últimas Transações</Text>
                        <MaterialIcons name="sort" size={24} color="#5196f4" />
                    </TransactionsHeader>

                    <SearchContainer>

                    </SearchContainer>
                </>
            }
                data={transactions} renderItem={renderPurchase} showsVerticalScrollIndicator={false}
            />


            <StatusBar style='light' />
        </Container>
    );
};

const Container = styled.SafeAreaView`
    flex: 1;
    background-color: #1e1e1e;
`;

const Header = styled.View`
    flex-direction: row;
    align-items: center;
    margin: 64px 16px 32px 22px;
`;

const ProfilePhoto = styled.Image`
    width: 50px;
    height: 50px;
    border-radius: 20px;
`;

const Welcome = styled.View`
    flex: 1;
    padding: 0 16px;
`;

const Chart = styled.View`
    margin: 32px 0;
`;

const Purchases = styled.FlatList`
    background-color: #2c2c2c;
    padding: 16px;
`;

const Adjust = styled.View`
    margin-bottom: 5%;
`

const TransactionsHeader = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

const SearchContainer = styled.View`
    background-color: #3d3d3d;
    flex-direction: row;
    align-items: center;
    padding: 0 8px;
    border-radius: 6px;
    margin: 16px 0;
`;

const Purchase = styled.View`
    flex-direction: row;
    justify-content: space-between;
    border-bottom-width: 1px;
    border-bottom-color: #393939;
    padding-bottom: 12px;
    margin-bottom: 12px;
`;

const PurchaseInfo = styled.View`
    
`;
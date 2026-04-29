import React, { useContext, useEffect, useState, useCallback } from "react";
import { Dimensions, TouchableOpacity, LogBox } from "react-native";
import styled from "styled-components/native";
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { LineChart } from "react-native-chart-kit";
import { useNavigation } from '@react-navigation/native';

import { FirebaseContext } from "../../FirebaseContext";
import { UserContext } from './../../UseContext';

import Text from '../components/Text';
import { getProfilePhotoSource } from "../utils/profilePhotos";

export default function HomeScreen() {
    LogBox.ignoreAllLogs();
    const [user, setUser] = useContext(UserContext);
    const firebase = useContext(FirebaseContext);
    const navigation = useNavigation();
    const [maxValue, setMaxValue] = useState(null);
    const [minValue, setMinValue] = useState(null);
    const [transactions, setTransactions] = useState([]);

    // ── Listener de saldo em tempo real ─────────────────────────────────────
    // Why: substituímos o polling de 1s por onSnapshot para eliminar leituras
    // desnecessárias e reduzir custo do Firestore.
    useEffect(() => {
        const currentUser = firebase.getCurrentUser();
        if (!currentUser) return;

        const unsubscribe = firebase.subscribeToBalance(currentUser.uid, (novoSaldo) => {
            setUser((prev) => {
                if (prev.saldo === novoSaldo) return prev;
                return { ...prev, saldo: novoSaldo };
            });
        });

        return () => unsubscribe();
    }, []);

    // ── Listener de transações em tempo real ─────────────────────────────────
    useEffect(() => {
        const currentUser = firebase.getCurrentUser();
        if (!currentUser) return;

        const unsubscribe = firebase.subscribeToUserTransactions(currentUser.uid, (txs) => {
            setTransactions(txs);
        });

        return () => unsubscribe();
    }, []);

    // ── Cotação do dólar ─────────────────────────────────────────────────────
    useEffect(() => {
        fetch('http://192.168.100.84:5000/dolar')
            .then((response) => response.text())
            .then((text) => {
                const values = text.split(';');
                setMaxValue(parseFloat(values[0]));
                setMinValue(parseFloat(values[1]));
            })
            .catch((error) => {
                console.error('Cotacao indisponivel:', error);
            });
    }, []);

    /**
     * Formata um timestamp (ms) para DD/MM/AA.
     * @param {number} ts - Unix timestamp em milissegundos.
     * @returns {string}
     */
    const formatDate = useCallback((ts) => {
        if (!ts) return '';
        const d = new Date(ts);
        return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${String(d.getFullYear()).slice(2)}`;
    }, []);

    /**
     * Formata o valor em BRL.
     * @param {number} amount
     * @returns {string}
     */
    const formatCurrency = useCallback((amount) => {
        return Number(amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }, []);

    const renderPurchase = ({ item }) => {
        const isOutgoing = item.senderUid === user.uid;
        const label      = isOutgoing ? `→ ${item.recipientName}` : `← ${item.senderName}`;
        const color      = isOutgoing ? '#FF6962' : '#4caf50';

        return (
            <Purchase key={item.id}>
                <PurchaseInfo>
                    <Text bold>{label}</Text>
                    <Text small color="#727479">
                        {item.type?.toUpperCase()} · {formatDate(item.timestamp)}
                    </Text>
                    <HashText numberOfLines={1} ellipsizeMode="middle">
                        #{item.hash?.substring(0, 16)}…
                    </HashText>
                </PurchaseInfo>
                <Text heavy color={color}>{formatCurrency(item.amount)}</Text>
            </Purchase>
        );
    };

    return (
        <Container>
            <Header>
                <ProfilePhoto source={getProfilePhotoSource(user.profilePhotoUrl)} />
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
                                    5.03, 5.03, 5.06, 5.16,
                                    minValue ?? 5.16,
                                    maxValue ?? 5.20,
                                ],
                                color: (opacity = 1) => `rgba(255, 105, 98, ${opacity})`,
                            },
                            {
                                data: [5.03, 5.03, 5.06, 5.16],
                                color: (opacity = 1) => `rgba(81, 150, 244, ${opacity})`,
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

            <Purchases
                data={transactions}
                renderItem={renderPurchase}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <TransactionsHeader>
                        <Text>Últimas Transações</Text>
                        <MaterialIcons name="sort" size={24} color="#5196f4" />
                    </TransactionsHeader>
                }
                ListEmptyComponent={
                    <EmptyText>Nenhuma transação ainda.</EmptyText>
                }
            />

            <StatusBar style='light' />
        </Container>
    );
}

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
`;

const TransactionsHeader = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
`;

const Purchase = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-color: #393939;
    padding-bottom: 12px;
    margin-bottom: 12px;
`;

const PurchaseInfo = styled.View`
    flex: 1;
    margin-right: 8px;
`;

const HashText = styled.Text`
    color: #555;
    font-size: 10px;
    font-family: monospace;
    margin-top: 2px;
`;

const EmptyText = styled.Text`
    color: #727479;
    text-align: center;
    margin-top: 24px;
`;
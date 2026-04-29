import React, { useContext, useRef, useState } from "react";
import { Animated, StyleSheet, View as RNView } from "react-native";
import { getBrand } from "../components/input/Brand";
import Text from '../components/Text';
import Card from '../components/card/Card';
import Input from '../components/input/Input';
import { ScrollView, Container, Content, Button, View } from '../components/Pack';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { UserContext } from './../../UseContext';

const CardScreen = () => {
    const [user, setUser] = useContext(UserContext);
    const flipAnimation = useRef(new Animated.Value(0)).current;
    const [backView, setBackView] = useState(false);
    const [icon, setIcon] = useState('0');
    
    const mesAleatorio = Math.floor(Math.random() * 12) + 1; 
    const mesFormatado = mesAleatorio < 10 ? `0${mesAleatorio}` : mesAleatorio;

    const anoAleatorio = Math.floor(Math.random() * 10) + 23; 

    const [data, setData] = useState({
        name: user.username,
        number: '',
        validate: `${mesFormatado}/${anoAleatorio}`,
        cvv: ''
    });

    const animatedCard = (back) => {
        if (back === backView) {
            return;
        }

        setBackView(back);

        Animated.timing(flipAnimation, {
            toValue: back ? 1 : 0,
            duration: 460,
            useNativeDriver: true,
        }).start();
    };

    const frontRotate = flipAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"],
    });

    const backRotate = flipAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ["180deg", "360deg"],
    });

    const frontOpacity = flipAnimation.interpolate({
        inputRange: [0, 0.49, 0.5, 1],
        outputRange: [1, 1, 0, 0],
    });

    const backOpacity = flipAnimation.interpolate({
        inputRange: [0, 0.49, 0.5, 1],
        outputRange: [0, 0, 1, 1],
    });

    /* const save = async () => {
        try {
            const createCard = await firebase.createCard(data, cardBrand)
        } catch (error) {
            console.log("Error @signUp: ", error)
        } finally {
            navigation.navigate("MyCards")
        }
    } */

    return (
        <ScrollView>
            <Container>
                <Text center heavy title color="#FF6962" margin="16%">BlockCard</Text>

                <Content>
                    <RNView style={styles.flipArea}>
                        <Animated.View
                            style={[
                                styles.cardFace,
                                {
                                    opacity: frontOpacity,
                                    transform: [{ perspective: 1000 }, { rotateY: frontRotate }],
                                },
                            ]}
                        >
                            <Card data={data} icon={icon} back={false} />
                        </Animated.View>

                        <Animated.View
                            style={[
                                styles.cardFace,
                                {
                                    opacity: backOpacity,
                                    transform: [{ perspective: 1000 }, { rotateY: backRotate }],
                                },
                            ]}
                        >
                            <Card data={data} icon={icon} back />
                        </Animated.View>
                    </RNView>
                   
                    <Input 
                        placeholder = "Nome"
                        mask
                        value={data.name}
                        type="custom"
                        options={{
                            mask: '*******************************'
                        }}
                        onChangeText={(text) => {
                            setData({...data, name: text})
                            animatedCard(false)
                        }}
                        icon = {<Feather name="user" size={17.5} color="#3099D9" />}
                    />
                    <Input
                        placeholder="Número do Cartão"
                        mask
                        value={data.number}
                        type="credit-card"
                        onChangeText={(text) => {
                            setData({ ...data, number: text });
                            animatedCard(false)
                            const brand = getBrand(text);
                            if (brand) {
                                setIcon(brand);
                            }
                        }}
                        icon={<Octicons name="number" size={23} color="#3099D9" />}
                    />

                    <View>
                        <Input width="45%"
                            placeholder = "Validade"
                            
                            value={data.validate}
                            type='custom'
                            options={{
                                mask: '99/99'
                            }}
                            onChangeText={(text) => {
                                setData({...data, validate: text})
                                animatedCard(false)
                            }}
                            icon = {<Entypo name="calendar" size={20} color="#3099D9" />}
                        />
                        <Input width="45%"
                            placeholder = "CVV"
                            mask
                            value={data.cvv}
                            type="custom"
                            options={{
                                mask: '999'
                            }}
                            onChangeText={(text) => {
                                setData({...data, cvv: text})
                                animatedCard(true)
                            }}
                            icon = {<Ionicons name="lock-closed" size={20} color="#3099D9" />}
                        />
                    </View>
                    
                </Content>

                <Button >
                    <Text medium heavy></Text>
                </Button>

                <StatusBar style='light' />
            </Container>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    flipArea: {
        width: "100%",
        height: 224,
    },
    cardFace: {
        position: "absolute",
        width: "100%",
        backfaceVisibility: "hidden",
    },
});

export default CardScreen

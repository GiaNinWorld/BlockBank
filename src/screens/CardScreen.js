import React, { useContext, useState } from "react";
import { Animated } from "react-native";
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
    const [widthAnimated, setWidthAnimated] = useState(new Animated.Value(330));
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
        if(back && !backView){
            Animated.timing(widthAnimated, {
                toValue: 0,
                duration: 400,
                useNativeDriver: false
            }).start()

            setTimeout(() => {
                Animated.timing(widthAnimated, {
                    toValue: 330,
                    duration: 400,
                    useNativeDriver: false
                }).start()
            }, 400)
            setTimeout(() => {
                setBackView(true);
            }, 150)
        }

        if(!back && backView){
            Animated.timing(widthAnimated, {
                toValue: 0,
                duration: 400,
                useNativeDriver: false
            }).start()

            setTimeout(() => {
                Animated.timing(widthAnimated, {
                    toValue: 330,
                    duration: 400,
                    useNativeDriver: false
                }).start()
            }, 400)

            setTimeout(() => {
                setBackView(false);
            }, 450)
            
        }
    }

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
                    <Animated.View style={{width: widthAnimated}} >
                        <Card data={data}  icon={icon} back={backView} />
                    </Animated.View>
                   
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
                            icon = {<Ionicons name="ios-lock-closed" size={20} color="#3099D9" />}
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

export default CardScreen
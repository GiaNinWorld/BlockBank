import React, { useState, useContext } from "react";
import { Alert, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import styled from "styled-components/native";
import { StatusBar } from 'expo-status-bar';

import Text from "../components/Text";

import { FirebaseContext } from "../../FirebaseContext";
import { UserContext } from './../../UseContext';

export default function SignInScreen({ navigation }) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoad] = useState(false);
    const [_, setUser] = useContext(UserContext);
    const firebase = useContext(FirebaseContext)

    const signIn = async () => {
        setLoad(true);

        try {
            await firebase.signIn(email, password);

            const uid = firebase.getCurrentUser().uid;

            const userInfo = await firebase.getUserInfo(uid);

            if (!userInfo) {
                throw new Error("Perfil do usuario nao encontrado.");
            }

            setUser({
                username: userInfo.username,
                email: userInfo.email,
                uid,
                password: userInfo.password,
                cpf: userInfo.cpf,
                nrConta: userInfo.nrConta,
                nacionalidade: userInfo.nacionalidade,
                sexo: userInfo.sexo,
                endereco: userInfo.endereco,
                profilePhotoUrl: userInfo.profilePhotoUrl,
                saldo: userInfo.saldo,
            })

            navigation.navigate('Tabs')
        } catch (error) {
            if (firebase.getCurrentUser()) {
                await firebase.logOut();
            }

            const message = error.code === "permission-denied" || error.message?.includes("Missing or insufficient permissions")
                ? "Login autenticado, mas o app nao tem permissao para ler seu perfil no Firestore. Ajuste as regras da colecao users."
                : error.message;

            Alert.alert("Erro ao entrar", message);
        } finally {
            setLoad(false);
        }
    }

    return (
        <Container>
            {/* Decoracao absoluta — fica fora do scroll para nao ser empurrada */}
            <HeaderGraphic>
                <RightCircle />
                <LeftCircle />
            </HeaderGraphic>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                >
                    <Main>
                        <Text center heavy title color="#FF6962">
                            Bem-Vindo!
                        </Text>
                    </Main>

                    <Auth>
                        <AuthContainer>
                            <AuthTitle>Endereco de Email</AuthTitle>
                            <AuthField
                                autoCapitalize="none"
                                autoCompleteType="email"
                                autoCorrect={false}
                                keyboardType={"email-address"}
                                onChangeText={email => setEmail(email.trim())}
                                value={email}
                            />
                        </AuthContainer>
                        <AuthContainer>
                            <AuthTitle>Endereco de Senha</AuthTitle>
                            <AuthField
                                autoCapitalize="none"
                                autoCompleteType="password"
                                autoCorrect={false}
                                secureTextEntry={true}
                                onChangeText={password => setPassword(password.trim())}
                                value={password}
                            />
                        </AuthContainer>
                    </Auth>

                    <SignInContainer disabled={loading} onPress={signIn}>
                        {loading ? (
                            <Loading />
                        ) : (
                            <Text bold center color="#ffffff">
                                Entrar
                            </Text>
                        )}
                    </SignInContainer>

                    <SignUp onPress={() => navigation.navigate("SignUp")}>
                        <Text small center color="#8e93a1">
                            Novo aqui? <Text bold color="#FF6962">Registre-se</Text>
                        </Text>
                    </SignUp>
                </ScrollView>
            </KeyboardAvoidingView>

            <StatusBar style='light' />
        </Container>
    );
}

const Container = styled.View`
    flex: 1;
    background-color: #1e1e1e;
`;

const Main = styled.View`
    margin-top: 192px;
`;

const Auth = styled.View`
    margin: 64px 32px 32px;
`;

const AuthContainer = styled.View`
    margin-bottom: 32px;
`;

const AuthTitle = styled(Text)`
    color: #8e93a1;
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 300;
`;

const AuthField = styled.TextInput`
    border-bottom-color: #8e93a1;
    border-bottom-width: 0.5px;
    height: 48px;
    color: white;
`;

const SignInContainer = styled.TouchableOpacity`
    margin: 0 32px;
    height: 48px;
    align-items: center;
    justify-content: center;
    background-color: #FF6962;
    border-radius: 6px;
`;

const Loading = styled.ActivityIndicator.attrs(props => ({
    color: "#ffffff",
    size: "small",
}))` `;

const SignUp = styled.TouchableOpacity`
    margin-top: 16px;
`;

const HeaderGraphic = styled.View`
    position: absolute;
    width: 100%;
    top: -50px;
    z-index: -100;
`;

const RightCircle = styled.View`
    background-color: #FF6962;
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 200px;
    right: -100px;
    top: -200px;
`;

const LeftCircle = styled.View`
    background-color: #3099D9;
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 100px;
    left: -50px;
    top: -50px;
`;
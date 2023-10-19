import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { StatusBar } from 'expo-status-bar';

import Text from "../components/Text";

import { FirebaseContext } from "../../FirebaseContext";
import { UserContext } from './../../UseContext';

export default SignInScreen = ({ navigation }) => {
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
                /* theme: userInfo.theme */
            })

            navigation.navigate('Tabs')
        } catch (error) {
            alert(error.message);
        } finally {
            setLoad(false);
        }
    }

    /*  const handleSignIn = async () => {
         setLoad(true)
         signInWithEmailAndPassword(auth, email, password)
             .then(async (userCredential) => {
                 console.log('Usuário logado');
                 const user = userCredential.user;
                 console.log(user);
 
                 // Obtém o documento do usuário atualmente logado no Firestore
                 const db = getFirestore();
                 const userDocRef = doc(db, 'users', user.uid);
                 const userDocSnapshot = await getDoc(userDocRef);
 
                 if (userDocSnapshot.exists()) {
                     const userData = userDocSnapshot.data();
                     const nome = userData.nome;
                     const cpf = userData.cpf;
                     const nrConta = userData.numeroConta;
                     const nacionalidade = userData.nacionalidade;
                     const sexo = userData.sexo;
                     const profilePhoto = userData.profilePhotoUrl;
                     const endereco = userData.endereco;
                     const qnt = userData.quantidadeCartoes;
                     const saldo = userData.saldo;
                     // console.log('Username:', username); USERNAME
                     const params = {
                         user: {
                             uid: user.uid,
                             nome: nome,
                             profile: profilePhoto,
                             cpf: cpf,
                             nrConta: nrConta,
                             nacionalidade: nacionalidade,
                             sexo: sexo,
                             endereco: endereco,
                             quantidadeCartoes: qnt,
                             saldo: saldo,
                             // outras informações do usuário
                         }
                     };
 
                     setUser(params.user); // Atualize as informações do usuário no contexto
                     setLoad(false)
                     navigation.navigate('Tabs');
                 } else {
                     console.log('Nome de usuário não encontrado');
                 }
             })
             .catch(error => {
                 console.log(error);
                 Alert.alert(error.message);
             });
     }; */

    /* useEffect(() => {
        setTimeout(async () => {
            const user = firebase.getCurrentUser();

            if (user) {
                const userInfo = await firebase.getUserInfo(user.uid)

                setUser({
                    email: userInfo.email,
                    uid: user.uid,
                    username: userInfo.username,
                    password: userInfo.password,
                    profilePhotoId: userInfo.profilePhotoUrl
                })
            }
        })
    }, []) */

    return (
        <Container>
            <Main>
                <Text center heavy title color="#FF6962">
                    Bem-Vindo!
                </Text>
            </Main>

            <Auth>
                <AuthContainer>
                    <AuthTitle>Endereço de Email</AuthTitle>
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
                    <AuthTitle>Endereço de Senha</AuthTitle>
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

            <HeaderGraphic>
                <RightCircle />
                <LeftCircle />
            </HeaderGraphic>

            <StatusBar style='light' />
        </Container>
    );
};

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
}))``;

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
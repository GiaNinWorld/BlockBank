import React, { useState, useContext } from "react";
import { TouchableOpacity, KeyboardAvoidingView } from "react-native";
import styled from "styled-components";
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from "@expo/vector-icons";
import Modal from "react-native-modal";

import { FirebaseContext } from "../../FirebaseContext";
import { UserContext } from "../../UseContext";

import Text from "../components/Text";

const exampleImages = [
    require("../../assets/profile.png"),
    require("../../assets/profileOne.png"),
    require("../../assets/profileTwo.png"),
];

export default SignUpScreen = ({ navigation }) => {
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoad] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const firebase = useContext(FirebaseContext)
    const [_, setUser] = useContext(UserContext)

    /* const handleCreateAccount = () => {
        setLoad(true)
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('Conta Criada')
                const user = userCredential.user;
                console.log(user)
                saveAdditionalUserInfo(user.uid); // Salva informações adicionais do usuário
                setLoad(false)
                navigation.navigate('SignIn')
            })
            .catch(error => {
                console.log(error)
                Alert.alert(error.message)
            })
    }
 */
    /* const saveAdditionalUserInfo = (userId) => {
        const db = getFirestore(app);
        const userRef = doc(db, 'users', userId);

        setDoc(userRef, {
            username,
            saldo: 0,
            profilePhotoUrl: profilePhoto, // Salva a URL da imagem no campo profilePhotoUrl
            cpf: "",
            numeroConta: "",
            nacionalidade: "",
            sexo: "",
            endereco: "",
            cpf: "",
        }, { merge: true })
            .then(() => {
                console.log('Informações adicionais do usuário salvas');
            })
            .catch(error => {
                console.log(error);
                Alert.alert(error.message);
            });
    }; */

    const pickImage = (image) => {
        /* let imageUrl;//Variavel que armazena o caminho da photo
        switch (image) {//profilePhotoUrl
            case 19:
                imageUrl = "../../assets/profile.png";
                break;
            case 20:
                imageUrl = "../../assets/profileOne.png";
                break;
            case 21:
                imageUrl = "../../assets/profileTwo.png";
                break;
            default:
                imageUrl = ""; // URL padrão ou vazia caso o índice não corresponda a uma imagem específica
        }
        console.log(imageUrl); */
        setProfilePhoto(image);
        setModalVisible(false);
    };

    const renderImageSelection = () => {
        return (
            <Modal
                isVisible={modalVisible}
                onBackdropPress={() => setModalVisible(false)}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                backdropOpacity={0.5}
                style={{ margin: 0 }}
            >
                <ImageSelectionContainer>
                    {exampleImages.map((image, index) => (
                        <TouchableOpacity key={index} onPress={() => pickImage(image)}>
                            <ImageItem source={image} />
                        </TouchableOpacity>
                    ))}
                </ImageSelectionContainer>
            </Modal>
        );
    };

    const addProfilePhoto = async () => {
        setModalVisible(true);
    };

    const signUp = async () => {
        setLoad(true);

        const user = {username, email, password, profilePhoto}

        try {
            const createdUser = await firebase.createUser(user)

            setUser({ ...createdUser });
        } catch (error) {
            console.log("Error @signUp: ", error)
        } finally {
            setLoad(false);
            navigation.navigate("SignIn")
        }
    }

    return (
        <Container>
            <KeyboardAvoidingView behavior="position" >
                <Main>
                    <Text center heavy title color="#FF6962">
                        Registre-se para começar.
                    </Text>
                </Main>

                <ProfilePhotoContainer onPress={addProfilePhoto}>
                    {profilePhoto ? (
                        <ProfilePhoto source={profilePhoto} style={{ aspectRatio: 1 }} />
                    ) : (
                        <DefaultProfilePhoto>
                            <AntDesign name="plus" size={24} color="#ffffff" />
                        </DefaultProfilePhoto>
                    )}
                </ProfilePhotoContainer>

                {renderImageSelection()}
                
                <Auth>
                    <AuthContainer>
                        <AuthTitle>Nome Completo</AuthTitle>
                        <AuthField
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={(username) => { setUsername(username.trim()) }}
                            value={username}
                        />
                    </AuthContainer>
                    <AuthContainer>
                        <AuthTitle>Endereço de Email</AuthTitle>
                        <AuthField
                            autoCapitalize="none"
                            autoCompleteType="email"
                            autoCorrect={false}
                            keyboardType={"email-address"}
                            onChangeText={(email) => { setEmail(email.trim()) }}
                            value={email}
                        />
                    </AuthContainer>
                    <AuthContainer>
                        <AuthTitle>Endereço de Senha</AuthTitle>
                        <AuthField
                            autoCapitalize="none"
                            autoCompleteType="password"
                            autoCorrect={false}
                            onChangeText={(pass) => { setPassword(pass.trim()) }}
                            value={password}
                        />
                    </AuthContainer>
                    
                </Auth>
                

                <SignUpContainer disabled={loading} onPress={signUp}>
                    {loading ? (
                        <Loading />
                    ) : (
                        <Text bold center color="#ffffff">
                            Registrar-se
                        </Text>
                    )}
                </SignUpContainer>

                <SignIn onPress={() => navigation.navigate("SignIn")}>
                    <Text small center color="#8e93a1">
                        Já tem uma conta? <Text bold color="#FF6962">Entrar</Text>
                    </Text>
                </SignIn>

                <HeaderGraphic>
                    <RightCircle />
                    <LeftCircle />
                </HeaderGraphic>

                <StatusBar style='light' />
            </KeyboardAvoidingView>
        </Container>
    );
};

const Container = styled.View`
    flex: 1;
    background-color: #1e1e1e;
`;

const Main = styled.View`
    margin-top: 160px;
`;

const ProfilePhotoContainer = styled.TouchableOpacity`
    background-color: #1e1e1e;
    width: 110px;
    height: 110px;
    border-radius: 40px;
    align-self: center;
    margin-top: 16px;
    overflow: hidden;
`;

const DefaultProfilePhoto = styled.View`
    background-color: #e1e2e6;
    align-items: center;
    justify-content: center;
    flex: 1;
`;

const ProfilePhoto = styled.Image`
    flex: 1;
`;

const ImageSelectionContainer = styled.View`
    flex: 1;
    background-color: #1e1e1e;
    padding: 26px;
    align-items: center;
    justify-content: center;
`;

const ImageItem = styled.Image`
    width: 200px;
    height: 200px;
    margin-right: 8px;
    margin-bottom: 8px;

`;

const Auth = styled.View`
    margin: 16px 32px 32px;
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

const SignUpContainer = styled.TouchableOpacity`
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

const SignIn = styled.TouchableOpacity`
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

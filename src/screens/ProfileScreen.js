import React, { useContext, useState } from "react";
import { TouchableOpacity, TextInput, KeyboardAvoidingView } from "react-native";
import styled from 'styled-components';
import { StatusBar } from 'expo-status-bar';
import Modal from "react-native-modal";
import { TextInputMask } from 'react-native-masked-text';

import Text from '../components/Text';
import { FirebaseContext } from "../../FirebaseContext";
import { UserContext } from './../../UseContext';

const exampleImages = [
    require("../../assets/profile.png"),
    require("../../assets/profileOne.png"),
    require("../../assets/profileTwo.png"),
];

export default CardsScreen = () => {
    const [user, setUser] = useContext(UserContext);
    const firebase = useContext(FirebaseContext);
    const [profilePhoto, setProfilePhoto] = useState(user.profilePhotoUrl);
    const [modalVisible, setModalVisible] = useState(false);
    const [cpf, setCpf] = useState(user.cpf ? user.cpf : '12345678922');
    const [nrConta, setNrConta] = useState(user.nrConta ? user.nrConta : '123456789');
    const [nacionalidade, setNacionalidade] = useState(user.nacionalidade ? user.nacionalidade : 'Brasileiro');
    const [sexo, setSexo] = useState(user.sexo ? user.sexo : 'N/A');
    const [endereco, setEndereco] = useState(user.endereco ? user.endereco : 'Criciúma');
    const [username, setUsername] = useState(user.username)
    const [saldo, setSaldo] = useState(user.saldo)

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
            imageUrl = "";
    }

    const addProfilePhoto = () => {
        setModalVisible(true);
    };

    const pickImage = (image) => {
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

    const infoPerson = [
        {
            id: "1",
            username: user.username,
            cpf: user.cpf ? cpf : cpf,
            nrConta: user.nrConta ? nrConta : nrConta,
        },
    ];
    const infoPersonOne = [
        {
            id: "2",
            nacionalidade: user.nacionalidade ? nacionalidade : nacionalidade,
            sexo: user.sexo ? sexo : sexo,
            endereco: user.endereco ? endereco : endereco,
        },
    ]

    const save = async () => {
        try {
            const uid = firebase.getCurrentUser().uid;

            await firebase.updateProfile(uid, user.email, user.password, cpf, username, nrConta, nacionalidade, sexo, endereco, profilePhoto, saldo);

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
            })
        } catch (error) {
            console.log('Error @update: ', error)
        }
    }

    const renderCard = ({ item }) => (
        <CardContainer>
            <CardInfo>
                <CardDetails1>
                    <Text medium heavy margin="1.6%">Nome Completo</Text>
                    <Text medium heavy margin="1.6%">Cpf</Text>
                    <Text medium heavy margin="1.6%">Telefone</Text>
                </CardDetails1>
                <CardDetails>
                    <TextInput 
                        color={"#ffffff"}
                    >
                        <Text mid bold>
                            {item.username}
                        </Text>
                    </TextInput>
                    <MaskTextInput
                        type={'cpf'}
                        value={cpf}
                        onChangeText={(text) => {
                            setCpf(text)
                        }}
                    />
                    <MaskTextInput
                        type={'cel-phone'}
                        value={nrConta}
                        options={{
                          maskType: 'BRL',
                          withDDD: true,
                          dddMask: '(99) '
                        }}
                        onChangeText={(text) => {
                            setNrConta(text)
                        }}
                    />
                </CardDetails>
            </CardInfo>
            <CardActions>
                <Update onPress={save}>
                    <Text heavy>Save</Text>
                </Update>
            </CardActions>
        </CardContainer>
    )
    const renderCard1 = ({ item }) => (
        <CardContainer>
            <CardInfo>
                <CardDetails1>
                    <Text medium heavy margin="1.6%">Nacionalidade</Text>
                    <Text medium heavy margin="1.6%">Sexo</Text>
                    <Text medium heavy margin="1.6%">Endereço</Text>
                </CardDetails1>
                <CardDetails>
                    <TextInput
                        color={"#ffffff"}
                    >
                        <Text mid bold>
                            {item.nacionalidade}
                        </Text>
                    </TextInput>
                    <TextInput
                        color={"#ffffff"}
                    >
                        <Text mid bold>
                            {item.sexo}
                        </Text>
                    </TextInput>
                    <TextInput
                        color={"#ffffff"}
                    >
                        <Text mid bold>
                            {item.endereco}
                        </Text>
                    </TextInput>
                </CardDetails>
            </CardInfo>
            <CardActions>
                <Update onPress={save}>
                    <Text heavy>Save</Text>
                </Update>
            </CardActions>
        </CardContainer>
    )
    return (
        <Container>
            <KeyboardAvoidingView behavior="position" >
                <Text center heavy title color="#FF6962" margin="16%">
                    Block Bank
                </Text>

                <ProfilePhotoContainer onPress={addProfilePhoto}>
                    {profilePhoto ? (
                        <ProfilePhoto source={profilePhoto} style={{ aspectRatio: 1 }} />
                    ) : (
                        <ProfilePhoto source={imageUrl} style={{ aspectRatio: 1 }} />
                    )}
                </ProfilePhotoContainer>

                {renderImageSelection()}

                <Text center title margin="4%">
                    {user.username}
                </Text>

                <Cards data={infoPerson} renderItem={renderCard} />
                <Cards data={infoPersonOne} renderItem={renderCard1} />

                <StatusBar style='light' />
            </KeyboardAvoidingView>
        </Container>
    );
};

const Container = styled.SafeAreaView`
    flex: 1;
    background-color: #1e1e1e;
`;

const Cards = styled.FlatList`
    padding:  0 8px;
    margin-top: 2px;
`;

const ProfilePhotoContainer = styled.TouchableOpacity`
  background-color: #1e1e1e;
  width: 150px;
  height: 150px;
  border-radius: 40px;
  align-self: center;
  margin-top: 16px;
  overflow: hidden;
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
  margin-bottom: 10px;
`;

const CardContainer = styled.View`
    background-color: #292929;
    margin-bottom: 16px;
    padding: 16px;
    border-radius: 8px;
`;

const CardInfo = styled.View`
    flex-direction: row;
    border-bottom-width: 1px;
    border-bottom-color: #393939;
    padding-bottom: 12px;
    margin-bottom: 12px;
`;

const CardDetails = styled.View`
    flex: 1;
    align-items: flex-end;
`;

export const MaskTextInput = styled(TextInputMask)`
    font-weight: 600;
    font-size: 14px;
    color: #ffffff;
`

const CardDetails1 = styled.View`
    flex: 1;
    align-items: flex-start;
`;

const CardActions = styled.View`
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
`;

const Update = styled.TouchableOpacity`
    background-color: #3d3d3d;
    padding: 8px 16px;
    border-radius: 6px;
`;
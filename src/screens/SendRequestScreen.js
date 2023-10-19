import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, ScrollView } from "react-native";
import Modal from "react-native-modal";

import Text from "../components/Text";
import NumberPad from "../components/NumberPad";

import { UserContext } from './../../UseContext';

import transactions from './transactionsData';

import CryptoJS from 'crypto-js';
import { authenticateAsync } from 'expo-local-authentication';

import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

export default SendRequestScreen = () => {
    const [user, setUser] = useContext(UserContext);
    const [usera, setUsera] = useContext(UserContext);
    const [amount, setAmount] = useState(0);
    const [modalUsersVisible, setModalUsersVisible] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState();
    const [selectedUserUid, setSelectedUserUid] = useState(null);
    const [selectedUserName, setSelectedUserName] = useState(null);
    const [userList, setUserList] = useState([]);
    const [query, setQuery] = useState();

    let imageUrl;
    const db = firebase.firestore();

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        console.log(userList);
    }, [userList]);

    const getUsers = async () => {
        try {
            const usersRef = db.collection('users');
            const snapshot = await usersRef.get();

            const users = [];
            snapshot.forEach((doc) => {
                const userData = doc.data();
                const user = {
                    uid: doc.id,
                    name: userData.username,
                    profilePhotoUrl: userData.profilePhotoUrl
                };
                // Verificar se o usuário atual é diferente do usuário atualmente logado
                if (usera.uid !== user.uid) {
                    users.push(user);
                }
            });

            setUserList(users);
        } catch (error) {
            console.log('Erro ao obter usuários:', error);
        }
    };


    const addProfilePhoto = () => {
        setModalUsersVisible(true);
    };

    const pickImage = (user) => {
        const selectedUserUid = user.uid;
        const selectedUserName = user.name;
        let imageSource = null;

        if (user.profilePhotoUrl === 19) {
            imageSource = require("../../assets/profile.png");
        } else if (user.profilePhotoUrl === 20) {
            imageSource = require("../../assets/profileOne.png");
        } else if (user.profilePhotoUrl === 21) {
            imageSource = require("../../assets/profileTwo.png");
        }

        setProfilePhoto(imageSource);
        setSelectedUserUid(selectedUserUid);
        setSelectedUserName(selectedUserName);
        setModalUsersVisible(false);
    };

    // Verifique se query é uma string válida antes de usar toLowerCase()
    const lowerCaseQuery = typeof query === 'string' ? query.toLowerCase() : '';

    const filteredUsers = userList.filter(user => 
        typeof user.name === 'string' && user.name.toLowerCase().includes(lowerCaseQuery)
    );

    const renderImageSelection = () => {
        return (
            <Modal
                isVisible={modalUsersVisible}
                onBackdropPress={() => setModalUsersVisible(false)}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                backdropOpacity={0.5}
                style={{ margin: 0 }}
            >
                 <AuthContainer>
                    <AuthTitle>Nome do usuário</AuthTitle>
                    <AuthField
                        autoCorrect={false}
                        value={query}
                        onChangeText={query => setQuery(query)}
                    />
                </AuthContainer>

                <ImageSelectionContainer>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {filteredUsers.map((user) => (
                            <TouchableOpacity key={user.uid} onPress={() => pickImage(user)}>
                                {user.profilePhotoUrl === 19 && (
                                    <ImageItem source={require("../../assets/profile.png")} />
                                )}
                                {user.profilePhotoUrl === 20 && (
                                    <ImageItem source={require("../../assets/profileOne.png")} />
                                )}
                                {user.profilePhotoUrl === 21 && (
                                    <ImageItem source={require("../../assets/profileTwo.png")} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </ImageSelectionContainer>
            </Modal>
        );
    };

    const convert = (currentAmount) => {
        const newAmount = currentAmount / 1;

        return newAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };


    const pressKey = (item, index) => {
        if (amount.length > 9 && typeof item !== 'object') {
            
        }         
        else {
            setAmount((prev) => {
                return index !== 10 ? prev + item : prev.slice(0, prev.length - 1);
            });
        }   
    };

    const verifyFingerprintAndTransferMoney = async (amount, recipientUid) => {
        try {
            const result = await authenticateAsync();
            if (result.success) {
                transferMoney(amount, recipientUid);
            } else {
                // A verificação da impressão digital falhou
                console.log('Falha na verificação da impressão digital');
            }
        } catch (error) {
            // Ocorreu um erro durante a verificação da impressão digital
            console.log('Erro na verificação da impressão digital', error);
        }
    };

    const transferMoney = async (amount, recipientUid) => {
        try {
            const senderUid = user.uid;

            // Verificar saldo do remetente
            const senderDoc = await db.collection('users').doc(senderUid).get();
            const senderData = senderDoc.data();
            const senderBalance = senderData.saldo;

            if (senderBalance < parseFloat(amount)) {
                throw new Error('Saldo insuficiente');
            }

            const updatedSenderBalance = senderBalance - parseFloat(amount);
            await db.collection('users').doc(senderUid).update({
                saldo: updatedSenderBalance,
            });

            // Adicionar valor ao saldo do destinatário
            const recipientDoc = await db.collection('users').doc(recipientUid).get();
            const recipientData = recipientDoc.data();
            const recipientBalance = recipientData.saldo;

            const updatedRecipientBalance = recipientBalance + parseFloat(amount);
            await db.collection('users').doc(recipientUid).update({
                saldo: updatedRecipientBalance,
            });

            // Adicionar informações da transação ao array
            const transaction = {
                id: CryptoJS.SHA256(0,100000000),
                product: 'BRL',
                receiver: selectedUserName,
                price: parseFloat(amount),
                purchaseDate: '03/10/23',
                means: 'Pix',
            };
            transactions.push(transaction);

            console.log('Transferência de dinheiro realizada com sucesso');
        } catch (error) {
            console.log('Erro ao transferir dinheiro:', error);
        }
    };

    return (
        <Container>
            <Text center heavy title color="#FF6962" margin="16%">
                BlockBank
            </Text>

            <Amount>
                <Text title heavy>{convert(amount)}</Text>
                <Text bold color="#727479">Escolha uma quantia para enviar</Text>
            </Amount>

            <User>
                <ProfilePhotoContainer onPress={addProfilePhoto}>
                    {profilePhoto ? (
                        <ProfilePhoto source={profilePhoto} style={{ aspectRatio: 1 }} />
                    ) : (
                        <ProfilePhoto source={imageUrl ? imageUrl : require("../../assets/profile.png")} style={{ aspectRatio: 1 }} />
                    )}
                </ProfilePhotoContainer>

                <MaterialIcons name="edit" size={16} color="#ffffff" />
                <Text medium heavy>
                    {selectedUserName ? selectedUserName : ""}
                </Text>
            </User>

            {renderImageSelection()}

            <TouchableOpacity onPress={() => {
                if (selectedUserUid && amount > 0) {
                    verifyFingerprintAndTransferMoney(amount, selectedUserUid);
                } else {
                    console.log('Nenhum destinatário selecionado ou saldo inválido');
                }
            }}>
                <Send>
                    <Text medium heavy>Enviar {convert(amount)} Para {selectedUserName ? selectedUserName : "Alguém"}</Text>
                </Send>
            </TouchableOpacity>

            <NumberPad onPress={pressKey} />
            <StatusBar style='light' />
        </Container>
    );
};

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #1e1e1e;
`;

const Amount = styled.View`
  align-items: center;
`;

const User = styled.View`
  margin: 16px 16px;
  align-items: center;
`;

const ProfilePhotoContainer = styled.TouchableOpacity`
  background-color: #1e1e1e;
  align-self: center;
  margin-top: 16px;
  overflow: hidden;
`;

const ProfilePhoto = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 12px;
`;

const AuthContainer = styled.View`
    margin-top: 21%;
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
    padding-left: 2%;
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

const Send = styled.View`
  margin: 16px;
  background-color: #FF6962;
  padding: 16px 32px;
  align-items: center;
  border-radius: 12px;
`;

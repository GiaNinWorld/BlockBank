/**
 * SendRequestScreen.js — BlockPix
 *
 * Tela de envio de Pix com:
 *  - Entrada de valor no estilo "centavos primeiro" (ex: R$ 0,00 → R$ 12,34)
 *  - Seletor de destinatário com modal bottom-sheet
 *  - NumberPad customizado com layout 3x4
 *  - Transferência atômica via FirebaseContext + cadeia de hashes
 */
import React, { useState, useContext, useEffect, useCallback } from "react";
import {
    View,
    TouchableOpacity,
    ScrollView,
    Modal,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Dimensions,
} from "react-native";
import styled from "styled-components/native";
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { authenticateAsync } from 'expo-local-authentication';

import firebase from "firebase/compat/app";
import 'firebase/compat/firestore';

import Text from "../components/Text";
import NumberPad from "../components/NumberPad";
import { getProfilePhotoSource } from "../utils/profilePhotos";
import { UserContext } from './../../UseContext';
import { FirebaseContext } from './../../FirebaseContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function SendRequestScreen() {
    const [user] = useContext(UserContext);
    const firebase_ctx = useContext(FirebaseContext);

    // Valor em centavos — evita problemas de ponto flutuante
    const [cents, setCents] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userList, setUserList] = useState([]);
    const [query, setQuery] = useState('');
    const [sending, setSending] = useState(false);

    const db = firebase.firestore();

    useEffect(() => {
        fetchUsers();
    }, []);

    /**
     * Busca todos os usuários cadastrados, excluindo o usuário logado.
     * TODO: adicionar paginação quando a base crescer.
     */
    const fetchUsers = async () => {
        try {
            const snapshot = await db.collection('users').get();
            const users = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (user.uid !== doc.id) {
                    users.push({
                        uid: doc.id,
                        name: data.username ?? 'Usuário',
                        profilePhotoUrl: data.profilePhotoUrl,
                    });
                }
            });
            setUserList(users);
        } catch (error) {
            console.log('Erro ao obter usuarios:', error);
        }
    };

    const filteredUsers = userList.filter(u =>
        typeof u.name === 'string' &&
        u.name.toLowerCase().includes(query.toLowerCase())
    );

    /**
     * Formata centavos como moeda BRL.
     * Exemplos: 0 → "R$ 0,00" | 1234 → "R$ 12,34"
     * @param {number} c - Valor em centavos
     * @returns {string}
     */
    const formatCents = useCallback((c) => {
        return (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }, []);

    /**
     * Processa tecla do NumberPad.
     * Acumula dígitos a partir da direita (centavos → reais), max R$ 99.999,99.
     * @param {string} key - dígito ('0'-'9') ou 'BACKSPACE'
     */
    const pressKey = useCallback((key) => {
        if (key === 'BACKSPACE') {
            setCents(prev => Math.floor(prev / 10));
            return;
        }
        const digit = parseInt(key, 10);
        setCents(prev => {
            const next = prev * 10 + digit;
            return next > 9999999 ? prev : next; // teto: R$ 99.999,99
        });
    }, []);

    /**
     * Inicia a transferência: verifica biometria e delega ao FirebaseContext.
     * FirebaseContext.transferMoney executa atomicamente (Firestore runTransaction)
     * e registra na cadeia de hashes após confirmação.
     */
    const handleSend = async () => {
        if (!selectedUser) {
            Alert.alert('Atenção', 'Selecione um destinatário.');
            return;
        }
        if (cents <= 0) {
            Alert.alert('Atenção', 'Informe um valor válido.');
            return;
        }

        setSending(true);
        try {
            const biometria = await authenticateAsync({
                promptMessage: `Confirmar envio de ${formatCents(cents)} para ${selectedUser.name}`,
            });

            if (!biometria.success) {
                Alert.alert('Autenticação', 'Biometria não confirmada. Tente novamente.');
                return;
            }

            const amountReais = cents / 100;

            await firebase_ctx.transferMoney(
                user.uid,
                selectedUser.uid,
                amountReais,
                user.username,
                selectedUser.name,
            );

            Alert.alert('✓ Pix enviado!', `${formatCents(cents)} enviado para ${selectedUser.name}.`);
            setCents(0);
            setSelectedUser(null);
        } catch (error) {
            console.log('Erro ao transferir:', error);
            Alert.alert('Erro', error.message);
        } finally {
            setSending(false);
        }
    };

    // ── Modal de seleção de destinatário (bottom sheet) ────────────────────────
    const renderModal = () => (
        <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
        >
            {/* Overlay escuro — fecha modal ao tocar fora */}
            <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }} onPress={() => setModalVisible(false)}>
                <Pressable onPress={() => {}} style={{ flex: 1 }}>
                    <BottomSheet>
                        {/* Barra de arraste decorativa */}
                        <DragHandle />

                        <ModalTitle>Selecionar destinatário</ModalTitle>

                        {/* Campo de busca */}
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        >
                            <SearchBox>
                                <Ionicons name="search" size={18} color="#8e93a1" style={{ marginRight: 8 }} />
                                <SearchField
                                    placeholder="Buscar por nome..."
                                    placeholderTextColor="#8e93a1"
                                    autoCorrect={false}
                                    value={query}
                                    onChangeText={setQuery}
                                />
                            </SearchBox>

                            {/* Lista de usuários */}
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled"
                                style={{ maxHeight: SCREEN_HEIGHT * 0.5 }}
                            >
                                {filteredUsers.length === 0 ? (
                                    <EmptySearch>Nenhum usuário encontrado.</EmptySearch>
                                ) : (
                                    filteredUsers.map((u) => (
                                        <UserRow
                                            key={u.uid}
                                            onPress={() => {
                                                setSelectedUser(u);
                                                setModalVisible(false);
                                                setQuery('');
                                            }}
                                            activeOpacity={0.7}
                                        >
                                            <UserRowAvatar source={getProfilePhotoSource(u.profilePhotoUrl)} />
                                            <UserRowName>{u.name}</UserRowName>
                                            <Ionicons name="chevron-forward" size={18} color="#3d3d3d" />
                                        </UserRow>
                                    ))
                                )}
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </BottomSheet>
                </Pressable>
            </Pressable>
        </Modal>
    );

    // ── Main ──────────────────────────────────────────────────────────────────
    return (
        <Container>
            {/* Cabeçalho */}
            <Header>
                <Text heavy title color="#FF6962">BlockPix</Text>
                <Ionicons name="flash" size={24} color="#FF6962" />
            </Header>

            {/* Valor */}
            <AmountSection>
                <AmountLabel>Valor a enviar</AmountLabel>
                <AmountValue>{formatCents(cents)}</AmountValue>
            </AmountSection>

            {/* Destinatário */}
            <RecipientCard onPress={() => setModalVisible(true)} activeOpacity={0.8}>
                <RecipientAvatar
                    source={selectedUser
                        ? getProfilePhotoSource(selectedUser.profilePhotoUrl)
                        : getProfilePhotoSource('profile')}
                />
                <RecipientInfo>
                    <RecipientName>
                        {selectedUser ? selectedUser.name : 'Selecionar destinatário'}
                    </RecipientName>
                    <RecipientHint>
                        {selectedUser ? 'Toque para alterar' : 'Toque para buscar'}
                    </RecipientHint>
                </RecipientInfo>
                <MaterialIcons
                    name={selectedUser ? 'swap-horiz' : 'person-search'}
                    size={22}
                    color="#FF6962"
                />
            </RecipientCard>

            {renderModal()}

            {/* Teclado numérico */}
            <NumberPad onPress={pressKey} />

            {/* Botão enviar */}
            <SendButton onPress={handleSend} disabled={sending} activeOpacity={0.85}>
                {sending ? (
                    <SendLoader size="small" color="#fff" />
                ) : (
                    <SendButtonText>
                        {cents > 0 && selectedUser
                            ? `Enviar ${formatCents(cents)} →`
                            : 'Enviar Pix'}
                    </SendButtonText>
                )}
            </SendButton>

            <StatusBar style='light' />
        </Container>
    );
}

// ── Styled Components ────────────────────────────────────────────────────────

const Container = styled.SafeAreaView`
    flex: 1;
    background-color: #1e1e1e;
`;

const Header = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px 0;
`;

const AmountSection = styled.View`
    align-items: center;
    padding: 24px 24px 16px;
`;

const AmountLabel = styled.Text`
    color: #727479;
    font-size: 13px;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
`;

const AmountValue = styled.Text`
    color: #ffffff;
    font-size: 42px;
    font-weight: 300;
    letter-spacing: -1px;
`;

const RecipientCard = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    background-color: #292929;
    border-radius: 16px;
    margin: 0 20px 20px;
    padding: 14px 16px;
`;

const RecipientAvatar = styled.Image`
    width: 44px;
    height: 44px;
    border-radius: 22px;
    background-color: #3d3d3d;
`;

const RecipientInfo = styled.View`
    flex: 1;
    margin-left: 12px;
`;

const RecipientName = styled.Text`
    color: #ffffff;
    font-size: 15px;
    font-weight: 600;
`;

const RecipientHint = styled.Text`
    color: #727479;
    font-size: 12px;
    margin-top: 2px;
`;

const SendButton = styled.TouchableOpacity`
    margin: 12px 20px 16px;
    height: 52px;
    background-color: ${p => p.disabled ? '#7a3330' : '#FF6962'};
    border-radius: 14px;
    align-items: center;
    justify-content: center;
`;

const SendButtonText = styled.Text`
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.3px;
`;

const SendLoader = styled.ActivityIndicator``;

// ── Modal ────────────────────────────────────────────────────────────────────

const BottomSheet = styled.View`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #1e1e1e;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
    padding: 12px 20px 32px;
    min-height: 40%;
`;

const DragHandle = styled.View`
    width: 40px;
    height: 4px;
    background-color: #3d3d3d;
    border-radius: 2px;
    align-self: center;
    margin-bottom: 16px;
`;

const ModalTitle = styled.Text`
    color: #ffffff;
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 16px;
`;

const SearchBox = styled.View`
    flex-direction: row;
    align-items: center;
    background-color: #292929;
    border-radius: 12px;
    padding: 10px 14px;
    margin-bottom: 12px;
`;

const SearchField = styled.TextInput`
    flex: 1;
    color: #ffffff;
    font-size: 15px;
`;

const UserRow = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
    padding: 10px 4px;
    border-bottom-width: 1px;
    border-bottom-color: #292929;
`;

const UserRowAvatar = styled.Image`
    width: 44px;
    height: 44px;
    border-radius: 22px;
    background-color: #3d3d3d;
`;

const UserRowName = styled.Text`
    flex: 1;
    color: #ffffff;
    font-size: 15px;
    font-weight: 500;
    margin-left: 12px;
`;

const EmptySearch = styled.Text`
    color: #727479;
    text-align: center;
    padding: 24px 0;
    font-size: 14px;
`;
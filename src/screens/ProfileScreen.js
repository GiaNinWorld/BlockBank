import React, { useContext, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { TextInputMask } from "react-native-masked-text";

import Text from "../components/Text";
import { FirebaseContext } from "../../FirebaseContext";
import { UserContext } from "../../UseContext";
import {
    getProfilePhotoKey,
    getProfilePhotoSource,
    PROFILE_PHOTOS,
} from "../utils/profilePhotos";

export default function ProfileScreen() {
    const [user, setUser] = useContext(UserContext);
    const firebase = useContext(FirebaseContext);
    const [modalVisible, setModalVisible] = useState(false);
    const [saving, setSaving] = useState(false);
    const [profilePhotoKey, setProfilePhotoKey] = useState(getProfilePhotoKey(user.profilePhotoUrl));
    const [form, setForm] = useState({
        username: user.username ?? "",
        cpf: user.cpf ?? "",
        nrConta: user.nrConta ?? "",
        nacionalidade: user.nacionalidade ?? "",
        sexo: user.sexo ?? "",
        endereco: user.endereco ?? "",
    });

    const updateField = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const pickImage = (photoKey) => {
        setProfilePhotoKey(photoKey);
        setModalVisible(false);
    };

    const save = async () => {
        const currentUser = firebase.getCurrentUser();
        if (!currentUser) {
            Alert.alert("Perfil", "Usuario nao autenticado.");
            return;
        }

        setSaving(true);

        try {
            await firebase.updateProfile(
                currentUser.uid,
                user.email,
                user.password,
                form.cpf,
                form.username,
                form.nrConta,
                form.nacionalidade,
                form.sexo,
                form.endereco,
                profilePhotoKey,
                user.saldo ?? 0
            );

            const userInfo = await firebase.getUserInfo(currentUser.uid);

            setUser({
                ...user,
                ...userInfo,
                uid: currentUser.uid,
                profilePhotoUrl: userInfo.profilePhotoUrl ?? profilePhotoKey,
            });

            Alert.alert("Perfil", "Dados atualizados.");
        } catch (error) {
            console.log("Error @update: ", error);
            Alert.alert("Erro ao salvar", error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Container>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                <Header>
                    <Text heavy title color="#FF6962">
                        Perfil
                    </Text>
                    <Text color="#8e93a1">{user.email}</Text>
                </Header>

                <PhotoButton onPress={() => setModalVisible(true)}>
                    <ProfilePhoto source={getProfilePhotoSource(profilePhotoKey)} />
                    <PhotoEditBadge>
                        <MaterialIcons name="edit" size={16} color="#ffffff" />
                    </PhotoEditBadge>
                </PhotoButton>

                <FormSection>
                    <SectionTitle>Dados pessoais</SectionTitle>
                    <FieldLabel>Nome completo</FieldLabel>
                    <FieldInput
                        value={form.username}
                        onChangeText={(value) => updateField("username", value)}
                        autoCapitalize="words"
                    />

                    <FieldLabel>CPF</FieldLabel>
                    <MaskFieldInput
                        type="cpf"
                        value={form.cpf}
                        onChangeText={(value) => updateField("cpf", value)}
                        keyboardType="number-pad"
                    />

                    <FieldLabel>Telefone</FieldLabel>
                    <MaskFieldInput
                        type="cel-phone"
                        value={form.nrConta}
                        options={{
                            maskType: "BRL",
                            withDDD: true,
                            dddMask: "(99) ",
                        }}
                        onChangeText={(value) => updateField("nrConta", value)}
                        keyboardType="phone-pad"
                    />
                </FormSection>

                <FormSection>
                    <SectionTitle>Endereco e documento</SectionTitle>
                    <FieldLabel>Nacionalidade</FieldLabel>
                    <FieldInput
                        value={form.nacionalidade}
                        onChangeText={(value) => updateField("nacionalidade", value)}
                        autoCapitalize="words"
                    />

                    <FieldLabel>Sexo</FieldLabel>
                    <FieldInput
                        value={form.sexo}
                        onChangeText={(value) => updateField("sexo", value)}
                    />

                    <FieldLabel>Endereco</FieldLabel>
                    <FieldInput
                        value={form.endereco}
                        onChangeText={(value) => updateField("endereco", value)}
                        autoCapitalize="sentences"
                    />
                </FormSection>

                <SaveButton disabled={saving} onPress={save}>
                    {saving ? (
                        <Loading />
                    ) : (
                        <Text bold center color="#ffffff">
                            Salvar
                        </Text>
                    )}
                </SaveButton>
            </ScrollView>

            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable style={{ flex: 1 }} onPress={() => setModalVisible(false)}>
                    <PhotoPickerPanel>
                        {PROFILE_PHOTOS.map((photo) => (
                            <PhotoOption key={photo.key} onPress={() => pickImage(photo.key)}>
                                <PhotoOptionImage source={photo.source} />
                            </PhotoOption>
                        ))}
                    </PhotoPickerPanel>
                </Pressable>
            </Modal>

            <StatusBar style="light" />
        </Container>
    );
}

const Container = styled.SafeAreaView`
    flex: 1;
    background-color: #1e1e1e;
`;

const Header = styled.View`
    padding: 48px 24px 16px;
`;

const PhotoButton = styled.TouchableOpacity`
    width: 132px;
    height: 132px;
    align-self: center;
    margin: 8px 0 24px;
`;

const ProfilePhoto = styled.Image`
    width: 132px;
    height: 132px;
    border-radius: 66px;
    background-color: #2c2c2c;
`;

const PhotoEditBadge = styled.View`
    position: absolute;
    right: 2px;
    bottom: 2px;
    width: 34px;
    height: 34px;
    border-radius: 17px;
    background-color: #ff6962;
    align-items: center;
    justify-content: center;
    border-width: 2px;
    border-color: #1e1e1e;
`;

const FormSection = styled.View`
    margin: 0 16px 16px;
    padding: 16px;
    background-color: #292929;
    border-radius: 8px;
`;

const SectionTitle = styled(Text)`
    color: #ffffff;
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 14px;
`;

const FieldLabel = styled(Text)`
    color: #8e93a1;
    font-size: 12px;
    text-transform: uppercase;
    margin-bottom: 6px;
`;

const FieldInput = styled.TextInput`
    height: 44px;
    color: #ffffff;
    background-color: #1e1e1e;
    border-radius: 6px;
    padding: 0 12px;
    margin-bottom: 14px;
`;

const MaskFieldInput = styled(TextInputMask)`
    height: 44px;
    color: #ffffff;
    background-color: #1e1e1e;
    border-radius: 6px;
    padding: 11px 12px;
    margin-bottom: 14px;
`;

const SaveButton = styled.TouchableOpacity`
    margin: 4px 16px 32px;
    height: 48px;
    align-items: center;
    justify-content: center;
    background-color: #ff6962;
    border-radius: 6px;
`;

const Loading = styled.ActivityIndicator.attrs({
    color: "#ffffff",
    size: "small",
})``;

const PhotoPickerPanel = styled.View`
    margin-top: auto;
    padding: 24px 20px 28px;
    background-color: #1e1e1e;
    flex-direction: row;
    justify-content: center;
`;

const PhotoOption = styled.TouchableOpacity`
    margin: 0 8px;
`;

const PhotoOptionImage = styled.Image`
    width: 84px;
    height: 84px;
    border-radius: 42px;
`;

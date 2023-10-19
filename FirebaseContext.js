import React, { createContext } from "react";

import firebase from "firebase/compat/app";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { firebaseConfig } from './FirebaseConfig';
import CryptoJS from 'crypto-js';

const FirebaseContext = createContext();

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore()

const Firebase = {
    getCurrentUser: () => {
        return firebase.auth().currentUser
    },

    createUser: async (user) => {
        try {
            await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
            const uid = Firebase.getCurrentUser().uid;

            let profilePhotoUrl = "default"; 

            if (user.profilePhoto) {
                profilePhotoUrl = user.profilePhoto;
            }
            
            await db.collection("users").doc(uid).set({
                username: user.username,
                email: user.email,
                password: CryptoJS.SHA256(user.password).toString(),
                cpf: '',
                nrConta: '',
                nacionalidade: '',
                sexo: '',
                endereco: '',
                saldo: 23000,
                profilePhotoUrl,
            })

            /* delete user.password */

            return { ...user, profilePhotoUrl, uid };
        } catch (error) {
            console.log("Error @createUser: ", error.message);
        }
    },

    createCard: async (card, brand) => {
        try {
            const uid = Firebase.getCurrentUser().uid;
    
            // Cria um novo documento na coleção "cards" com o UID do usuário
            await db.collection("cards").doc(uid).set({
                
            });
    
            if (brand === '55'){
                // Cria uma subcoleção dentro do documento criado acima
                await db.collection("cards").doc(uid).collection("master").doc(uid).set({
                    name: card.name,
                    number: card.number,
                    validate: card.validate,
                    cvv: card.cvv,
                    brand: brand
                });
            }
            if (brand === '41'){
                // Cria uma subcoleção dentro do documento criado acima
                await db.collection("cards").doc(uid).collection("visa").doc(uid).set({
                    name: card.name,
                    number: card.number,
                    validate: card.validate,
                    cvv: card.cvv,
                    brand: brand
                });
            }
            if (brand === '63'){
                // Cria uma subcoleção dentro do documento criado acima
                await db.collection("cards").doc(uid).collection("elo").doc(uid).set({
                    name: card.name,
                    number: card.number,
                    validate: card.validate,
                    cvv: card.cvv,
                    brand: brand
                });
            }
            if (brand != '55' && brand != '41' && brand != '63'){
                // Cria uma subcoleção dentro do documento criado acima
                await db.collection("cards").doc(uid).collection("other").doc(uid).set({
                    name: card.name,
                    number: card.number,
                    validate: card.validate,
                    cvv: card.cvv,
                    brand: brand
                });
            }
    
            return { ...card };
        } catch (error) {
            console.log("Error @createUser: ", error.message);
        }
    },
    
    

    uploadProfilePhoto: async (uri) => {
        const uid = Firebase.getCurrentUser().uid;

        try {
            const photo = await Firebase.getBlob(uri);

            const imageRef = firebase.storage().ref("profilePhotos").child(uid);
            await imageRef.put(photo);

            const url = await imageRef.getDownloadURL();

            await db.collection("users").doc(uid).update({
                profilePhotoUrl: url,
            })

            return url;
        } catch (error) {
            console.log("Error @uploadProfilePhoto: ", error);
        }
    },

    getBlob: async (uri) => {
        return await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.onload = () => {
                resolve(xhr.response);
            }

            xhr.onerror = () => {
                reject(new TypeError("Network request failed."));
            };

            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        })
    },

    getUserInfo: async (uid) => {
        try {
            const user = await db.collection("users").doc(uid).get()

            if (user.exists){
                return user.data()
            }
        } catch (error) {
            console.log("Error @getUserInfo: ", error)
        }
    },

    logOut: async () => {
        try {
            await firebase.auth().signOut()

            return true
        } catch (error) {
            console.log("Error @logOut: ", error)
        }

        return false;
    },

    signIn: async (email, password) => {
        CryptoJS.SHA256(password).toString()
        return firebase.auth().signInWithEmailAndPassword(email, password);
    },

    updateProfile: async (uid, email, password, cpf, username, nrConta, nacionalidade, sexo, endereco, photo, saldo) => {
        return db.collection("users").doc(uid).update({
            username: username,
            email: email,
            password: CryptoJS.SHA256(password).toString(),
            profilePhotoUrl: photo,
            cpf: cpf,
            nrConta: nrConta,
            nacionalidade: nacionalidade,
            sexo: sexo,
            endereco: endereco,
            saldo: saldo,
        })
    }
};

const FirebaseProvider = (props) => {
    return <FirebaseContext.Provider value={Firebase}>{props.children}</FirebaseContext.Provider>;
}

export { FirebaseContext, FirebaseProvider };

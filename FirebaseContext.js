/**
 * FirebaseContext.js
 *
 * Camada de serviço Firebase para o BlockBank.
 * Expõe todas as operações de Auth, Firestore e lógica de domínio
 * (transferência atômica, blockchain de transações, cartões) via React Context.
 */
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

const db = firebase.firestore();

// Hash inicial da cadeia — equivalente ao bloco gênesis de uma blockchain.
// Todas as primeiras transações de um usuário apontam para este hash.
const GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000";

const Firebase = {
    // ─── AUTH ────────────────────────────────────────────────────────────────

    /** Retorna o usuário atualmente autenticado no Firebase Auth. */
    getCurrentUser: () => {
        return firebase.auth().currentUser;
    },

    /**
     * Cria conta no Firebase Auth e perfil no Firestore.
     * @param {Object} user - { username, email, password, profilePhoto }
     * @returns {Object} Dados do usuário criado.
     */
    createUser: async (user) => {
        try {
            await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
            const uid = Firebase.getCurrentUser().uid;

            const profilePhotoUrl = user.profilePhoto ?? "default";

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
            });

            return { ...user, profilePhotoUrl, uid };
        } catch (error) {
            console.log("Error @createUser: ", error.message);
            throw error;
        }
    },

    /**
     * Autentica o usuário com email e senha.
     * @param {string} email
     * @param {string} password
     */
    signIn: async (email, password) => {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    },

    /** Encerra a sessão do usuário atual. */
    logOut: async () => {
        try {
            await firebase.auth().signOut();
            return true;
        } catch (error) {
            console.log("Error @logOut: ", error);
        }
        return false;
    },

    // ─── USUÁRIO ─────────────────────────────────────────────────────────────

    /**
     * Busca o perfil do usuário no Firestore (leitura única).
     * @param {string} uid - ID do usuário.
     * @returns {Object} Dados do perfil.
     */
    getUserInfo: async (uid) => {
        try {
            const user = await db.collection("users").doc(uid).get();
            if (user.exists) return user.data();
            throw new Error("Perfil do usuario nao encontrado.");
        } catch (error) {
            console.log("Error @getUserInfo: ", error);
            throw error;
        }
    },

    /**
     * Atualiza os campos do perfil do usuário no Firestore.
     * @param {string} uid
     * @param {string} email
     * @param {string} password - senha já hasheada (SHA-256)
     * @param {string} cpf
     * @param {string} username
     * @param {string} nrConta
     * @param {string} nacionalidade
     * @param {string} sexo
     * @param {string} endereco
     * @param {string} photo - chave do avatar
     * @param {number} saldo
     */
    updateProfile: async (uid, email, password, cpf, username, nrConta, nacionalidade, sexo, endereco, photo, saldo) => {
        return db.collection("users").doc(uid).update({
            username,
            email,
            password: CryptoJS.SHA256(password).toString(),
            profilePhotoUrl: photo,
            cpf,
            nrConta,
            nacionalidade,
            sexo,
            endereco,
            saldo,
        });
    },

    /**
     * Assina atualizações em tempo real do saldo do usuário via onSnapshot.
     * Substitui o polling por setInterval, eliminando leituras desnecessárias.
     *
     * @param {string} uid - ID do usuário a observar.
     * @param {Function} onUpdate - Callback chamado com o novo saldo (number).
     * @returns {Function} unsubscribe — chame ao desmontar o componente.
     */
    subscribeToBalance: (uid, onUpdate) => {
        return db.collection('users').doc(uid).onSnapshot(
            (doc) => {
                if (doc.exists) {
                    onUpdate(doc.data().saldo);
                }
            },
            (error) => {
                console.log("Error @subscribeToBalance: ", error);
            }
        );
    },

    // ─── TRANSFERÊNCIA PIX ───────────────────────────────────────────────────

    /**
     * Transfere saldo de forma ATÔMICA usando Firestore runTransaction.
     * Garante que o débito e o crédito ocorram juntos ou não ocorram.
     * Após a transferência, registra a transação na cadeia de hashes.
     *
     * Complexidade: O(1) leituras + O(1) escritas na transação Firestore.
     *
     * @param {string} senderUid - UID do remetente.
     * @param {string} recipientUid - UID do destinatário.
     * @param {number} amount - Valor a transferir.
     * @param {string} senderName - Nome do remetente (para o registro).
     * @param {string} recipientName - Nome do destinatário (para o registro).
     * @throws {Error} Se saldo for insuficiente ou usuário não encontrado.
     */
    transferMoney: async (senderUid, recipientUid, amount, senderName, recipientName) => {
        const parsedAmount = parseFloat(amount);

        await db.runTransaction(async (tx) => {
            const senderRef   = db.collection('users').doc(senderUid);
            const recipientRef = db.collection('users').doc(recipientUid);

            // Todas as leituras devem ocorrer ANTES das escritas na transação
            const [senderDoc, recipientDoc] = await Promise.all([
                tx.get(senderRef),
                tx.get(recipientRef),
            ]);

            if (!senderDoc.exists || !recipientDoc.exists) {
                throw new Error('Usuario nao encontrado.');
            }

            const senderBalance    = senderDoc.data().saldo;
            const recipientBalance = recipientDoc.data().saldo;

            if (senderBalance < parsedAmount) {
                throw new Error('Saldo insuficiente');
            }

            // Escrita atômica: ambas ocorrem ou nenhuma ocorre
            tx.update(senderRef,    { saldo: senderBalance    - parsedAmount });
            tx.update(recipientRef, { saldo: recipientBalance + parsedAmount });
        });

        // Registra na cadeia de hashes APÓS a transação Firestore ser confirmada
        await Firebase._recordTransaction(senderUid, recipientUid, parsedAmount, senderName, recipientName);
    },

    // ─── BLOCKCHAIN DE TRANSAÇÕES ────────────────────────────────────────────

    /**
     * [INTERNO] Busca o hash da última transação do remetente.
     * Why: armazenamos o hash diretamente no documento do usuário para evitar
     * a necessidade de um índice composto (senderUid + createdAt) no Firestore.
     * Custo: O(1) — uma única leitura de documento.
     *
     * @param {string} uid - UID do remetente.
     * @returns {string} Hash SHA-256 hexadecimal.
     */
    _getLastTransactionHash: async (uid) => {
        const doc = await db.collection('users').doc(uid).get();
        if (!doc.exists) return GENESIS_HASH;
        return doc.data().lastTxHash ?? GENESIS_HASH;
    },

    /**
     * [INTERNO] Registra uma transação no Firestore com encadeamento de hashes.
     *
     * Estrutura do bloco:
     *   hash = SHA256(prevHash + JSON.stringify(payload))
     *
     * O campo `participants` permite consultas do tipo array-contains
     * para buscar tanto transações enviadas quanto recebidas por um usuário.
     *
     * @param {string} senderUid
     * @param {string} recipientUid
     * @param {number} amount
     * @param {string} senderName
     * @param {string} recipientName
     */
    _recordTransaction: async (senderUid, recipientUid, amount, senderName, recipientName) => {
        const prevHash  = await Firebase._getLastTransactionHash(senderUid);
        const timestamp = Date.now();

        const payload = { senderUid, recipientUid, amount, timestamp, senderName, recipientName };

        // Why: encadeamento garante imutabilidade — qualquer alteração no bloco
        // quebra todos os hashes subsequentes, tornando a adulteração detectável.
        const hash = CryptoJS.SHA256(prevHash + JSON.stringify(payload)).toString();

        const batch = db.batch();

        // Adiciona o documento de transação
        const txRef = db.collection('transactions').doc();
        batch.set(txRef, {
            ...payload,
            participants: [senderUid, recipientUid], // permite array-contains query
            prevHash,
            hash,
            type: 'pix',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        // Persiste o hash no documento do usuário para evitar query ordenada na próxima vez
        const senderRef = db.collection('users').doc(senderUid);
        batch.update(senderRef, { lastTxHash: hash });

        await batch.commit();
    },

    /**
     * Assina em tempo real as transações do usuário (enviadas e recebidas).
     *
     * Why: removemos o orderBy('createdAt') do Firestore para eliminar a
     * necessidade de índice composto (participants + createdAt). A ordenação
     * por 'timestamp' é feita no cliente, que é eficiente para até ~200 docs.
     *
     * @param {string} uid - UID do usuário.
     * @param {Function} onUpdate - Callback com array de transações mais recentes primeiro.
     * @returns {Function} unsubscribe
     */
    subscribeToUserTransactions: (uid, onUpdate) => {
        return db.collection('transactions')
            .where('participants', 'array-contains', uid)
            .onSnapshot(
                (snapshot) => {
                    const txs = snapshot.docs
                        .map(doc => ({ id: doc.id, ...doc.data() }))
                        // Ordena por timestamp (Date.now()) decrescente no cliente
                        .sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0))
                        .slice(0, 20);
                    onUpdate(txs);
                },
                (error) => {
                    console.log("Error @subscribeToUserTransactions: ", error);
                }
            );
    },

    // ─── CARTÃO ──────────────────────────────────────────────────────────────

    /**
     * Salva (ou sobrescreve) os dados do cartão do usuário no Firestore.
     * Documento: cards/{uid}
     *
     * @param {{ name: string, number: string, validate: string, cvv: string }} cardData
     */
    saveCard: async (cardData) => {
        const uid = Firebase.getCurrentUser().uid;
        await db.collection('cards').doc(uid).set({
            name:      cardData.name,
            number:    cardData.number,
            validate:  cardData.validate,
            cvv:       cardData.cvv,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
    },

    /**
     * Busca os dados do cartão do usuário atual.
     * @returns {Object|null} Dados do cartão ou null se não existir.
     */
    getCard: async () => {
        const uid = Firebase.getCurrentUser().uid;
        const doc = await db.collection('cards').doc(uid).get();
        if (doc.exists) return doc.data();
        return null;
    },
};

const FirebaseProvider = (props) => {
    return <FirebaseContext.Provider value={Firebase}>{props.children}</FirebaseContext.Provider>;
};

export { FirebaseContext, FirebaseProvider };
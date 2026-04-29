/**
 * FirebaseConfig.js
 *
 * Lê as credenciais do Firebase a partir de variáveis de ambiente com prefixo EXPO_PUBLIC_.
 * O Expo injeta essas variáveis em tempo de build a partir do arquivo .env (SDK >= 49).
 *
 * NUNCA coloque valores hardcoded aqui. Use o arquivo .env (não versionado).
 */
export const firebaseConfig = {
  apiKey:            process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};
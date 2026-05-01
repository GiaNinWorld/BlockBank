# BlockBank

Banco digital gamificado voltado para quem está chegando ao mercado de trabalho, com foco em segurança, educação financeira e investimentos de forma simples e envolvente.

## Visão geral

BlockBank foi criado para o público jovem que está iniciando sua vida financeira e precisa de um banco que fale a sua língua. A proposta é unir segurança bancária real com uma experiência gamificada: cada transferência, conquista e interação com o app é pensada para engajar e ensinar ao mesmo tempo.

O app oferece transferências via Pix com autenticação biométrica, cartão virtual, histórico de transações com rastreabilidade por cadeia de hashes e uma base sólida para expansão de funcionalidades de investimento e gamificação. Toda a camada de persistência roda no Firebase, sem servidor próprio, garantindo escalabilidade e segurança desde o início.

## Funcionalidades principais

- Cadastro e autenticação via Firebase Auth (email e senha).
- Saldo em tempo real usando listener `onSnapshot`, sem polling.
- **BlockPix**: transferência P2P com entrada de valor em centavos, seletor de destinatário com busca, autenticação biométrica e transferência atômica via `Firestore runTransaction`.
- Histórico de transações encadeado por hashes (blockchain-style): cada transação armazena `prevHash` e `hash = SHA256(prevHash + payload)`, tornando adulterações detectáveis.
- **BlockCard**: cartão virtual com animação de flip 3D, detecção automática de bandeira (Visa, Mastercard, Elo) e persistência no Firestore.
- Perfil editável com avatar, CPF, telefone, endereço e nacionalidade.
- Tema escuro com paleta coesa em todas as telas.

## Stack e arquitetura

**Mobile**
- React Native 0.81 + Expo ~54
- React Navigation (Stack + Bottom Tabs)
- styled-components/native
- react-native-chart-kit (LineChart de cotação)
- expo-local-authentication (biometria)
- react-native-masked-text (CPF, telefone)

**Backend / Auth**
- Firebase Authentication (email/senha)
- Cloud Firestore (banco de dados em tempo real)

**Segurança e criptografia**
- CryptoJS: SHA-256 para encadeamento de hashes das transações
- Credenciais Firebase via variáveis de ambiente (`EXPO_PUBLIC_*`)

**Arquitetura resumida**
```
App.js                    <- Navegação (Stack + BottomTabs) e providers
FirebaseContext.js        <- Camada de serviço: Auth, Firestore, Pix atomico, blockchain
UseContext.js             <- Estado global do usuário (React Context)
src/
  screens/                <- Telas da aplicação
    SignInScreen.js
    SignUpScreen.js
    HomeScreen.js         <- Saldo + gráfico + histórico de transações
    SendRequestScreen.js  <- BlockPix
    CardScreen.js         <- BlockCard
    ProfileScreen.js
  components/
    NumberPad.js          <- Teclado numérico 3x4 para entrada de valor
    Text.js               <- Tipografia com props declarativas
    card/                 <- Componente de cartão com flip 3D
    input/                <- Input com máscara + detecção de bandeira
  utils/
    profilePhotos.js      <- Mapeamento de avatares locais
```

**Modelo de dados Firestore**
```
users/{uid}
  ├── username, email, cpf, nrConta, ...
  ├── saldo: number
  ├── profilePhotoUrl: string
  └── lastTxHash: string   <- último hash da cadeia de transações

transactions/{auto-id}
  ├── senderUid, senderName
  ├── recipientUid, recipientName
  ├── amount: number
  ├── timestamp: number    <- Date.now() para ordenação client-side
  ├── participants: string[] <- [senderUid, recipientUid] para query bidirecional
  ├── prevHash: string
  ├── hash: string         <- SHA256(prevHash + JSON.stringify(payload))
  └── createdAt: Timestamp

cards/{uid}
  ├── name, number, validate, cvv
  └── updatedAt: Timestamp
```

## Como rodar localmente

**Pré-requisitos**
- Node.js 18+
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Projeto Firebase com Firestore e Authentication habilitados
- Dispositivo físico ou emulador com Expo Go

**1) Instalar dependências**
```bash
npm install
```

**2) Configurar variáveis de ambiente**
```bash
cp .env.example .env
# Preencha as variáveis com os dados do seu projeto Firebase
```

**3) Iniciar o servidor de desenvolvimento**
```bash
npx expo start
```

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto (nunca versione este arquivo):

| Variável | Descrição |
|---|---|
| `EXPO_PUBLIC_FIREBASE_API_KEY` | Chave de API do projeto Firebase |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | Domínio de autenticação Firebase |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | ID do projeto Firebase |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | Bucket do Firebase Storage |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Sender ID para notificações |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | App ID do Firebase |

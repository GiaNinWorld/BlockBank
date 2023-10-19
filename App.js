import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import TouchScreen from './src/screens/TouchScreen';
import PinScreen from './src/screens/PinScreen';
import HomeScreen from './src/screens/HomeScreen';
import SendRequestScreen from './src/screens/SendRequestScreen';
/* import MyCardsScreen from './src/screens/MyCardsScreen'; */
import CardScreen from './src/screens/CardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { UserContext, UserProvider } from './UseContext'; // Importe o UserProvider
import { FirebaseProvider } from './FirebaseContext';

export default function App() {
  const AppStack = createStackNavigator();
  const TabStack = createBottomTabNavigator();
  const ProfileStack = createStackNavigator();
  /* const CardStack = createStackNavigator(); */

  const screenOptions = ({ route }) => ({
    tabBarIcon: ({ focused }) => {
      let icon = "";
      const color = focused ? "#559dff" : "#727479";
      const size = 24;

      switch (route.name) {
        case "MyCard":
          icon = 'credit-card';
          break;

        case "SendRequest":
          icon = 'send';
          break;

        default:
          icon = 'dashboard';
      }

      return <MaterialIcons name={icon} size={size} color={color} />;
    },
    tabBarStyle: {
      backgroundColor: '#1e1e1e',
      borderTopColor: '#1e1e1e',
      paddingBottom: 16,
      height: 64,
    },
    headerShown: false,
  });

  const TabStackScreens = () => {
    return (
      <TabStack.Navigator screenOptions={screenOptions}>
        <TabStack.Screen
          name='BlockHome' component={HomeScreen}
        />
        <TabStack.Screen
          name='SendRequest' component={SendRequestScreen} options={{ title: "BlockPix" }}
        />
        <TabStack.Screen
          name='MyCard' component={CardScreen} options={{ title: "BlockCard" }}
        />
      </TabStack.Navigator>
    );
  };

  const [user] = useContext(UserContext);

  const ProfileStackScreens = () => {
    return (
      <ProfileStack.Navigator screenOptions={screenOptions}>
        <ProfileStack.Screen
          name='ProfileDetails' component={ProfileScreen}
        />
      </ProfileStack.Navigator>
    );
  };

  /* const CardStackScreens = () => {
    return (
      <CardStack.Navigator screenOptions={screenOptions}>
        <CardStack.Screen
          name='CardDetails' component={CardScreen}
        />
      </CardStack.Navigator>
    );
  }; */

  return (
    <FirebaseProvider>
      <UserProvider>
        <NavigationContainer>
          <AppStack.Navigator
            screenOptions={{
              headerShown: false,
              cardStyleInterpolator: forFade,
            }}
          >
            
            <AppStack.Screen name='SignIn' component={SignInScreen} />
            {/* <AppStack.Screen name='Touch' component={TouchScreen} /> */}
            {/* <AppStack.Screen name='Card' component={CardStackScreens} /> */}
            <AppStack.Screen name='Tabs' component={TabStackScreens} />
            <AppStack.Screen name='SignUp' component={SignUpScreen} />
            <AppStack.Screen name='Pin' component={PinScreen} />
            <AppStack.Screen name='Profile' component={ProfileStackScreens} />

          </AppStack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </FirebaseProvider>
  );
}

// Função para animação de fade
const forFade = ({ current }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

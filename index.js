import React, { Component, useEffect } from 'react';
import { AppRegistry, View } from 'react-native';
import App from './App';
import { Provider as ReduxProvider } from 'react-redux';
import { createStore } from 'redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import {
    configureFonts,
    DefaultTheme,
    Provider as PaperProvider,
} from 'react-native-paper';
// import SplashScreen from '../MobileBankingApp/src/scenes/Launch/SplashScreen';
import { name as appName } from './app.json';
import { colors, Reducer } from './src/App';
import { _getAsyncStorage, _saveAsyncStorage } from './src/common/util';
import Strings from './src/common/Strings';
const store = createStore(Reducer);
const persistor = persistStore(store);

const fontConfig = {
    web: {
        regular: {
            fontFamily: 'SourceSansPro-Black',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'SourceSansPro-Black',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'SourceSansPro-Black',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'SourceSansPro-Black',
            fontWeight: 'normal',
        },
    },
    ios: {
        regular: {
            fontFamily: 'SFUIDisplay-Regular',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'SourceSansPro-Black',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'SourceSansPro-Black',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'SourceSansPro-Black',
            fontWeight: 'normal',
        },
    },
    android: {
        regular: {
            fontFamily: 'SF-UI-Display-Regular',
            fontWeight: 'normal',
        },
        medium: {
            fontFamily: 'SourceSansPro-Black',
            fontWeight: 'normal',
        },
        light: {
            fontFamily: 'SourceSansPro-Black',
            fontWeight: 'normal',
        },
        thin: {
            fontFamily: 'SourceSansPro-Black',
            fontWeight: 'normal',
        },
    },
};

const theme = {
    ...DefaultTheme,
    fonts: configureFonts(fontConfig),
    roundness: 4,
    colors: {
        ...DefaultTheme.colors,
        primary: colors.green,
        accent: '#f1c40f',
        text: colors.green,
    },
};



async function registerAppWithFCM() {
    // Register the device with FCM
    await messaging().registerDeviceForRemoteMessages();

    // Get the token
    const token = await messaging().getToken();
    console.log('Token : ', token);
    if (token) {
        await _saveAsyncStorage(Strings.KEY_TOKEN, token)
    }
    // const response = await _getAsyncStorage(Strings.KEY_TOKEN)
    // console.log(response);
}


// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message handled in the background!', remoteMessage);
// });

const Main = () => {

    //   registerAppWithFCM()

    //   //Handle Foreground message 
    //   messaging().onMessage(async remoteMessage => {
    //     console.log('Message handled in the Foreground!', remoteMessage);
    //   });

    return (
        <ReduxProvider store={store}>
            <PersistGate
                loading={null}
                persistor={persistor}>
                <PaperProvider theme={theme}>
                    <App />
                </PaperProvider>
            </PersistGate>
        </ReduxProvider>
    );
};

AppRegistry.registerComponent(appName, () => Main);


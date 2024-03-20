import React, { Component } from 'react';
import {
    View,
    BackHandler,
    Linking,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BankingHomeScreen from './BankingHomeScreen';
import Home from '../../assets/icons/dashboardIcons/ico-home.svg';
import Speak from '../../assets/icons/dashboardIcons/ico-speak.svg';
import Favorite from '../../assets/icons/dashboardIcons/ico-favorite.svg';
import History from '../../assets/icons/dashboardIcons/ico-history-arrow.svg';
import Qrscan from '../../assets/icons/dashboardIcons/ico-qr-scan.svg';
import {
    colors,
    strings,
    connect,
    mapStateToProps,
    mapDispatchToProps,
} from '../../App';
import { SafeAreaView } from 'react-native-safe-area-context';
import Snackbar from 'react-native-snackbar';
import FavoriteScreen from './FavoriteScreen';
import HistoryScreen from './HistoryScreen';
import { InstalledApps } from 'react-native-launcher-kit';
import { Dialog_AnyDeskDetect } from '../../components/Dialog_AnyDeskDetect';
import RNFS from 'react-native-fs'
import SpeakScreen from './SpeakScreen';
import ScanAndPay from './ScanAndPay';

const Tab = createBottomTabNavigator();


class Bottom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            doubleBackToExitPressedOnce: false,
            AnydeskDialogVisible: false,
        };  
    }

    componentDidMount() {
        this.handleBackPress = this.handleBackPress.bind(this);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    componentDidUpdate() {
        // this.CheckForAnyDesk();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    handleBackPress() {
        this.props.navigation.navigate('Home');
        if (this.state.doubleBackToExitPressedOnce) {
            BackHandler.exitApp();
            return true;
        }
        this.setState({ doubleBackToExitPressedOnce: true });
        Snackbar.show({
            text: 'Press back again to exit',
            duration: Snackbar.LENGTH_SHORT,
        });
        setTimeout(() => {
            this.setState({ doubleBackToExitPressedOnce: false });
        }, 2000);
        return true; 
    }

    CheckForAnyDesk() {

        // console.log('AnyDesk is Present');

        // console.log('AnyDesk ' + this.props.AnyDeskAllowed);

        // this.props.setAnyDeskAllowed(false)
        if (this.props.AnyDeskAllowed === false) {
            if (Platform.OS === 'android') {
                InstalledApps.getApps().map(temp => {
                    if (temp.packageName === 'com.anydesk.anydeskandroid') {
                        this.setState({ AnydeskDialogVisible: true })
                    }
                });
            }
            // if (Platform.OS === 'ios') {

            //     const getInstalledApps = async () => {
            //         try {
            //             const appsDirectory = '/Applications'; // iOS apps directory
            //             const apps = await RNFS.readDir(appsDirectory);
            //             const appNames = apps.map((app) => app.name);


            //             console.log("Applist--   " + appNames);
            //             return appNames;
            //         } catch (error) {
            //             console.error('Error reading installed apps:', error);
            //             return [];
            //         }
            //     };


            //     console.log("Applist   " + JSON.stringify(getInstalledApps()));

            // }

        }
    }


    PressUninstall = () => {
        this.props.setAnyDeskAllowed(false)
        this.setState({ AnydeskDialogVisible: false })
        const packageName = 'com.anydesk.anydeskandroid';
        // Linking.openSettings(packageName)
        //     .catch(() => console.warn('Unable to open app settings'));
        const playStoreLink = `https://play.google.com/store/apps/details?id=${packageName}`;
        Linking.openURL(playStoreLink).catch(err =>
            console.error('Error opening Play Store link:', err)
        );
    }

    PressYes = () => {
        this.props.setAnyDeskAllowed(true)
        this.setState({ AnydeskDialogVisible: false })
    }

    render() {
        return (
            <SafeAreaView
                edges={['bottom']}
                style={styles.mainContainer}>
                <Tab.Navigator initialRouteName={this.HomeScreen}
                    screenOptions={{
                        tabBarInactiveTintColor: colors.inActiveIcon,
                        tabBarShowLabel: true,
                        borderRadius: 10,
                        tabBarActiveTintColor: this.props.SecondaryColor,
                        tabBarLabelStyle: {
                            fontSize: 12,
                            fontFamily: strings.fontMedium
                        },
                        tabBarStyle: {
                            backgroundColor: colors.white,
                            height: 65,
                            paddingBottom: 10,
                            paddingTop: 10,
                            alignItems: 'center',                   
                        }

                    }}>
                    <Tab.Screen name={"Home"}
                        component={BankingHomeScreen}
                        initialParams={{ customData: this.props.route.params.userData }}
                        options={{
                            headerShown: false,
                            tabBarIcon: ({ focused }) => (
                                <View style={styles.tabBarIcon}>
                                    <Home height={25} width={25} color={focused ? this.props.SecondaryColor : colors.inActiveIcon} />
                                </View>
                            )
                        }}/>
                      <Tab.Screen name={"Speak"}
                      component={SpeakScreen}
                      initialParams={{ customData: this.props.route.params.userData }}
                        options={{
                            headerShown: false,
                            tabBarIcon: ({ focused }) => (
                                <View style={styles.speakIcon}>
                                    <Speak height={25} width={25} color={focused ? this.props.SecondaryColor : colors.inActiveIcon} />
                                </View>
                            )
                        }}/>
                    <Tab.Screen
                        name={"Scan"}
                        component={ScanAndPay}
                        initialParams={{ customData: this.props.route.params.userData }}
                        options={{
                            headerShown: false,
                            tabBarLabel: "",
                            tabBarIcon: ({ focused }) => (
                                <View style={styles.scanIcon}>
                                    <View style={[styles.scanView, { backgroundColor: focused ? colors.white : this.props.themeColor,  borderColor: focused ? this.props.themeColor : colors.white,}]}>
                                        <Qrscan height={38} width={38} color={focused ? this.props.themeColor : colors.white} />
                                    </View>
                                </View>
                            )
                        }} />

                    <Tab.Screen name={"Favourite"}
                        component={FavoriteScreen}
                        initialParams={{ customData: this.props.route.params.userData }}
                        options={{
                            headerShown: false,
                            tabBarIcon: ({ focused }) => (
                                <View style={styles.speakIcon}>
                                    <Favorite height={25} width={25} color={focused ? this.props.SecondaryColor : colors.inActiveIcon} />
                                </View>
                            )
                        }}
                    />
                    <Tab.Screen name={"History"}
                        component={HistoryScreen}
                        initialParams={{ customData: this.props.route.params.userData }}
                        options={{
                            headerShown: false,
                            tabBarIcon: ({ focused }) => (
                                <View style={styles.speakIcon}>
                                    <History height={25} width={25} color={focused ? this.props.SecondaryColor : colors.inActiveIcon} />
                                </View>
                            )
                        }}
                    />
                </Tab.Navigator>
                {
                    Dialog_AnyDeskDetect(this.state.AnydeskDialogVisible, this.PressUninstall, this.PressYes, this.props.PrimaryColor)

                }
            </SafeAreaView >
        );
    }
}
const styles = {
    mainContainer:
    {
        flex: 1,
         backgroundColor: colors.white
    },
    tabBarIcon:
    {
        alignItems: 'center',
    },
    speakIcon:
    {  
        position: 'absolute',
    },
    scanIcon:
    {
        backgroundColor: colors.white,
        padding: 5,
        borderRadius: 35,
    },
    scanView:
    {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Platform.OS == "android" ? 30 : 30,
    },
};
export default connect(mapStateToProps, mapDispatchToProps)(Bottom);


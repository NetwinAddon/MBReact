import React, { Component } from 'react';
import {
    Text,
    View,
    PermissionsAndroid,
    Alert,
    Platform,
    Linking,
} from 'react-native';
import {
    strings,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    width,
    RenderOkDialog,
} from '../../App';
import IcoStorage from '../../assets/icons/ico-storage.svg'
import FixedHeader from '../../components/FixedHeader';
import { check, RESULTS, PERMISSIONS, request } from "react-native-permissions";
import PermissionsCard from '../../components/PermissionsCard';

class StoragePermission extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        if (this.props.storagePermission) {
            this.props.navigation.replace('contactPermission')
        }
    }

    requestStoragePermission = async () => {
        try {
            if (Platform.OS === 'android' && Platform.Version < 33) {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission',
                        message: 'This app needs storage permission to save data.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Storage permission granted');
                    this.props.setStoragePermission(true)
                    this.props.navigation.replace('contactPermission')
                } else {
                    console.log('Storage permission denied');
                    Alert.alert(
                        'Storage Permission Required',
                        'This app requires storage permission to function properly. Please grant the storage permission.',
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    if (Platform.OS === 'android') {
                                        this.requestStoragePermission()
                                    }
                                },
                            },
                            {
                                text: 'Cancel',
                                style: 'cancel',
                            },
                        ]
                    );
                }
            } else if (Platform.OS === 'android' && Platform.Version == 33) {
                const granted = await PermissionsAndroid.request(
                    PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
                    {
                        title: 'Media images Permission',
                        message: 'This app needs storage permission to save data.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    });

                if (
                    granted === PermissionsAndroid.RESULTS.GRANTED
                ) {
                    console.log('Storage permission granted');
                    this.props.setStoragePermission(true);
                    this.props.navigation.replace('contactPermission');
                } else {
                    console.log('Storage permission denied');
                    Alert.alert(
                        'Storage Permission Required',
                        'This app requires storage permission to function properly. Please grant the storage permission.',
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    if (Platform.OS === 'android') {
                                        this.props.setStoragePermission(true)
                                        this.props.navigation.replace('contactPermission')
                                    }
                                },
                            },
                            {
                                text: 'Cancel',
                                style: 'cancel',
                                onPress: () => {
                                    console.log("permission rejected in 13")
                                },
                            },
                        ]
                    );
                }

            }
            else if (Platform.OS === 'android' && Platform.Version == 34) {
                const granted = await PermissionsAndroid.request(
                    PERMISSIONS.ANDROID.READ_MEDIA_IMAGES,
                    {
                        title: 'Media images Permission',
                        message: 'This app needs storage permission to save data.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    });

                if (
                    granted === PermissionsAndroid.RESULTS.GRANTED
                ) {
                    console.log('Storage permission granted 34');
                    this.props.setStoragePermission(true);
                    this.props.navigation.replace('contactPermission');
                } else {
                    console.log('Storage permission denied 34');
                    Alert.alert(
                        'Storage Permission Required',
                        'This app requires storage permission to function properly. Please grant the storage permission.',
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    if (Platform.OS === 'android') {
                                        this.requestStoragePermission();
                                    }
                                },
                            },
                            {
                                text: 'Cancel',
                                style: 'cancel',
                                onPress: () => {
                                    console.log("permission rejected in 13")
                                },
                            },
                        ]
                    );
                }

            }

            else if (Platform.OS === 'ios') {
                const status = await check(PERMISSIONS.IOS.MEDIA_LIBRARY);
                if (status === RESULTS.GRANTED) {
                    console.log('Storage permission granted');
                } else {
                    const requestStatus = await request(PERMISSIONS.IOS.MEDIA_LIBRARY);
                    if (requestStatus === RESULTS.GRANTED) {
                        console.log('Storage permission granted');
                    } else {
                        console.log('Storage permission denied');
                        Alert.alert(
                            'Storage Permission Required',
                            'This app requires storage permission to function properly. Please grant the storage permission.',
                            [
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        this.requestStoragePermission()
                                    },
                                },
                                {
                                    text: 'Cancel',
                                    style: 'cancel',
                                    onPress: () => {
                                        Alert.alert('App Closure',
                                            'This app requires storage permission to function properly. Please grant the permission or exit the app.',
                                            [{
                                                text: 'OK',
                                                onPress: () => {
                                                    if (Platform.OS === 'android') {
                                                        this.requestStoragePermission()
                                                        // IntentLauncherAndroid.startActivityAsync(
                                                        //   IntentLauncherAndroid.ACTION_APPLICATION_SETTINGS
                                                        // );
                                                    } else if (Platform.OS === 'ios') {
                                                        Linking.openSettings();
                                                    }
                                                },
                                            },]
                                        );
                                    },
                                },
                            ]
                        );
                    }
                }
            }
        } catch (error) {
            console.log('Error requesting storage permission:', error);
        }
    };

    noThanks() {
        if (this.state.isGranted) {
            console.log("is grated")
            this.props.navigation.replace('contactPermission')
        } else {
            Alert.alert('App Closure',
                'This app requires storage permission to function properly. Please grant the permission or exit the app.',
                [{
                    text: 'OK',
                    onPress: () => {
                        if (Platform.OS === 'android') {
                            this.requestStoragePermission()
                            // IntentLauncherAndroid.startActivityAsync(
                            //   IntentLauncherAndroid.ACTION_APPLICATION_SETTINGS
                            // );
                        } else if (Platform.OS === 'ios') {
                            Linking.openSettings();
                        }
                    },
                },]
            );
        }
    }
    
    forAllow() {
        this.requestStoragePermission()
    }

    render() {
        return (
            <View style={styles.mainView}>
                <FixedHeader/>
                <View style={styles.mainSubView}>
                    <View style={styles.oneView}>
                        <View style={styles.cameraView}>
                            <IcoStorage height={110} width={110} color={this.props.themeColor} />
                            <View sstyle={styles.viewLine}>
                            </View>
                        </View>
                        <Text style={[styles.permissionText, { color: this.props.textColor }]}>Storage permission</Text>
                        <View style={styles.permissionDescriptionView}>
                            <Text style={[styles.permissionDescription, { color: this.props.textColor }]}>{strings.storageAccess}</Text>
                        </View>
                    </View>
                    <PermissionsCard
              onPressAllow={() => this.forAllow()}
              onPressNo={() => this.noThanks()}
              color={this.props.themeColor}
              />
                </View>
                <RenderOkDialog />
            </View>
        );
    }
}
const styles = {
    mainView:
    {
        flex: 1,
        backgroundColor: 'white'
    },
    mainSubView:
    {
        flex: 1,
        alignItems: 'center',
    },
    oneView:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cameraView:
    {
        height: 120,
        width: 120,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    viewLine:
    {
        zIndex: -1,
        marginLeft: -90,
        height: 112,
        width: 112,
        borderRadius: 56,
        marginTop: 20
    },
    permissionText:
    {
        width: width,
        textAlign: 'center',
        fontFamily: strings.fontMedium,
        marginTop: 30,
        marginBottom: 15,
        fontSize: 26

    },
    permissionDescription:
    {
        textAlign: 'justify',
        fontFamily: strings.fontMedium,
        fontSize: 13,
    },
    permissionDescriptionView:
    {
        marginTop: 15,
        width: width - 60,
    },
    allowCard:
    {
        backgroundColor: 'gray',
        justifyContent: 'center',
        marginVertical: 15,
    },
    allowTouchable:
    {
        padding: 15,
        width: width - 45,
        justifyContent: 'center',
        borderRadius: 12,
        alignItems: 'center',
    },
    viewAllow:
    {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    allowText:
    {
        marginLeft: 7,
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: strings.fontMedium,
        fontSize: 17
    },
    noThanksTouchable:
    {
        marginBottom: 20,
        padding: 5
    },
    noThanksText:
    {
        fontFamily: strings.fontMedium,
        fontSize: 15,
    }
};



export default connect(mapStateToProps, mapDispatchToProps)(StoragePermission);
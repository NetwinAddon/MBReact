import React, { Component } from 'react';
import {
    Text,
    View,
    Alert,
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
import IcoDeviceInfo from '../../assets/icons/ico-deviceInfo.svg'
import FixedHeader from '../../components/FixedHeader';
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import uuid from 'react-native-uuid';
import PermissionsCard from '../../components/PermissionsCard';

class DeviceInfoPemission extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        if (this.props.deviceInfoPermisson) {
            this.props.navigation.replace('cameraPermission')
        }
        setTimeout(() => {
        }, 1000);
    }


    requestPhoneStatePermission = async () => {
        try {
            if (Platform.OS === 'android') {
                const permissionStatus = await check(PERMISSIONS.ANDROID.READ_PHONE_STATE);
                if (permissionStatus === RESULTS.GRANTED) {
                    console.log('Phone state permission already granted');
                    const deviceId = await DeviceInfo.getUniqueId();
                    this.props.setDeviceId(deviceId)
                    console.log('Device Props : ', this.props.deviceId);
                    console.log('Device ID:', deviceId);
                    // console.log('Unique ID:', uuid.v4());
                    this.props.setDeviceinfoPermission(true)
                    this.props.navigation.replace('cameraPermission')
                } else {
                    const requestStatus = await request(PERMISSIONS.ANDROID.READ_PHONE_STATE);
                    if (requestStatus === RESULTS.GRANTED) {
                        console.log('Phone state permission granted');
                        const deviceId = await DeviceInfo.getUniqueId();
                        this.props.setDeviceId(deviceId)
                        console.log('Device Props : ', this.props.deviceId);
                        // console.log('Unique ID:', uuid.v4());
                        this.props.setDeviceinfoPermission(true)
                        this.props.navigation.replace('cameraPermission')
                        console.log('Device ID:', deviceId);
                    } else {
                        console.log('Phone state permission denied');

                        Alert.alert(
                            'Phone state Permission Required',
                            'This app requires Phone state permission to function properly. Please grant the permission.',
                            [
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        if (Platform.OS === 'android') {
                                            this.requestPhoneStatePermission()
                                        } else if (Platform.OS === 'ios') {
                                            Linking.openSettings();
                                        }
                                    },
                                },
                                {
                                    text: 'Cancel',
                                    style: 'cancel',
                                    onPress: () => {
                                        Alert.alert(
                                            'Phone state Permission Required',
                                            'This app requires Phone state permission to function properly. Please grant the permission.',
                                            [
                                                {
                                                    text: 'OK',
                                                    onPress: () => {
                                                        this.requestPhoneStatePermission()
                                                        // Open the app settings
                                                        // Linking.openSettings();
                                                    },
                                                },
                                                {
                                                    text: 'Cancel',
                                                    style: 'cancel',
                                                    onPress: () => {
                                                        Alert.alert('App Closure',
                                                            'This app requires  Phone state permission to function properly. Please grant the permission or exit the app.',
                                                            [{
                                                                text: 'OK',
                                                                onPress: () => {
                                                                    if (Platform.OS === 'android') {
                                                                        this.requestPhoneStatePermission()
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
                                    },
                                },
                            ]
                        );
                    }
                }
            } else if (Platform.OS === 'ios') {
                const permissionStatus = await check(PERMISSIONS.IOS.READ_CONTACTS);
                if (permissionStatus === RESULTS.GRANTED) {
                    console.log('Phone state permission already granted');
                    const deviceId = await DeviceInfo.getUniqueId();
                    this.props.setDeviceId(deviceId)
                    // console.log('Unique ID:', uuid.v4());
                    console.log('Device Props : ', this.props.deviceId);
                } else {
                    const requestStatus = await request(PERMISSIONS.IOS.READ_CONTACTS);
                    if (requestStatus === RESULTS.GRANTED) {
                        console.log('Phone state permission granted');
                        const deviceId = await DeviceInfo.getUniqueId();
                        this.props.setDeviceId(deviceId)
                        // console.log('Unique ID:', uuid.v4());
                        console.log('Device Props : ', this.props.deviceId);
                    } else {
                        console.log('Phone state permission denied');
                        Alert.alert(
                            'Phone state Permission Required',
                            'This app requires Phone state permission to function properly. Please grant the permission.',
                            [
                                {
                                    text: 'OK',
                                    onPress: () => {
                                        if (Platform.OS === 'android') {
                                            this.requestPhoneStatePermission()
                                        }
                                    },
                                },
                                {
                                    text: 'Cancel',
                                    style: 'cancel',
                                    onPress: () => {
                                        Alert.alert(
                                            'Phone state Permission Required',
                                            'This app requires Phone state permission to function properly. Please grant the  permission.',
                                            [
                                                {
                                                    text: 'OK',
                                                    onPress: () => {
                                                        this.requestPhoneStatePermission()
                                                    },
                                                },
                                                {
                                                    text: 'Cancel',
                                                    style: 'cancel',
                                                    onPress: () => {
                                                        Alert.alert('App Closure',
                                                            'This app requires  Phone state permission to function properly. Please grant the permission or exit the app.',
                                                            [{
                                                                text: 'OK',
                                                                onPress: () => {
                                                                    if (Platform.OS === 'android') {
                                                                        this.requestPhoneStatePermission()
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
                                    },
                                },
                            ]
                        );
                    }
                }
            }
        } catch (error) {
            console.log('Error requesting phone state permission:', error);
        }
    };

    noThanks() {
        if (this.state.isGranted) {
            console.log("is grated")
            this.props.navigation.replace('cameraPermission')
        } else {
            Alert.alert('App Closure',
                'This app requires Phone state permission to function properly. Please grant the permission or exit the app.',
                [{
                    text: 'OK',
                    onPress: () => {
                        if (Platform.OS === 'android') {
                            this.requestPhoneStatePermission()
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
        this.requestPhoneStatePermission()
    }

    render() {
        return (
            <View style={styles.mainView}>
                <FixedHeader/>
                <View style={styles.mainSubView}>
                    <View style={styles.oneView}>
                        <View style={styles.cameraView}>
                            <IcoDeviceInfo height={110} width={110} color={this.props.themeColor} />
                            <View style={styles.viewLine}>
                            </View>
                        </View>
                        <Text style={[styles.permissionText, { color: this.props.textColor }]}>Phone state permission</Text>
                        <View style={styles.permissionDescriptionView}>
                            <Text style={[styles.permissionDescription, { color: this.props.textColor }]}>
                                {strings.deviceInfoAccess}
                            </Text>
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



export default connect(mapStateToProps, mapDispatchToProps)(DeviceInfoPemission);
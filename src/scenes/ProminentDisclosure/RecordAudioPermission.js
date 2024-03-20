import React, { Component } from 'react';
import {
    Text,
    View,
    PermissionsAndroid,
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
import IcoAudio from '../../assets/icons/ico-audio.svg'
import FixedHeader from '../../components/FixedHeader';
import { check, RESULTS, PERMISSIONS } from "react-native-permissions";
import PermissionsCard from '../../components/PermissionsCard';




class RecordAudioPermission extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        if (this.props.audioPermission) {
            this.props.navigation.replace('startScreen')
        }
    }

    requestAudioPermission = async () => {
        try {
            if (Platform.OS === 'android') {
                const audioPermission = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;
                const granted = await PermissionsAndroid.request(audioPermission);
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Audio recording permission granted');
                    this.props.setAudioPermission(true)
                    this.props.navigation.replace('startScreen')
                } else {
                    console.log('Audio recording permission denied');
                    this.showMandatoryPermissionAlert();
                }
            } else if (Platform.OS === 'ios') {
                const status = await check(PERMISSIONS.IOS.MICROPHONE);
                if (status === RESULTS.GRANTED) {
                    console.log('Audio recording permission granted');
                    this.props.setAudioPermission(true)
                    this.props.navigation.replace('startScreen')
                } else {
                    const requestStatus = await request(PERMISSIONS.IOS.MICROPHONE);
                    if (requestStatus === RESULTS.GRANTED) {
                        console.log('Audio recording permission granted');
                        this.props.setAudioPermission(true)
                        this.props.navigation.replace('startScreen')
                    } else {
                        console.log('Audio recording permission denied');
                        this.showMandatoryPermissionAlert();
                    }
                }
            }
        } catch (error) {
            console.log('Error requesting audio recording permission:', error);
        }
    };
    showMandatoryPermissionAlert = () => {
        Alert.alert(
            'Audio Recording Permission Required',
            'This app requires audio recording permission to function properly. Please grant the permission.',
            [
                {
                    text: 'OK',
                    onPress: () => {
                        if (Platform.OS === 'android') {
                            this.requestAudioPermission()
                        } else {
                            Linking.openURL('app-settings:');
                        }
                    },
                },

            ]
        );
    };

    noThanks() {
        if (this.state.isGranted) {
            console.log("is grated")
            this.props.navigation.reset({
                index: 0,
                routes: [{ name: 'startScreen' }],
            });
        } else {
            Alert.alert('App Closure',
                'This app requires audio recording permission to function properly. Please grant the permission or exit the app.',
                [{
                    text: 'OK',
                    onPress: () => {
                        if (Platform.OS === 'android') {
                            this.requestAudioPermission()
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
        this.requestAudioPermission()
    }

    render() {
        return (
            <View style={styles.mainView}>
                <FixedHeader />
                <View style={styles.mainSubView}>
                    <View style={styles.oneView}>
                        <View style={styles.cameraView}>
                            <IcoAudio height={110} width={110} color={this.props.themeColor} />
                            <View style={styles.viewLine}>
                            </View>
                        </View>
                        <Text style={[styles.permissionText, { color: this.props.textColor }]}>Record audio permission</Text>
                        <View style={styles.permissionDescriptionView}>
                            <Text style={[styles.permissionDescription, { color: this.props.textColor }]}>
                                {strings.audioAccess}
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



export default connect(mapStateToProps, mapDispatchToProps)(RecordAudioPermission);
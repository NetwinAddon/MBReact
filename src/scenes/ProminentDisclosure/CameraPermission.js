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
import IcoCamera from '../../assets/icons/ico-Camera.svg'
import FixedHeader from '../../components/FixedHeader';
import { request, PERMISSIONS } from 'react-native-permissions';
import PermissionsCard from '../../components/PermissionsCard';

class CameraPermission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isGranted: false
    };
  }

  componentDidMount() {
    if (this.props.cameraPermission) {
      console.log("Comp did mount")
      this.props.navigation.replace('locationPermission')
    }
  }

  requestCameraPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs camera permission to take photos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission granted');
          this.props.setCameraPermission(true)
          this.props.navigation.replace('locationPermission')
        } else {
          console.log('Camera permission denied');
          Alert.alert(
            'Camera Permission Required',
            'This app requires camera permission to function. Please grant the camera permission.',
            [
              {
                text: 'OK',
                onPress: () => {
                  if (Platform.OS === 'android') {

                    this.requestCameraPermission();
                  } else if (Platform.OS === 'ios') {
                    this.requestCameraPermission();
                  }
                },
              },
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => {
                  Alert.alert('App Closure',
                    'This app requires camera permission to function properly. Please grant the permission or exit the app.',
                    [{
                      text: 'OK',
                      onPress: () => {
                        if (Platform.OS === 'android') {
                          this.requestCameraPermission()
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
      } else if (Platform.OS === 'ios') {
        const status = await check(PERMISSIONS.IOS.CAMERA);
        if (status === RESULTS.GRANTED) {
          console.log('Camera permission granted');
          this.props.navigation.replace('locationPermission')
        } else {
          const requestStatus = await request(PERMISSIONS.IOS.CAMERA);
          if (requestStatus === RESULTS.GRANTED) {
            console.log('Camera permission granted');
            this.props.navigation.replace('locationPermission')
          } else {
            console.log('Camera permission denied');
            Alert.alert(
              'Camera Permission Required',
              'This app requires camera permission to function. Please grant the camera permission in the app settings.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    this.requestCameraPermission()
                  },
                },
                {
                  text: 'Cancel',
                  style: 'cancel',
                  onPress: () => {
                    this.props.navigation.replace('locationPermission')
                  },
                },
              ]
            );
          }
        }
      }
    } catch (error) {
      console.log('Error requesting camera permission:', error);
    }
  };

  noThanks() {
    if (this.state.isGranted) {
      console.log("is grated")
      this.props.navigation.replace('locationPermission')
    } else {
      Alert.alert('App Closure',
        'This app requires Camera permission to function properly. Please grant the permission or exit the app.',
        [{
          text: 'OK',
          onPress: () => {
            if (Platform.OS === 'android') {
              this.requestCameraPermission()
            } else if (Platform.OS === 'ios') {
              Linking.openSettings();
            }
          },
        },]
      );
    }
  }

  forAllow() {
    this.requestCameraPermission()
  }
  render() {
    return (
      <View style={styles.mainView}>
        <FixedHeader />
        <View style={styles.mainSubView}>
          <View style={styles.oneView}>
            <View style={styles.cameraView}>
              <IcoCamera height={110} width={110} color={this.props.themeColor} />
              <View style={[styles.viewLine, { backgroundColor: this.props.themeColor + '1A' }]}>
              </View>
            </View>
            <Text style={[styles.permissionText, { color: this.props.textColor }]}>Camera permission</Text>
            <View style={styles.permissionDescriptionView}>
              <Text style={[styles.permissionDescription, { color: this.props.textColor }]}>
                {strings.CameraAccess}
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


export default connect(mapStateToProps, mapDispatchToProps)(CameraPermission);
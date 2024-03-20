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
import IcoLocation from '../../assets/icons/ico-Location.svg'
import FixedHeader from '../../components/FixedHeader';
import { check, RESULTS, PERMISSIONS, requestMultiple } from "react-native-permissions";
import Geolocation from '@react-native-community/geolocation';
import PermissionsCard from '../../components/PermissionsCard';

class LocationPermission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isGranted: false
    };
  }

  componentDidMount() {
    if (this.props.locationPermission) {
      this.props.navigation.replace('storagePermission')
    }
    setTimeout(() => {
    }, 1000);
  }


  requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs location permission to provide accurate data.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.setState({ isGranted: true })
          console.log('Location permission granted');
          Geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              console.log('Latitude:', latitude);
              console.log('Longitude:', longitude);
              this.props.setDeviceLatitude(latitude)
              this.props.setDeviceLongitude(longitude)
              console.log("Props are ==========", this.props)
            },
            (error) => {
              console.log('Error obtaining location:', error);
            },
            { enableHighAccuracy: false, timeout: 30000, maximumAge: 10000 }
          );
          this.props.setLocationPermission(true)
          this.props.navigation.replace('storagePermission')
        } else {
          console.log('Location permission denied');
          Alert.alert(
            'Location Permission Required',
            'This app requires location permission to provide accurate data. Please grant the location permission in the app settings.',
            [
              {
                text: 'OK',
                onPress: () => {
                  if (Platform.OS === 'android') {
                    this.requestLocationPermission()
                    // IntentLauncherAndroid.startActivityAsync(
                    //   IntentLauncherAndroid.ACTION_APPLICATION_SETTINGS
                    // );
                  } else if (Platform.OS === 'ios') {
                    Linking.openSettings();
                  }
                },
              },
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => {
                  Alert.alert('App Closure',
                    'This app requires location permission to function properly. Please grant the permission or exit the app.',
                    [{
                      text: 'OK',
                      onPress: () => {
                        // Open the app settings
                        if (Platform.OS === 'android') {
                          this.requestLocationPermission()
                        } else if (Platform.OS === 'ios') {
                          Linking.openSettings();
                        }
                      },
                    },]
                  );
                }
              },
            ]
          );
        }
      } else if (Platform.OS === 'ios') {
        const status = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (status === RESULTS.GRANTED) {
          console.log('Location permission granted');
        } else {
          const requestStatus = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
          if (requestStatus === RESULTS.GRANTED) {
            console.log('Location permission granted');
          } else {
            console.log('Location permission denied');
            Alert.alert(
              'Location Permission Required',
              'This app requires location permission to provide accurate data. Please grant the location permission.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    this.requestLocationPermission()
                  },
                },
                {
                  text: 'Cancel',
                  style: 'cancel',

                },
              ]
            );
          }
        }
      }
    } catch (error) {
      console.log('Error requesting location permission:', error);
    }
  };


  forAllow() {
    this.requestLocationPermission()
  }

  noThanks() {
    if (this.state.isGranted) {
      console.log("is grated")
      this.props.navigation.replace('storagePermission')
    } else {
      Alert.alert('App Closure',
        'This app requires location permission to function properly. Please grant the permission or exit the app.',
        [{
          text: 'OK',
          onPress: () => {
            if (Platform.OS === 'android') {
              this.requestLocationPermission()
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

  render() {
    return (
      <View style={styles.mainView}>
        <FixedHeader />
        <View style={styles.mainSubView}>
          <View style={styles.oneView}>
            <View style={styles.cameraView}>
              <IcoLocation height={110} width={110} color={this.props.themeColor} />
              <View style={styles.viewLine}>
              </View>
            </View>
            <Text style={[styles.permissionText, { color: this.props.textColor }]}>Location permission</Text>
            <View style={styles.permissionDescriptionView}>
              <Text style={[styles.permissionDescription, { color: this.props.textColor }]}>
                {strings.locationAccess}
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



export default connect(mapStateToProps, mapDispatchToProps)(LocationPermission);
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
import IcoContanct from '../../assets/icons/ico-contact.svg'
import FixedHeader from '../../components/FixedHeader';
import Contacts from 'react-native-contacts';
import PermissionsCard from '../../components/PermissionsCard';


class ContactPermission extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    if (this.props.contactPermission) {
      this.props.navigation.replace('recordAudioPermission')
    }
    setTimeout(() => {
    }, 1000);
  }

  requestContactPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contact Permission',
            message: 'This app requires access to your contacts.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Contact permission granted');
          this.fetchContacts();
          this.props.setContactPermission(true)
          this.props.navigation.replace('recordAudioPermission')

        } else {
          console.log('Contact permission denied');
          Alert.alert(
            'Contact Permission Required',
            'This app requires contact permission to function properly. Please grant the contact permission in the app settings.',
            [
              {
                text: 'OK',
                onPress: () => {
                  if (Platform.OS === 'android') {
                    this.requestContactPermission()
                  }
                },
              },
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => {
                  Alert.alert('App Closure',
                    'This app requires contact permission to function properly. Please grant the permission or exit the app.',
                    [{
                      text: 'OK',
                      onPress: () => {
                        if (Platform.OS === 'android') {
                          this.requestContactPermission()
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
        const status = await check(PermissionsIOS.CONTACTS);
        if (status === RESULTS.GRANTED) {
          console.log('Contact permission granted');
          fetchContacts();
        } else {
          const requestStatus = await request(PermissionsIOS.CONTACTS);
          if (requestStatus === RESULTS.GRANTED) {
            console.log('Contact permission granted');
            fetchContacts();
          } else {
            console.log('Contact permission denied');
            Alert.alert(
              'Contact Permission Required',
              'This app requires contact permission to function properly. Please grant the contact permission.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    this.requestContactPermission()

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
      console.log('Error requesting contact permission:', error);
    }
  };


  fetchContacts = () => {
    Contacts.getAll().then((contacts) => {
    }).catch((e) => { console.log('error reading contacts') });
  };


  noThanks() {
    if (this.state.isGranted) {
      console.log("is grated")
      this.props.navigation.replace('recordAudioPermission')
    } else {
      Alert.alert('App Closure',
        'This app requires contact permission to function properly. Please grant the permission or exit the app.',
        [{
          text: 'OK',
          onPress: () => {
            if (Platform.OS === 'android') {
              this.requestContactPermission()
            } else if (Platform.OS === 'ios') {
              Linking.openSettings();
            }
          },
        },]
      );
    }
  }
  forAllow() {
    this.requestContactPermission()
  }
  render() {
    return (
      <View style={styles.mainView}>
        <FixedHeader />
        <View style={styles.mainSubView}>
          <View style={styles.oneView}>
            <View style={styles.cameraView}>
              <IcoContanct height={110} width={110} color={this.props.themeColor} />
              <View style={[styles.viewLine, { backgroundColor: this.props.themeColor + '1A' }]}>
              </View>
            </View>
            <Text style={[styles.permissionText, { color: this.props.textColor }]}> Read contact permission</Text>
            <View style={styles.permissionDescriptionView}>
              <Text style={[styles.permissionDescription, { color: this.props.textColor }]}>
                {strings.contactAccess}
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
export default connect(mapStateToProps, mapDispatchToProps)(ContactPermission);
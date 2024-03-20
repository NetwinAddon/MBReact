import React, { Component } from 'react';
import {
  View,
  TextInput,
  Animated,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Text } from 'react-native-paper';
import SplashScreen from './Launch/SplashScreen';
const { width, height } = Dimensions.get('screen');

import {
  colors,
  strings,
  connect,
  mapStateToProps,
  mapDispatchToProps,
  log,
  jsonLog,
  okDialog,
  RenderOkDialog,
  API,
  RenderLoader,
  constants,
  sendData,
} from '../App';

class ForgotPasswordScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      splashFinish: true,
      email: __DEV__ ? 'developer@telemar.it' : '',
    };

    this.isLOggedIn();
    this.resetBoxFlex = new Animated.Value(-1 * height);
    Animated.timing(this.resetBoxFlex, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }

  isLOggedIn() {
    if (this.props.resetStatus) {
      log('user is logged in ' + this.props.resetStatus);
      this.props.navigation.replace('homeScreen');
    } else log('user is not logged  in ' + this.props.resetStatus);
  }
  resetContainer = () => {
    return (
      <Animated.View
        onLayout={event => {
          var { x, y, width, height } = event.nativeEvent.layout;
        }}
        style={[styles.animatedView, { bottom: this.resetBoxFlex ? this.resetBoxFlex : -1 * height,}]}>
        <View
          style={styles.animatedViewContainer}>
          <View style={styles.emailContainer}>
            <Text style={styles.label}>{strings.email}</Text>
          </View>
          <View style={styles.emailInnerContainer}>
            <TextInput
              style={styles.inputs}
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
              autoFocus={true}
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            this.reset();
          }}
          style={styles.resetContainer}>
          <Text style={styles.resetText}>{strings.resetPasswordButton}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  reset() {
    log('reset');
    const { email, password, confirmPassword } = this.state;
    if (email == '') return okDialog(this, strings.emailRequired);
    if (!constants.emailRegEx.test(email))
      return okDialog(this, strings.invalidEmail);
    const data = {
      email,
      action: 'forgot_password',
    };
    sendData(this, 'post', API.passwordReset, data, this.resetCallback);
  }

  resetCallback(obj, response) {
    log('reset callback');
    jsonLog(response);
    const { status, message, data } = response;
    if (!status) {
      return okDialog(obj, message);
    }
    return okDialog(obj, data);
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={[styles.mainContainer, {justifyContent: 'space-between'}]}>
          <SplashScreen />
          {this.resetContainer()}
        </View>
        <View style={styles.viewContainer}>
          <TouchableOpacity
            style={styles.touchableContainer}
            onPress={() =>
              this.props.navigation.replace('loginScreen', { navigate: true })}>
            <Text style={[styles.textContainer, { backgroundColor: colors.themeColor,}]}>{'<'}</Text>
          </TouchableOpacity>
          <View style={styles.fogetPasswordScreeNameView}>
            <Text style={styles.fogetPasswordScreeNameText}>
              {strings.forgetPasswordScreenName}
            </Text>
          </View>
        </View>
        <RenderOkDialog />
        <RenderLoader />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputs: {
    backgroundColor: 'white',
    margin: 3,
    height: 33,
    borderRadius: 15,
    paddingVertical: 3,
    paddingHorizontal: 10,
    fontFamily: 'SourceSansPro-Black',
    marginVertical: 10,
  },
  label: 
  { color: 'white', 
  fontSize: 18, 
  marginVertical: 10 
},
  checkboxContainer: {
      flexDirection: 'row',
      marginBottom: 10,
      marginTop: 10,
  },
  checkbox: {
      alignSelf: 'center',
      borderStyle: 'dotted'
  },
  label: {
      margin: 8,
      fontFamily: strings.fontBold,
  },
  mainContainer:
  {
      flex: 1
  },
  viewContainer:
  {
    position: 'absolute',
    left: 0,
    top: 10,
    flexDirection: 'row',
    width,
    flex: 1,
  },
  touchableContainer:
  {
    marginLeft: 15 
  },
  textContainer:
  {
    fontSize: 30,
    fontWeight: 'bold',
    borderRadius: 50,
    width: 47,
    height: 47,
    textAlign: 'center',
    paddingBottom: 7,
  },
  fogetPasswordScreeNameView:
  {
    justifyContent: 'center',
    marginHorizontal: 15,
    flex: 1,
    backgroundColor: colors.themeColor,
    borderRadius: 15,
  },
  fogetPasswordScreeNameText:
  {
    textAlign: 'center',
    color: colors.white,
    fontSize: 18,
  },
  animatedView:
  {
    position: 'absolute',
    width,
    backgroundColor: 'red',
    padding: 15,
  },
  animatedViewContainer:
  {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
  },
  emailContainer:
  {
    flex: 3, 
    justifyContent: 'space-between'
  },
  emailInnerContainer:
  {
    flex: 7 
  },
  resetContainer:
  {
    flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 10,
  },
  resetText:
  {
    color: 'white',
    textAlign: 'center',
    borderColor: colors.white,
    borderRadius: 30,
    borderWidth: 1,
    paddingHorizontal: 40,
    paddingVertical: 8,
    fontWeight: 'bold',
    fontSize: 18,
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ForgotPasswordScreen);

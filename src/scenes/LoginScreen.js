import React, { Component } from 'react';
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Text } from 'react-native-paper';
import {
  colors,
  strings,
  assets,
  connect,
  mapStateToProps,
  mapDispatchToProps,
  log,
  jsonLog,
  okDialog,
  RenderOkDialog,
  loading,
  RenderLoader,
  constants,
  device_type,
  navigation
} from '../App';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      splashFinish: false,
      email: __DEV__ ? 'developer123@telemar.it' : '',
      password: __DEV__ ? 'Test@123' : '',
      secureTextEntry: true,
      rememberMe: false
    };

    if (this.isLOggedIn()) return;
  }

  isLOggedIn() {
    if (this.props.loginStatus) {
      this.props.navigation.replace('homeScreen');
      return true;
    } else log('user is not logged  in ' + this.props.loginStatus);
    return false;
  }
  loginContainer = () => {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>
          {'Login'}
        </Text>
      </View>
    );
  };

  _userLogin = async () => {
    const { email, password } = this.state;
    if (email == '' && password == '')
      return okDialog(this, strings.allFeildsRequired);
    if (email == '') return okDialog(this, strings.emailRequired);
    if (!constants.emailRegEx.test(email))
      return okDialog(this, strings.invalidEmail);
    if (password == '') return okDialog(this, strings.passwordRequired);

    loading.start(this);
    const data = {
      email,
      password,
      action: 'login',
      device_type,
      device_token: this.props.fcmToken,
    };
    setTimeout(() => {
      loading.stop(this);
      this.props.setLoginStatus(true)
      this.props.setUserId(this.state.email)
      this.props.navigation.replace('homeScreen');
    }, 3000);
  }

  loginCallback(obj, response) {
    jsonLog(data);
    const { status, message, data } = response;
    if (!status) return okDialog(obj, message);
    if (status) {
      obj.props.setUserId(data.ID);
      if (obj.state.checked) obj.props.setLoginStatus(true);
      obj.props.navigation.replace('homeScreen');
    }
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.innerContainer}>
          <Image
            source={assets.splash}
            style={styles.imgStyle}
            resizeMode="contain" />
        </View>
        <View style={styles.innerMainContainer}>
          <View style={styles.inputs}>
            <Image source={assets.checked} resizeMode='contain' style={styles.innerImgStyleOne} />
            <TextInput
              placeholder={'Enter Email'}
              defaultValue={this.state.email}
              placeholderTextColor={colors.black}
              style={styles.emailTouchable}
              onChangeText={(text) => { this.setState({ email }) }}
            />
          </View>
          <View style={styles.inputs} >
            <Image source={assets.checked} resizeMode='contain' style={styles.innerImgStyleTwo} />
            <TextInput
              placeholder={'Enter Password'}
              secureTextEntry={this.state.secureTextEntry}
              defaultValue={this.state.password}
              placeholderTextColor={colors.black}
              style={styles.emailTouchable}
              onChangeText={(text) => { this.setState({ password }) }}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              this._userLogin()
            }}
            style={styles.login} >
            <Text style={styles.loginTextStyle}>{strings.logeIn}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.passwordContainer}>
          <View style={styles.passwordInnerContainer}>
            <TouchableOpacity
              onPress={async () => {
                this.setState({ rememberMe: !this.state.rememberMe });
              }}
              style={styles.rememberMeTouchable}>
              <View
                style={[styles.rememberMeView, {  backgroundColor: this.state.rememberMe ? colors.white : colors.white, borderColor: colors.themeColor,}]}>
                {this.state.rememberMe && (
                  <Image
                    source={assets.checked}
                    style={styles.checkedBoxImg}
                  />
                )}
              </View>
              <Text
                 style={styles.keepLoggedInText}>
                {strings.keepLoggedIn}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(this, 'forgotPasswordScreen')
              }>
              <Text style={styles.forgotPasswordText}>
                {strings.forgotPassword}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <RenderOkDialog />
        <RenderLoader />
      </View>
    );
  }
}

const styles = {
  inputs: { flexDirection: 'row', height: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 0.3, borderRadius: 5, marginTop: 15 },
  login: { alignSelf: 'center', height: 40, marginTop: 15, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.themeColor },
  mainContainer:
  {
    flex: 1,
     backgroundColor: colors.white
  },
  innerContainer:
  {
  
    flex: 0.3, justifyContent: 'center' 
  } ,
  imgStyle:
  {
    width: 350,
    height: 250,
    alignSelf: 'center',
  },
  innerMainContainer:
  {
    flex: 0.3, 
    justifyContent: 'center',
     marginHorizontal: 10 
  }, 
  innerImgStyleOne:
  {
    height: 25,
     width: 25, 
     marginLeft: 10, 
     tintColor: colors.themeColor
  },
  innerImgStyleTwo:
  {
    height: 25,
     width: 25, 
     marginLeft: 10 
  },
  emailTouchable:
  {
    flex: 1, 
    marginLeft: 10, 
    backgroundColor: 'black'
  },
  loginTextStyle:
  {
    marginHorizontal: 50, 
    color: colors.white
  },
  passwordContainer:
  {
    flex: 0.3, 
    marginHorizontal: 10 
  },
  passwordInnerContainer:
  {
    flexDirection: 'row',
     alignItems: 'center'
  },
  rememberMeTouchable:
  {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 0,
    marginTop: 5,
    flex: 1
  },
  rememberMeView:
  {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  checkedBoxImg:
  {
    width: 20,
    height: 20,
  },
  keepLoggedInText:
  {
    paddingBottom: 5, 
    paddingLeft: 10, 
    color: colors.black 
  },
  forgotPasswordText:
  {
    color: colors.black 
  }

};
  
export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);

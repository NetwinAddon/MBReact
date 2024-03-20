import React, { Component } from 'react';
import Navigation from './src/Navigation';

import { _getAsyncStorage, _saveAsyncStorage } from './src/common/util';
import {
  connect,
  mapStateToProps,
  mapDispatchToProps,
  jsonLog,
  jsonEncode,
  appThemeColor,
  appTextColor,
  strings,
  colors
} from './src/App';
import { Platform } from 'react-native';

async function registerAppWithFCM(obj) {
  // Register the device with FCM
  await messaging().registerDeviceForRemoteMessages();
  // Get the token
  const token = await messaging().getToken();
  //console.log('Token : ', token);
  if (token) {
    obj.props.setFcmToken(token);
  }
}

// messaging().onMessage(async remoteMessage => {
//   //console.log('Message handled in the Foreground!', remoteMessage);
// });

class App_ extends Component {
  constructor(props) {
    super(props);

    this.state = {};
    // registerAppWithFCM(this);

  }
  componentDidMount() {
    // this.props.setThemeColor( appThemeColor(colors.themeColor))
    // this.props.setTextColor( appTextColor(colors.themeColor))

   }
  render() {
    return < Navigation/>;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App_);




import React, { Component } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  Image,
  ImageBackground,
} from 'react-native';
import {
  strings,
  connect,
  mapStateToProps,
  mapDispatchToProps,
  appThemeConfiguration,
} from '../../App';
import Footer from '../../assets/icons/footer.svg'
import { InstalledApps } from 'react-native-launcher-kit';
import RNScreenshotPrevent from 'react-native-screenshot-prevent';
import DeviceInfo from 'react-native-device-info';
import Snackbar from 'react-native-snackbar';
import { _toEncrypt, decryptData } from '../../common/util';
import RNFS from 'react-native-fs';
import Constants from '../../common/Constants';
import APIUrlConstants from '../../common/APIUrlConstants';

class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      GMST_CODE: this.props.gmstCode,
      fileContent: '',
      bgImages: appThemeConfiguration(strings.ThemeOne).splash
    };


  }

  componentDidMount() {
    this.CodeEncript();
    const filePath = RNFS.ExternalDirectoryPath + '/ReactMBConfig.txt';
    RNFS.readFile(filePath, 'utf8')
      .then(content => {
        this.setState({ fileContent: content });
        this.CodeDecript(this.state.fileContent);
      })
      .catch(error => {
      });

    const AppTheme = this.props.AppThemeSet
    if (AppTheme === null || AppTheme === undefined || AppTheme.trim() === "") {
      this.props.setAppTheme(strings.ThemeOne)
      this.setState({ bgImages: appThemeConfiguration(strings.ThemeOne).splash })
      this.props.setThemeColor(appThemeConfiguration(strings.ThemeOne).themeColor)
      this.props.setTextColor(appThemeConfiguration(strings.ThemeOne).textColor)
      this.props.setPrimaryColor(appThemeConfiguration(strings.ThemeOne).PrimaryColor)
      this.props.setSecondaryColor(appThemeConfiguration(strings.ThemeOne).SecondaryColor)
    }
    else {
      this.setState({ bgImages: appThemeConfiguration(this.props.AppThemeSet).splash })
      this.props.setThemeColor(appThemeConfiguration(this.props.AppThemeSet).themeColor)
      this.props.setTextColor(appThemeConfiguration(this.props.AppThemeSet).textColor)
      this.props.setPrimaryColor(appThemeConfiguration(this.props.AppThemeSet).PrimaryColor)
      this.props.setSecondaryColor(appThemeConfiguration(this.props.AppThemeSet).SecondaryColor)
    }
    this.checkRootStatus(); 
  }

  checkAppInstall = async () => {
    let vysorPackageName;
    InstalledApps.getApps().map(temp => {
      if (temp.packageName === 'com.koushikdutta.vysor') {
        vysorPackageName = temp.packageName;
      }
    });
    if (vysorPackageName === 'com.koushikdutta.vysor') {
      RNScreenshotPrevent.enableSecureView();
    }
    else {
      RNScreenshotPrevent.disableSecureView();
    }
  }

  checkRootStatus = async () => {
    try {
      const isRooted = await DeviceInfo.isRooted;
      if (isRooted) {
        Snackbar.show({ text: "Rooted Device", duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
      }
      else {
        setTimeout(() => {
          const GMST_CODE = this.state.GMST_CODE
          const BankCd = this.props.BranchCode
          if (BankCd !== "" && (GMST_CODE === null || GMST_CODE === undefined || GMST_CODE.trim() === "")) {
            this.props.navigation.replace('loginType')

          }
          else if (GMST_CODE === null || GMST_CODE === undefined || GMST_CODE.trim() === "") {

            this.props.navigation.replace('deviceInfoPemission')
          }
          else {
            this.props.navigation.replace('mainLogin')
          }
        }, 3000);
      }
    } catch (error) {
    }
  };

  CodeEncript = async () => {
    const Resp = { "AUTOMATION": "TRUE" }
    let resp = await _toEncrypt(Resp)
  }

  CodeDecript = async (value) => {
    var responseData = await decryptData(value)
    var newRes = responseData.slice(16)
    const link = APIUrlConstants.BASE_URL;
    const parts = link.split(':');
    const Domain = parts[1].replaceAll("/", "");

    const TesterPortList = [
      "192.168.33.29",
      "192.168.33.19",
      "192.168.40.8",
      "192.168.40.14",
      "192.168.40.19",
    ];

    var isIPmatch = false;
    if (TesterPortList.includes(Domain)) {
      isIPmatch = true;
    }

    if (newRes === "AUTOMATION13022024#Y"  && isIPmatch) 
    {
      Constants.AUTOMATION_MODE = 'Y'
    }

  }


  render() {
    return (
      <View style={styles.mainView}>
        <ImageBackground style={styles.mainView}
          source={this.state.bgImages}
          resizeMode='contain'
        >
          <SafeAreaView
           style={styles.mainView}
          >
            <View style={styles.mainSubView}>
              <Image
                source={require('../../assets/images/new_logoo.png')}
                style={styles.imagView}
                resizeMode={Platform.OS === "android" ? 'center' : 'contain'}/>
              <Text style={styles.companyTitle}>
                {strings.companyName}
              </Text>
            </View>
            <View style={styles.footerView}>
              <Footer height={50} width={300} />
            </View>
          </SafeAreaView>
        </ImageBackground>
      </View>


    );
  }
}
const styles = {
  mainView:
  {
      flex: 1,
  },
  mainSubView:
  {
    flex: 1, 
    justifyContent: 'center',
     alignItems: 'center'
  },
  imagView:
  {
    height: 72,
    width: 196,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
    marginBottom: 5,
  },
  imgStyle:
  {
      height: 72,
      width: 196,
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 10,
  },
  companyTitle:
  {
    color: 'black',
    textAlign: 'center',
    fontFamily: strings.fontMedium,
    marginTop: 21
  },
  footerView:
  {
    alignItems: 'center', 
  },
};
export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);

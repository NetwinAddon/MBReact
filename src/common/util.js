import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform, Dimensions, Linking, StatusBar } from 'react-native';
import strings from './Strings';

// dasboardIcons

import MyAcc from '../assets/icons/dashboardIcons/ico-my-account.svg';
import MiniStatement from '../assets/icons/dashboardIcons/ico-mini-statements.svg';
import DownloadStatemet from '../assets/icons/dashboardIcons/ico-download-statement.svg';
import MPassbook from '../assets/icons/dashboardIcons/ico-m-passbook.svg';
import OpenAcc from '../assets/icons/dashboardIcons/ico-open-account.svg';
import Renew from '../assets/icons/dashboardIcons/ico-renew.svg';
import PrematuredEnqiry from '../assets/icons/dashboardIcons/ico-prematured-enquiry.svg';
import CloseAcc from '../assets/icons/dashboardIcons/ico-close-account.svg'

import OwnAcc from '../assets/icons/dashboardIcons/ico-own-account.svg';
import SameBankOtrAcc from '../assets/icons/dashboardIcons/same-bank-transfer.svg';
import QuickTransfer from '../assets/icons/dashboardIcons/ico-24x7-quick-transfer.svg';
import NeftEreq from '../assets/icons/dashboardIcons/ico-neft-e-request.svg';
import AddSI from '../assets/icons/dashboardIcons/ico-add-standing-instructions.svg';
import ViewSI from '../assets/icons/dashboardIcons/ico-view-standing-instructions.svg';
import ImpsStatus from '../assets/icons/dashboardIcons/ico-imps-txt-status.svg'

import AtmBal from '../assets/icons/dashboardIcons/ico-atm-card-balance.svg';
import AtmCardFT from '../assets/icons/dashboardIcons/ico-atm-card-fund-transf.svg';
import AtmLinkMobile from '../assets/icons/dashboardIcons/ico-atm-link-mobile.svg';
import CardBlk from '../assets/icons/dashboardIcons/ico-card-block.svg';
import CardUnblock from '../assets/icons/dashboardIcons/ico-card-unblock.svg';
import AtmMiniState from '../assets/icons/dashboardIcons/ico-atm-mini-statement.svg';
import AtmCardInfo from '../assets/icons/dashboardIcons/ico-atm-card-information.svg'

import Prepaid from '../assets/icons/dashboardIcons/ico-prepaid.svg';
import Postpaid from '../assets/icons/dashboardIcons/ico-postpaid.svg';
import BillDTH from '../assets/icons/dashboardIcons/ico-dth.svg';
import DataCard from '../assets/icons/dashboardIcons/ico-data-card.svg';
import Landline from '../assets/icons/dashboardIcons/ico-landline.svg';
import History from '../assets/icons/dashboardIcons/ico-history.svg';
import CarLoan from '../assets/icons/dashboardIcons/icon-car-loan.svg';
import GoldLoan from '../assets/icons/dashboardIcons/icon-gold-loan.svg';
import InterestRateCal from '../assets/icons/dashboardIcons/icon-interest-rate-calculator.svg';
import LoanEMICal from '../assets/icons/dashboardIcons/icon-loan-emi-calculator.svg';



import ElectricityBill from '../assets/icons/dashboardIcons/ico-electricity-bill.svg';
import MobileBill from '../assets/icons/dashboardIcons/ico-mobile-bill.svg';
import BbpsDth from '../assets/icons/dashboardIcons/ico-dth.svg';
import TxnHistory from '../assets/icons/dashboardIcons/ico-txn-history.svg';
import ComplainHistory from '../assets/icons/dashboardIcons/ico-complaint-history.svg';
import AgntComplaint from '../assets/icons/dashboardIcons/ico-agent-complaint.svg';
import BillerComplaint from '../assets/icons/dashboardIcons/ico-biller-complaints.svg';
import OwnFundTransfer from '../assets/icons/dashboardIcons/own_fund_transfer.svg';
import TransactionImps from '../assets/icons/dashboardIcons/transaction_imps.svg';
import assets from '../assets';
import { colors, config } from '../App';
import Aes from 'react-native-aes-crypto'
import { Buffer } from 'buffer';
import Config from './Config';
import Strings from './Strings';


var key = null;
var iv = null;
var encData = null;


export const generateIV = async () => {

  const buffer = Buffer.from([0, 3, 3, 8, 3, 2, 2, 3, 9, 9, 4, 1, 5, 7, 4, 5]);

  const iv_string = buffer.toString('hex');
  return iv_string;

};

export const generateKey = (password, salt, cost, length) => Aes.pbkdf2(password, salt, cost, length ,'aes-256-cbc')

export const encryptData = async (text, key, iv) => {

  return await Aes.encrypt(text, key, iv, 'aes-256-cbc').then(cipher => ({
    cipher,
    iv,
  }))

}


export const _toEncrypt = async (plaintext) => {
  try {
     key = await generateKey(Config.password, config.salt, config.cost, config.length);
     iv = await generateIV();
    const encryptedData = await encryptData("                " + plaintext, key, iv);
    // console.log('key', plaintext, "Encrypted::::::::", encryptedData.cipher, "iv is", iv, "key is", key);
    encData = encryptedData
    return encryptedData.cipher;
  } catch (error) {
    console.error(error);
    return null; 
  }
}


export const decryptData = async (textInput) => {
  // console.log("input data is", textInput)
  try {
    const key = await generateKey(Config.password, config.salt, config.cost, config.length);
    const text = await Aes.decrypt(textInput, key, encData.iv, 'aes-256-cbc');
    // console.log("decrypted data is ========",text)
    return text;
  } catch (error) {
    console.error('Decryption Error:', error);
    throw error;
  }
};


export function isIphoneX() {
  return;
}
export function getStatusBarHeight(skipAndroid) {
  const dimen = Dimensions.get('window');

  return Platform.select({
    ios:
      Platform.OS === 'ios' &&
        (dimen.height === 812 ||
          dimen.width === 812 ||
          dimen.height === 896 ||
          dimen.width === 896)
        ? 44
        : 20,
    android: skipAndroid ? 0 : StatusBar.currentHeight,
    default: 0,
  });
}

//this function will return true if build is debug build
export const isDev = () => __DEV__;

/**
 *
 * @param {
 * } str
 * @returns
 */
export const log = str => {
  if (!isDev) return;
  console.log('====================================');
  console.log(str);
  console.log('====================================');
};

export const jsonLog = str => {
  if (!isDev) return;
  console.log('====================================');
  console.log(JSON.stringify(str));
  console.log('====================================');
};

export const alert = str => {
  if (!isDev) return;
  alert(str);
};

export const jsonAlert = str => {
  if (!isDev) return;
  alert(JSON.stringify(str));
};

export const jsonEncode = obj => JSON.stringify(obj);
export const jsonDecode = obj => JSON.parse(obj);

//obj will set okDialog visible
// first parameter is reference of that class
//seconf parameter is actual string which will shown in dialog
export const okDialog = (obj, text) => {
  try {
    obj.props.setOkDialogShown(true);
    obj.props.setOkDialogText(text);
  } catch (error) {
    obj.setOkDialogShown(true);
    obj.setOkDialogText(text);
  }
};

export const confirmDialog = (obj, text) => {
  console.log("MyLabelShown: ",text)
  try {
    console.log("try: ",text)
    obj.props.setConfirmDialogShown(true);
    obj.props.setConfirmDialogText(text);
  } catch (error) {
    console.log("catch: ",text)
    console.log("error: ",error)
    obj.setConfirmDialogShown(true);
    obj.setConfirmDialogText(text);
  }
};

export const yesNoDialog = (obj, text) => {
  try {
    obj.props.setYesNoDialogShown(true);
    obj.props.setOkDialogText(text);
  } catch (error) {
    obj.setYesNoDialogShown(true);
    obj.setOkDialogText(text);
  }
};

export const loading = {
  start: obj => {
    try {
      obj.props.setLoaderShown(true);
    } catch (error) {
      obj.setLoaderShown(true);
    }

    //TODO:add timer for operation taking long action hide loader and show ok dialog
    // obj.props.setLoaderShown(false);
    // okDialog(obj, strings.timeOut);
  },
  stop: obj => {
    try {
      obj.props.setLoaderShown(false);
    } catch (error) {
      obj.setLoaderShown(false);
    }
  },
};

export const isConnectedToNet = obj => {
  const state = obj.props.connected;
  console.log("state ", state)
  // if (!state) {
  //   okDialog(obj, strings.internetReq);
  //   return false;
  // }
  return true;
};

export const exist = str => {
  if (str == '') return false;
  if (str == undefined) return false;
  if (str == null) return false;
  return true;
};

export const urlValider = url =>
  url.startsWith('www') ? 'http://' + url : url;


export const sendData = (obj, method, url,headers, data,  callback) => {
  const state = isConnectedToNet(obj);

  // if (!state) return;
  loading.start(obj);
  // log('sending request ....' + url);

  axios(
    {
        method,
        maxBodyLength: Infinity,
        url,
        headers,
        data,
       
        // 
      },
  )
    .then(
      function ({ data }) {
          loading.stop(obj);
          try {
            callback(obj, data);
          } catch (e) {
            alert(e);
          }
     
        
        // console.log("response...."+url+" "+data);
      
      }.bind(obj),
    )
    .catch(
      function (error) {
        loading.stop(obj);
        log('error-' + error + ':' + url);
      }.bind(obj),
    );
};



export const device_type = Platform.OS == 'android' ? 1 : 2;

export const { width, height } = Dimensions.get('screen');
export const wip = obj => {
  okDialog(obj, strings.notImplemented);
};

export const _getAppVersion = () => VersionInfo.appVersion;

// Save key-value pair in async storage (preferences)
export const _saveAsyncStorage = async (itemKey, selectedValue) => {
  try {
    // console.log(
    //   'Saving AsyncStorage value: ' + itemKey + ' => ' + selectedValue
    // )
    await AsyncStorage.setItem(itemKey, `${selectedValue}`);
  } catch (error) {
    console.error('AsyncStorage error: ' + error.message);
  }
};

// Get value for itemKey from async storage (preferences)
export const _getAsyncStorage = async itemKey => {
  try {
    const value = await AsyncStorage.getItem(itemKey);
    if (value !== null) {
      // console.log('Returning AsyncStorage value: ' + value)
      return value;
    }
  } catch (e) {
    // error reading value
  }
  return '';
};

export const isLogin = obj => {
  try {
    return exist(obj.props.apiToken);
  } catch (error) {
    return exist(obj.apiToken);
  }
  return false;
};

export const navigation = {
  navigate: (obj, sn, data = {}) => {
    const state = isConnectedToNet(obj);
    // if (!state) return;
    try {
      obj.props.navigation.navigate(sn, data);
    } catch (e) {
      try {
        obj.navigation.navigate(sn, data);
      } catch (e) {
        obj.props.props.navigation.navigate(sn, data);
      }
    }
  },
  push: (obj, sn, data = {}) => {
    const state = isConnectedToNet(obj);
    // if (!state) return;
    try {
      obj.props.navigation.push(sn, data);
    } catch (e) {
      try {
        obj.navigation.push(sn, data);
      } catch (e) {
        obj.props.props.navigation.push(sn, data);
      }
    }
  },
  replace: (obj, sn, data = {}) => {
    const state = isConnectedToNet(obj);
    // if (!state) return;
    try {
      obj.props.navigation.replace(sn, data);
    } catch (e) {
      try {
        obj.navigation.replace(sn, data);
      } catch (e) {
        obj.props.props.navigation.replace(sn, data);
      }
    }
  },
  goBack: (obj, data = {}) => {
    const state = isConnectedToNet(obj);
    // if (!state) return;
    try {
      obj.props.navigation.goBack(data);
    } catch (e) {
      try {
        obj.navigation.goBack(data);
      } catch (e) {
        obj.props.props.navigation.goBack(data);
      }
    }
  },
};

export const removeTags = str => {
  if (str === null || str === '') return false;
  else str = str.toString();

  // Regular expression to identify HTML tags in
  // the input string. Replacing the identified
  // HTML tag with a null string.
  return str.replace(/(<([^>]+)>)/gi, '');
};

export const decode = str => {
  str = str.replace(/\u0092/g, "'");
  str = str.replace(/\u0093/g, '“');
  str = str.replace(/\u0094/g, '”');
  str = str.replace(/\n/g, '');
  str = str.replace(/\r/g, '');
  return str;
};

export const handleClick = url => {
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url);
    } else {
      console.log("Don't know how to open URI: " + url);
    }
  });
};



// dashBoard data from list or banner 
export const dashBoardData = [
  {
    type: 'list', title: 'Account Summary',
    data: [
      { id: '1', Mid: '1', Img: MyAcc, name: 'My Account' },
      { id: '2', Mid: '2', Img: MiniStatement, name: 'Mini Statements' },
      { id: '3', Mid: '3', Img: DownloadStatemet, name: 'Download Statement' },
      { id: '4', Mid: '4', Img: MPassbook, name: 'M-Passbook' },
    ]
  },
  {
    type: 'banner', title: 'banner2', url: assets.banner2
  },
  {
    type: 'list', title: 'Fund Transfer',
    data: [
      { id: '1', Mid: '5', Img: OwnFundTransfer, name: 'Within Bank Own A/c' },
      { id: '2', Mid: '6', Img: SameBankOtrAcc, name: 'Within Bank Other A/c' },
      { id: '3', Mid: '7', Img: QuickTransfer, name: 'IMPS Transfer' },
      { id: '4', Mid: '8', Img: NeftEreq, name: 'NEFT' },
      // { id: '5', Mid: '9', Img: TransactionImps, name: 'IMPS TXT. Status' },

    ]
  },
  {
    type: 'list', title: 'Recharge & Bill Pay',
    data: [
      { id: '1', Mid: '10', Img: Prepaid, name: 'Prepaid' },
      { id: '2', Mid: '11', Img: Postpaid, name: 'Postpaid' },
      { id: '3', Mid: '12', Img: BillDTH, name: 'DTH' },
      { id: '4', Mid: '13', Img: DataCard, name: 'Data Card' },
      { id: '5', Mid: '14', Img: Landline, name: 'Landline' },
      { id: '6', Mid: '15', Img: History, name: 'History' },
      // { id: '7', Img: MPassbook, name: 'ATM Card Information' },

    ]
  },
  {
    type: 'list', title: 'BBPS',
    data: [
      { id: '1', Mid: '16', Img: ElectricityBill, name: 'Electricity Bill' },
      { id: '2', Mid: '17', Img: MobileBill, name: 'Mobile Bill' },
      { id: '3', Mid: '18', Img: BbpsDth, name: 'DTH' },
      { id: '4', Mid: '19', Img: TxnHistory, name: 'Txn History' },
      { id: '5', Mid: '20', Img: ComplainHistory, name: 'Complaint History' },
      { id: '6', Mid: '21', Img: AgntComplaint, name: 'Agent Complaint' },
      { id: '7', Mid: '22', Img: BillerComplaint, name: 'Biller Complaints' },

    ]
  },
  {
    type: 'list', title: 'Deposits',
    data: [
      { id: '1', Mid: '23', Img: OpenAcc, name: 'Open A/c' },
      { id: '2', Mid: '24', Img: Renew, name: 'Renew' },
      { id: '3', Mid: '25', Img: PrematuredEnqiry, name: 'Prematured Enquiry' },
      { id: '4', Mid: '26', Img: CloseAcc, name: 'Close A/c' },
      { id: '5', Mid: '27', Img: AddSI, name: 'Add Standing Instructions' },
      { id: '6', Mid: '28', Img: ViewSI, name: 'View Standing Instructions' },
    ]
  },
  //
  // {
  //   type: 'banner', title: 'banner2', url: assets.banner2
  // },
  {
    type: 'list', title: 'ATM Card',
    data: [
      { id: '1', Mid: '29', Img: AtmBal, name: 'ATM Card Balance' },
      { id: '2', Mid: '30', Img: AtmCardFT, name: 'ATM Card Fund Transf.' },
      { id: '3', Mid: '31', Img: AtmLinkMobile, name: 'ATM Link Mobile' },
      { id: '4', Mid: '32', Img: CardBlk, name: 'Card Block' },
      { id: '5', Mid: '33', Img: CardUnblock, name: 'Card Unblock' },
      { id: '6', Mid: '34', Img: AtmMiniState, name: 'ATM Mini Statement' },
      { id: '7', Mid: '35', Img: AtmCardInfo, name: 'ATM Card Information' },

    ]
  },
  // {
  //   type: 'list', title: 'Loans',
  //   data: [
  //     { id: '1', Mid: '36', Img: CarLoan, name: 'Vehicle Loan' },
  //     { id: '2', Mid: '37', Img: GoldLoan, name: 'Gold Loan' },
  //     { id: '3', Mid: '38', Img: LoanEMICal, name: 'Loan EMI Calculator' },
  //     { id: '4', Mid: '39', Img: InterestRateCal , name: 'Interest Rate Calculator' },
  //   ]
  // },
]

export const renderWelcomeMsg = (currentTime = new Date()) => {
  const currentHour = currentTime.getHours()
  const splitAfternoon = 12; // 24hr time to split the afternoon
  const splitEvening = 17; // 24hr time to split the evening

  if (currentHour >= splitAfternoon && currentHour <= splitEvening) {
    // Between 12 PM and 6PM
    return 'Good afternoon';
  } else if (currentHour >= splitEvening) {

    // Between 5PM and Midnight
    return 'Good evening';
  }
  // Between dawn and noon
  return 'Good morning';
}



// for App theme color :
export const appThemeConfiguration = config => {
  switch (config) {  //HRP task No 107295
    
    case Strings.ThemeOne:
      themeImg = require('../assets/images/bg-theme-orange.jpg');
      bg_one = require('../assets/images/bgOrangeOne.jpg');
      bg_two = require('../assets/images/bgOrangeTwo.jpg');
      bg_three = require('../assets/images/bgOrangeThree.jpg');
      themeSplash = require('../assets/images/splash-bg-pattern.png');
      themeColor = colors.themeColorOrange;
      textColor = colors.textColorForOrange;
      PrimaryColor = colors.PrimaryColor_one;
      SecondaryColor = colors.SecondaryColor_one;
      
      return { bgImg: themeImg,  bgImg1: bg_one, bgImg2: bg_two, bgImg3: bg_three,splash: themeSplash, themeColor: themeColor, textColor: textColor,
        PrimaryColor: PrimaryColor,SecondaryColor: SecondaryColor};




    case Strings.ThemeTwo:
      themeImg = require('../assets/images/bgBlueOne.jpg');
      themeSplash = require('../assets/images/splash-bg-blue-pattern.png');
      bg_one = require('../assets/images/bgBlueOne.jpg');
      bg_two = require('../assets/images/bgBlueTwo.jpg');
      bg_three = require('../assets/images/bgBlueThree.jpg');
      themeColor = colors.themeColorBlue;
      textColor = colors.textColorForBlue;
      PrimaryColor = colors.PrimaryColor_Two;
      SecondaryColor = colors.SecondaryColor_Two;
      return { bgImg: themeImg,  bgImg1: bg_one, bgImg2: bg_two, bgImg3: bg_three,splash: themeSplash, themeColor: themeColor, textColor: textColor,
        PrimaryColor: PrimaryColor,SecondaryColor: SecondaryColor};


      
    case Strings.ThemeThree:
      themeImg = require('../assets/images/bgBlueOne.jpg');
      themeSplash = require('../assets/images/splash-bg-blue-pattern.png');
      bg_one = require('../assets/images/splash-bg-blue-pattern.png');
      bg_two = require('../assets/images/splash-bg-blue-pattern.png');
      bg_three = require('../assets/images/splash-bg-blue-pattern.png');
      themeColor = colors.themeColorBlue;
      textColor = colors.textColorForBlue;
      PrimaryColor = colors.PrimaryColor_Three;
      SecondaryColor = colors.SecondaryColor_Three;
      return { bgImg: themeImg,  bgImg1: bg_one, bgImg2: bg_two, bgImg3: bg_three,splash: themeSplash, themeColor: themeColor, textColor: textColor,
        PrimaryColor: PrimaryColor,SecondaryColor: SecondaryColor  };
  
  }
};

// export const appTextColor = config => {
//   console.log("appTextColor", config)
//   switch (config) {
//     case 'orange':
//       return
//     case 'blue':
//       return colors.textColorForBlue;
//     case 'light':
//       return colors.textColorForLight;
//     // default:
//     //   return colors.textColorForOrange;
//   }
// };

// export const themeImage = config => {
//   switch (config) {
//     case 'orange':
//       themeImg = require('../assets/images/bg-theme-orange.jpg');
//       themeSplash = require('../assets/images/splash-bg-pattern.png');
//       return { bgImg: themeImg, splash: themeSplash };

//     case 'blue':
//       themeImg = require('../assets/images/bg-blue-01.jpg');
//       themeSplash = require('../assets/images/splash-bg-blue-pattern.png');
//       return { bgImg: themeImg, splash: themeSplash };


//     case 'light':
//       themeImg = require('../assets/images/bg-theme-orange.jpg');
//       themeSplash = require('../assets/images/splash-bg-pattern.png');
//       return { bgImg: themeImg, splash: themeSplash };

//     // default:
//     //   return colors.textColorForOrange;
//   }
// };
export function addMonths(date, months) {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
}


import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';
import { colors } from '../App';
import Strings from '../common/Strings';


const initialState = {
  //common
  loginStatus: false,
  connected: false,
  //Okdialog
  okDialogShown: false,
  okDialogText: '',
  loaderShown: false,
  fcmToken: 'ABCDEF',
  userId: null,

  //theme and text color
  themeColor: null,
  textColor: null,

  //prominent Desclosure
  // deviceInfoPermisson: false,
  // cameraPermission: false,
  // locationPermission: false,
  // storagePermission: false,
  // contactPermission: false,
  // audioPermission: false,
  deviceLatitude: '',
  deviceLongitude: '',
  gmstCode: '',

  //login
  SecretKey: '',
  DeviceId: '',   //HRP
  SimId: '',
  NAME: '',
  AppThemeSet: Strings.ThemeOne,
  confirmDialogShown: false,
  confirmDialogText: '',
  reset: '',
  PrimaryColor: '',//HRP task No 107295
  SecondaryColor: '',//HRP task No 107295
  termsAndConditionShown: false,
  termsAndConditionShownForImps: false,
  FingerPrint: false,
  LoginPass: '',
  termsAndConditionShownForNEFT: false,
  BranchCode: '',
  AnyDeskAllowed: false,
  FirstTimeFingerPrint: true,
  isAppState: true,
  sessionTimeRun: '',
  IsNotification: false,
};

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: [
    'loginStatus',
    'userId',
    'SimId',
    'themeColor',
    'textColor',
    'deviceInfoPermisson',
    'cameraPermission',
    'locationPermission',
    'storagePermission',
    'contactPermission',
    'audioPermission',
    'deviceLatitude',
    'deviceLongitude',
    'gmstCode',
    'SecretKey',
    'DeviceId',   //HRP
    'SimId',
    'NAME',
    'AppThemeSet',
    'PrimaryColor', //HRP task No 107295
    'SecondaryColor', //HRP task No 107295
    'termsAndConditionShown',
    'FingerPrint',
    'termsAndConditionShownForImps',
    'LoginPass',
    'termsAndConditionShownForNEFT',
    'BranchCode',
    'AnyDeskAllowed',
    'AnyDeskAllowed',
    'FirstTimeFingerPrint',
    'isAppState',
    'sessionTimeRun',
    'IsNotification',
  ], //it will  save in persist load from initial state object
};

_update = (key, value) => {
  let t = Object.create(initialState);
  t[key] = value;
  return t;
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {

    case 'SET_CONNECTED':
      return { ...state, connected: action.value };

    case 'SET_LOGIN_STATUS':
      return { ...state, loginStatus: action.value };

    case 'SET_OK_DIALOG_SHOWN':
      return { ...state, okDialogShown: action.value };

    case 'SET_OK_DIALOG_TEXT':
      return { ...state, okDialogText: action.value };
    case 'SET_LOADER_SHOWN':
      return { ...state, loaderShown: action.value };
    case 'SET_FCM_TOKEN':
      return { ...state, fcmTokens: action.value };
    case 'SET_USER_ID':
      return { ...state, userId: action.value };

    // To set theme and text color
    case 'SET_THEME_COLOR':
      return { ...state, themeColor: action.value };
    case 'SET_TEXT_COLOR':
      return { ...state, textColor: action.value };


    //prominent Desclosure 
    case 'SET_DEVICEINFO_PERMISSION':
      return { ...state, deviceInfoPermisson: action.value };
    case 'SET_CAMERA_PERMISSION':
      return { ...state, cameraPermission: action.value };
    case 'SET_LOCATION_PERMISSION':
      return { ...state, locationPermission: action.value };
    case 'SET_STORAGE_PERMISSION':
      return { ...state, storagePermission: action.value };
    case 'SET_CONTACT_PERMISSION':
      return { ...state, contactPermission: action.value };
    case 'SET_AUDIO_PERMISSION':
      return { ...state, audioPermission: action.value };

    //Latitude longitude
    case 'SET_DEVICE_LATITUDE':
      return { ...state, deviceLatitude: action.value };
    case 'SET_DEVICE_LONGITUDE':
      return { ...state, deviceLongitude: action.value };



    //Login
    case 'SET_GMST_CODE':
      return { ...state, gmstCode: action.value };

    case 'SET_SECRET_KEY':
      return { ...state, SecretKey: action.value };

    case 'SET_DEVICE_ID':   //HRP
      return { ...state, DeviceId: action.value };

    case 'SET_SIM_ID':   //HRP
      return { ...state, SimId: action.value };

    case 'SET_NAME':   //HRP
      return { ...state, NAME: action.value };

    case 'SET_APP_THEME':   //HRP
      return { ...state, AppThemeSet: action.value };

    case 'SET_PRIMARY_COLOR':
      return { ...state, PrimaryColor: action.value };

    case 'SET_SECONDARY_COLOR':
      return { ...state, SecondaryColor: action.value };


    case 'SET_CONFIRM_DIALOG_SHOWN':
      return { ...state, confirmDialogShown: action.value };

    case 'SET_CONFIRM_DIALOG_TEXT':
      return { ...state, confirmDialogText: action.value };
    case 'SET_RESET_REDUX':
      return { ...initialState, reset: action.value };
    case 'SET_TERMS_AND_CONDITION':
      return { ...state, termsAndConditionShown: action.value };
    case 'SET_TERMS_AND_CONDITION_FOR_IMPS':
      return { ...state, termsAndConditionShownForImps: action.value };
    case 'SET_TERMS_AND_CONDITION_FOR_NEFT':
      return { ...state, termsAndConditionShownForNEFT: action.value };
    case 'SET_FINGER_PRINT':
      return { ...state, FingerPrint: action.value };
    case 'SET_FIRST_TIME_FINGERPRINT':
      return { ...state, FirstTimeFingerPrint: action.value };
    case 'SET_LOGIN_PASSWORD':
      return { ...state, LoginPass: action.value };
    case 'SET_BRANCH_CODE':
      return { ...state, BranchCode: action.value };
    case 'SET_ANYDESK_ALLOWED':
      return { ...state, AnyDeskAllowed: action.value };
    case 'SET_IS_APP_STATE':
      return { ...state, isAppState: action.value };
    case 'SESSION_TIME_RN':
      return { ...state, sessionTimeRun: action.value };
    case 'IS_NOTIFICATION':
      return { ...state, IsNotification: action.value };
  }
  return state;
};

//export default userReducer;

//const rootReducer = combineReducers({userReducer});

export default persistReducer(persistConfig, userReducer);

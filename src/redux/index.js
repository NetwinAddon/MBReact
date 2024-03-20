//write Dispatch functions here
import { connect as _ } from 'react-redux';
import __ from './Reducer';

export function mapStateToProps(state) {
  return {
    //common
    loginStatus: state.loginStatus,
    connected: state.connected,
    //Okdialog
    okDialogShown: state.okDialogShown,
    okDialogText: state.okDialogText,
    loaderShown: state.loaderShown,
    fcmToken: state.fcmToken,
    userId: state.userId,

    //for theme and text
    themeColor: state.themeColor,
    textColor: state.textColor,


    //prominent Desclosure
    deviceInfoPermisson: state.deviceInfoPermisson,
    cameraPermission: state.cameraPermission,
    locationPermission: state.locationPermission,
    storagePermission: state.storagePermission,
    contactPermission: state.contactPermission,
    audioPermission: state.audioPermission,


    // latitude and longitude
    deviceLatitude: state.deviceLatitude,
    deviceLongitude: state.deviceLongitude,



    //Login
    gmstCode: state.gmstCode,
    SecretKey: state.SecretKey,
    DeviceId: state.DeviceId, //HRP
    SimId: state.SimId,
    NAME: state.NAME,
    confirmDialogShown: state.confirmDialogShown,
    confirmDialogText: state.confirmDialogText,
    reset: state.reset,
    termsAndConditionShown: state.termsAndConditionShown,
    termsAndConditionShownForImps: state.termsAndConditionShownForImps,
    termsAndConditionShownForNEFT: state.termsAndConditionShownForNEFT,
    AppThemeSet: state.AppThemeSet,
    PrimaryColor: state.PrimaryColor,
    SecondaryColor: state.SecondaryColor,
    FingerPrint : state.FingerPrint,
    FirstTimeFingerPrint : state.FirstTimeFingerPrint,
    LoginPass : state.LoginPass,
    BranchCode: state.BranchCode,
    AnyDeskAllowed: state.AnyDeskAllowed,
    isAppState: state.isAppState,
    sessionTimeRun: state.sessionTimeRun,
    IsNotification : state.IsNotification,
  };
}

//action functions to update redux state value
export function mapDispatchToProps(dispatch) {
  return {
    setConnected: val => dispatch({ type: 'SET_CONNECTED', value: val }),
    setLoginStatus: val => dispatch({ type: 'SET_LOGIN_STATUS', value: val }),
    setOkDialogShown: val =>
      dispatch({ type: 'SET_OK_DIALOG_SHOWN', value: val }),
    setOkDialogText: val => dispatch({ type: 'SET_OK_DIALOG_TEXT', value: val }),
    setLoaderShown: val => dispatch({ type: 'SET_LOADER_SHOWN', value: val }),
    setFcmToken: val => dispatch({ type: 'SET_FCM_TOKEN', value: val }),
    setUserId: val => dispatch({ type: 'SET_USER_ID', value: val }),

    //for theme color 
    setThemeColor: val => dispatch({ type: 'SET_THEME_COLOR', value: val }),
    setTextColor: val => dispatch({ type: 'SET_TEXT_COLOR', value: val }),

    //prominentDesclosure 
    setDeviceinfoPermission: val => dispatch({ type: 'SET_DEVICEINFO_PERMISSION', value: val }),
    setCameraPermission: val => dispatch({ type: 'SET_CAMERA_PERMISSION', value: val }),
    setLocationPermission: val => dispatch({ type: 'SET_LOCATION_PERMISSION', value: val }),
    setStoragePermission: val => dispatch({ type: 'SET_STORAGE_PERMISSION', value: val }),
    setContactPermission: val => dispatch({ type: 'SET_CONTACT_PERMISSION', value: val }),
    setAudioPermission: val => dispatch({ type: 'SET_AUDIO_PERMISSION', value: val }),

    // set latitude and longitude
    setDeviceLatitude: val => dispatch({ type: 'SET_DEVICE_LATITUDE', value: val }),
    setDeviceLongitude: val => dispatch({ type: 'SET_DEVICE_LONGITUDE', value: val }),

    //Login
    setGmstCode: val => dispatch({ type: 'SET_GMST_CODE', value: val }),

    setSecretKey: val => dispatch({ type: 'SET_SECRET_KEY', value: val }),

    setDeviceId: val => dispatch({ type: 'SET_DEVICE_ID', value: val }),
    setSimId: val => dispatch({ type: 'SET_SIM_ID', value: val }),

    setNAME: val => dispatch({ type: 'SET_NAME', value: val }),
    
    setAppTheme: val => dispatch({ type: 'SET_APP_THEME', value: val }),
    setPrimaryColor: val => dispatch({ type: 'SET_PRIMARY_COLOR', value: val }), //HRP task No 107295

    setSecondaryColor: val => dispatch({ type: 'SET_SECONDARY_COLOR', value: val }), //HRP task No 107295
    
    setConfirmDialogShown: val => dispatch({type: 'SET_CONFIRM_DIALOG_SHOWN', value: val}),
    setConfirmDialogText: val => dispatch({type: 'SET_CONFIRM_DIALOG_TEXT', value: val}),
    setRestRedux: val => dispatch({type: 'SET_RESET_REDUX', value: val}),
    setTermsAndCondition: val => dispatch({type: 'SET_TERMS_AND_CONDITION', value: val}),
    setTermsAndConditionForImps: val => dispatch({type: 'SET_TERMS_AND_CONDITION_FOR_IMPS', value: val}),
    setTermsAndConditionForNEFT: val => dispatch({type: 'SET_TERMS_AND_CONDITION_FOR_NEFT', value: val}),
    setFingerPrint: val => dispatch({type: 'SET_FINGER_PRINT', value: val}),
    setFirstTimeFingerPrint: val => dispatch({type: 'SET_FIRST_TIME_FINGERPRINT', value: val}),
    setLoginPass: val => dispatch({type: 'SET_LOGIN_PASSWORD', value: val}),
    setBranchCode: val => dispatch({type: 'SET_BRANCH_CODE', value: val}),
    setAnyDeskAllowed: val => dispatch({type: 'SET_ANYDESK_ALLOWED', value: val}),
    setAppState: val => dispatch({type: 'SET_IS_APP_STATE', value: val}),
    setSessionTime: val => dispatch({type: 'SESSION_TIME_RN', value: val}),
    setNotification: val => dispatch({type: 'IS_NOTIFICATION', value: val}),
  };
}

export const connect = _;

export const Reducer = __;

import assets from './assets';
import colors from './common/Colors';
import strings from './common/Strings';
import API from './common/APIUrlConstants';
import util from './common/util';
import constants from './common/Constants';

import {connect, mapStateToProps, mapDispatchToProps, Reducer} from './redux/';
import {
  log,
  jsonAlert,
  jsonLog,
  alert,
  jsonDecode,
  okDialog,
  loading,
  sendData,
  device_type,
  width,
  height,
  translate,
  navigation,
  dashBoardData,
  appThemeConfiguration,
  confirmDialog
} from './common/util';
import RenderOkDialog from './components/OkDialog';
import RenderLoader from './components/Loader';

import config from './common/Config';

export {
  device_type,
  sendData,
  loading,
  RenderLoader,
  RenderOkDialog,
  okDialog,
  log,
  jsonAlert,
  jsonLog,
  jsonDecode,
  alert,
  assets,
  colors,
  constants,
  strings,
  util,
  API,
  connect,
  mapStateToProps,
  mapDispatchToProps,
  Reducer,
  width,
  height,
  translate,
  navigation,
  dashBoardData,
  appThemeConfiguration,
  config,
  confirmDialog,
  
  
};

import React, { Component } from 'react';
import {
  Text,
  View,
  BackHandler,
  ImageBackground,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Platform,
} from 'react-native';
import {
  colors,
  strings,
  connect,
  mapStateToProps,
  mapDispatchToProps,
  width,
  appThemeConfiguration,
  sendData,
} from '../../../../App';
import CardView from 'react-native-cardview';
import SearchIcon from '../../../../assets/icons/search_icon.svg';
import { FlatList } from 'react-native-gesture-handler';
import moment from 'moment';
import Withdraw from '../../../../assets/icons/withdraw.svg';
import Constants from '../../../../common/Constants';
import APIUrlConstants from '../../../../common/APIUrlConstants';
import Snackbar from 'react-native-snackbar';
import TrasnperantFixedHomeHeader from '../../../../components/TrasnperantFixedHomeHeader';
import NetInfo from '@react-native-community/netinfo';

class ImpsTrnsHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      start_count: 0,
      end_count: 5,
      Transaction: [],
    };

    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick() {
    this.props.navigation.goBack(null);
    return true;
  }

  onBackAction() {
    this.props.navigation.goBack(this);
  }

  componentDidMount() {

    console.log('----click')
    this.GetImpsHistory();
  }
  checkInternetConnection = async () => {
    try {
      const state = await NetInfo.fetch();
      const isConnected = state.isConnected;
      return isConnected;
    } catch (error) {
      return false;
    }
  };
  LoadMoreOnPress = () => {
    this.setState(
      (prevState) => ({
        start_count: prevState.end_count,
        end_count: prevState.end_count + 5,
      }),
      () => {
        this.GetImpsHistory();
      }
    );
  };

  SearchHistory = () => {

    if (this.state.searchTerm === '') {
      this.state.start_count = 0,
        this.state.end_count = 5,
        this.state.Transaction = [],
        this.GetImpsHistory()
    }


    if (this.state.searchTerm.length > 4) {
      this.state.start_count = 0,
        this.state.end_count = 5,
        this.state.Transaction = [],
        this.GetImpsHistory()
    }
  };

  SearchClick = () => {
    this.state.start_count = 0,
      this.state.end_count = 5,

      this.state.Transaction = [],
      this.GetImpsHistory();
  };

  GetImpsHistory = async () => {

    console.log('----click2')

    const isConnected = await this.checkInternetConnection();
    if (isConnected) {
      try {
        const Headers = APIUrlConstants.Headers('GETTRANSLIST');

        const Body = {
          PARACNT: '4',
          PARA1_TYP: 'STR',
          PARA1_VAL: Constants.GMST_CODE,
          PARA2_TYP: 'STR',
          PARA2_VAL:
            '{"TXT_GMST_CODE":"' +
            Constants.GMST_CODE +
            '","TXT_TRANS_TYPE":"I","TXTSTARTROW":"' +
            this.state.start_count +
            '","TXTENDROW":"' +
            this.state.end_count +
            '","TXT_NAME":"' +
            this.state.searchTerm +
            '"}',
          PARA3_TYP: 'STR',
          PARA3_VAL: Constants.BankCode,
          PARA4_TYP: 'STR',
          PARA4_VAL: Constants.SecretKey,
        };

        console.log("ImpsTransactionHistory URL:- " + APIUrlConstants.BASE_URL);
        console.log("");
        console.log("ImpsTransactionHistory Body:- " + JSON.stringify(Body));
        console.log("");


        sendData(
          this,
          'post',
          APIUrlConstants.BASE_URL,
          Headers,
          JSON.stringify(Body),
          async (obj, response) => {
            var finalRes = response;

            console.log("ImpsTransactionHistory Response:- " + JSON.stringify(finalRes));
            if (Platform.OS === 'ios') {
              Keyboard.dismiss()
            }

            if (finalRes.SUCCESS === 'FALSE') {
              const ErrorMsg = finalRes.RESULT;
              Snackbar.show({
                text: 'No Record Found',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red',
              });
            } else {
              let res = response.Acdtls;
              let tempData = [];
              if (res.length > 0) {

                res.map((item) => {
                  tempData.push(JSON.parse(item))
                })

                this.setState({ Transaction: tempData })
              }

            }
          }
        );
      } catch (e) {
        console.log('Error: ', e);
      }
    } else {
      Snackbar.show({
        text: 'Check Internet Connection',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: 'red',
      });
    }
  };

  bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg3;

  render() {
    return (
      <View style={styles.mainView}>
        <ImageBackground style={styles.mainView} source={this.bgImage} resizeMode='cover'>
          <TrasnperantFixedHomeHeader backAction={() => this.onBackAction()} />
          <View style={styles.headerView}>
            <View style={styles.transactionHistoryView}>
              <Text style={styles.Heading}>Transaction History (IMPS)</Text>
              <Text style={styles.SubHeading}>Check your financial activity</Text>
            </View>
          </View>
          <View style={styles.CurveView}>
            <View style={styles.curveSubView}>
              <CardView cardElevation={3} cardMaxElevation={3} cornerRadius={6} style={styles.CardStyle}>
                <TextInput
                  style={[styles.TextInputStyle, { color: this.props.PrimaryColor }]}
                  value={this.state.searchTerm}
                  onChangeText={searchTerm => {
                    this.setState({ searchTerm }, () => {
                      this.SearchHistory();
                    });
                  }}
                  placeholderTextColor={'#7E8CA0'}
                  placeholder='Search By Beneficiary Name...'
                ></TextInput>
                <TouchableOpacity
                  style={[styles.SeacrhBg, { backgroundColor: this.props.SecondaryColor }]}
                  onPress={() => {
                    this.SearchClick();
                  }}>
                  <SearchIcon height={20} width={20} color={'white'} />
                </TouchableOpacity>
              </CardView>
              <FlatList
                data={this.state.Transaction}
                ItemSeparatorComponent={() => {
                  return (
                    <View
                      style={styles.flatListMainView} />
                  );
                }}
                style={styles.flatListStyle}
                renderItem={({ item }) => (
                  <View>
                    <View>
                      <Text
                        style={styles.dateText}>
                        {moment(item.TRANSACTION_DATE).format('DD MMM YYYY')}
                      </Text>
                    </View>

                    <View style={styles.dateViewRow}>
                      <View
                        style={[
                          styles.IconBg,
                          {
                            backgroundColor:
                              item.STATUS === 'C'
                                ? '#eb5757' + '1A'
                                : item.STATUS === 'R'
                                  ? '#eb5757' + '1A'
                                  : item.STATUS === 'P' || item.STATUS === 'E'
                                    ? '#27AE60' + '1A'
                                    : item.STATUS === 'A' || item.STATUS === ''
                                      ? '#FEBE5C' + '1A'
                                      : null,
                          },
                        ]}
                      >
                        <Withdraw
                          height={16}
                          width={16}
                          color={
                            item.STATUS === 'C'
                              ? '#eb5757'
                              : item.STATUS === 'R'
                                ? '#eb5757'
                                : item.STATUS === 'P' || item.STATUS === 'E'
                                  ? '#27AE60'
                                  : item.STATUS === 'A' || item.STATUS === ''
                                    ? '#FEBE5C'
                                    : null
                          } />
                      </View>
                      <View
                        style={styles.rowNameAndNo}>
                        <View style={styles.beneficiaryNameView}>
                          <Text style={styles.FlatHeadingText} numberOfLines={1}>
                            {item.BENF_NAME}
                          </Text>
                          <Text style={styles.FlatListLightText}>A/c No To: {item.TO_ACNO}</Text>
                        </View>
                        <View style={styles.amountView}>
                          <Text
                            style={[
                              styles.FlatHeadingText,
                              { color: '#686868', textAlign: 'right', fontWeight: '600' },
                            ]}>
                            ₹ {item.AMOUNT}
                          </Text>
                          <Text style={[styles.FlatListLightText, { textAlign: 'right', color: item.STATUS === 'C' ? "#eb5757" : item.STATUS === 'R' ? "#eb5757" : item.STATUS === 'P' || item.STATUS === 'E' ? "#27AE60" : item.STATUS === 'A' || item.STATUS === '' ? "#FEBE5C" : null }]}>{item.STATUS === 'C' ? "Failed" : item.STATUS === 'R' ? "Rejected" : item.STATUS === 'P' || item.STATUS === 'E' ? "Success" : item.STATUS === 'A' || item.STATUS === '' ? "Pending" : null}</Text>

                        </View>
                      </View>
                    </View>
                  </View>
                )}
              />
              <TouchableOpacity
                style={[styles.LoadMoreBg, { borderColor: '#8bb9dc' }]}
                onPress={this.LoadMoreOnPress}>
                <Text style={styles.LoadMoreTextStyle}>Load More</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView:
  {
    flex: 1
  },
  headerView:
  {
    flex: 0.2,
    justifyContent: 'center'
  },
  transactionHistoryView:
  {
    marginLeft: 25
  },
  Heading: {
    fontSize: 24,
    color: 'black',
    textAlign: 'left',
    fontFamily: strings.fontBold,
    color: colors.white,
  },
  SubHeading: {
    fontSize: 15,
    color: 'black',
    textAlign: 'left',
    fontFamily: strings.fontMedium,
    color: colors.white,
  },

  CurveView: {
    flex: 0.8,
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  curveSubView: {
    marginTop: 10
  },
  CardStyle: {
    height: 48,
    backgroundColor: 'white',
    width: width - 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
    flexDirection: 'row',
  },
  TextInputStyle: {
    paddingLeft: 15,
    flex: 0.85,
    height: 48,
    backgroundColor: 'white',
    fontFamily: strings.fontRegular,
    fontSize: 17,
  },
  flatListMainView:
  {
    height: 0.5,
    width: '95%',
    backgroundColor: colors.backgroundColor,
    alignSelf: 'center',
    marginVertical: 5,
  },
  SeacrhBg: {
    flex: 0.15,
    height: 45,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },

  IconBg: {
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  FlatDateStyle: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'SF UI Display',
    color: '#686868',
    textAlign: 'left',
  },
  FlatHeadingText: {
    fontFamily: strings.fontMedium,
    fontSize: 14,
    color: 'black',
  },
  FlatListLightText: {
    fontFamily: strings.fontRegular,
    fontSize: 12,
    color: '#929CAC',
    marginTop: 1,
  },
  amountView:
  {
    flex: 0.25
  },
  LoadMoreBg: {
    marginTop: 15,
    marginBottom: 15,
    height: 40,
    width: width - 50,
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 2,
  },

  LoadMoreTextStyle: {
    color: 'black',
    fontFamily: strings.fontMedium,
    fontSize: 14,
  },
  flatListStyle:
  {
    marginTop: 15,
    width: width - 40
  },
  dateText:
  {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'SF UI Display',
    color: '#686868',
    textAlign: 'left',
  },
  rowNameAndNo:
  {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  beneficiaryNameView:
  {
    marginLeft: 5,
    padding: 2,
    flex: 0.75
  },
  dateViewRow:
  {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ImpsTrnsHistory);

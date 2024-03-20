import React, { Component } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  BackHandler,
} from 'react-native';
import Footer from '../../../../assets/icons/footer.svg';
import AddBeneficiaryIcon from '../../../../assets/icons/user-add.svg';
import VerifyBeneficiaryIcon from '../../../../assets/icons/user-check.svg';
import EditBeneficiaryIcon from '../../../../assets/icons/user-xmark.svg';
import CardView from 'react-native-cardview';
import QuickTransfer from '../../../../assets/icons/dashboardIcons/ico-24x7-quick-transfer.svg';
import TransactionImps from '../../../../assets/icons/dashboardIcons/transaction_imps.svg';
import HistoryIocn from '../../../../assets/icons/dashboardIcons/ico-history.svg';
import {
  colors,
  strings,
  connect,
  mapStateToProps,
  mapDispatchToProps,
  width,
  navigation,
  appThemeConfiguration,
} from '../../../../App';
import DropDown from '../../../../assets/icons/fi-rr-angle-right.svg';
import Colors from '../../../../common/Colors';
import TrasnperantFixedHeader from '../../../../components/TrasnperantFixedHeader';
class IMPSTransferMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accounList: props.route.params.dashboardArray,
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }
  componentDidMount() { }
  bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg;

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  onBackAction() {
    navigation.goBack(this)
  }

  handleBackButtonClick() {
    navigation.goBack(this)
    return true;
  }


  History() {
    this.props.navigation.navigate('ImpsTrnsHistory', {
      accList: this.state.accounList,
      from: 'Dashboard',
    });
  }

  render() {
    return (
      <View style={styles.mainView}>
        <ImageBackground style={styles.mainView} source={this.bgImage} resizeMode='cover'>
          <TrasnperantFixedHeader backAction={() => this.onBackAction()} />

          <View style={styles.headerView}>
            <View
              style={styles.headerLabelView}>
              <Text
                style={styles.impsText}>
                IMPS Transfer
              </Text>
              <Text
                style={styles.impsTextDesciption}>
                Express Transfers, Anytime, Anywhere
              </Text>
            </View>
          </View>
          <View
            style={styles.mainViewContainer}>
            <ScrollView
              style={styles.mainView}
              contentContainerStyle={styles.containerStyle}
            >
              <CardView cardElevation={2} cardMaxElevation={3} cornerRadius={12} style={styles.CardStyle}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(this, 'ImpsTransfer', {
                      accList: this.state.accounList,
                      from: 'Dashboard',
                    });
                  }}>
                  <View style={styles.Touchablestyle}>
                    <View style={styles.cardMainView}>
                      <View
                        style={styles.cardMainSubView}>
                        <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A' }]}>
                          <QuickTransfer height={25} width={25} color={this.props.SecondaryColor} />
                        </View>
                      </View>
                      <Text style={styles.MainTextStyle}>{strings.impsText + ' Transfer'}</Text>
                    </View>
                    <View
                      style={styles.dropDownImgView}>
                      <DropDown width={24} height={24} />
                    </View>
                  </View>
                </TouchableOpacity>
              </CardView>
              <CardView cardElevation={2} cardMaxElevation={3} cornerRadius={12} style={styles.CardStyle}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(this, 'ImpsAddBeneficiary', {
                      accList: this.state.accounList,
                      from: 'Dashboard',
                    });
                  }}
                >
                  <View style={styles.Touchablestyle}>
                    <View style={styles.cardMainView}>
                      <View
                        style={styles.cardMainSubView}>
                        <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A' }]}>
                          <AddBeneficiaryIcon height={25} width={25} color={this.props.SecondaryColor} />
                        </View>
                      </View>
                      <Text style={styles.MainTextStyle}>{strings.addBeneficiary}</Text>
                    </View>
                    <View
                      style={styles.dropDownImgView}>
                      <DropDown width={24} height={24} />
                    </View>
                  </View>
                </TouchableOpacity>
              </CardView>
              <CardView cardElevation={2} cardMaxElevation={3} cornerRadius={12} style={styles.CardStyle}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(this, 'ImpsVerifyBeneficiary', {
                      accList: this.state.accounList,
                      from: 'Dashboard',
                    });
                  }}
                >
                  <View style={styles.Touchablestyle}>
                    <View style={styles.cardMainView}>
                      <View
                        style={styles.cardMainSubView}>
                        <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A' }]}>
                          <VerifyBeneficiaryIcon height={25} width={25} color={this.props.SecondaryColor} />
                        </View>
                      </View>
                      <Text style={styles.MainTextStyle}>{strings.verifyBeneficiary}</Text>
                    </View>
                    <View
                      style={styles.dropDownImgView}>
                      <DropDown width={24} height={24} />
                    </View>
                  </View>
                </TouchableOpacity>
              </CardView>
              <CardView cardElevation={2} cardMaxElevation={3} cornerRadius={12} style={styles.CardStyle}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(this, 'ImpsDeleteBeneficiary', {
                      accList: this.state.accounList,
                      from: 'Dashboard',
                    });
                  }}
                >
                  <View style={styles.Touchablestyle}>
                    <View style={styles.cardMainView}>
                      <View
                        style={styles.cardMainSubView}>
                        <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A' }]}>
                          <EditBeneficiaryIcon height={25} width={25} color={this.props.SecondaryColor} />
                        </View>
                      </View>
                      <Text style={styles.MainTextStyle}>{strings.closeBeneficiary}</Text>
                    </View>
                    <View
                      style={styles.dropDownImgView}>
                      <DropDown width={24} height={24} />
                    </View>
                  </View>
                </TouchableOpacity>
              </CardView>
              {/* <CardView cardElevation={2} cardMaxElevation={3} cornerRadius={12} style={styles.CardStyle}>
        <TouchableOpacity
         onPress={() => {
          navigation.navigate(this, 'ImpsTxtStatus', {
           accList: this.state.accounList,
           from: 'Dashboard',
          });
         }}
        >
         <View style={styles.Touchablestyle}>
          <View style={styles.cardMainView}>
           <View
             style={styles.cardMainSubView}>
            <View style={[styles.IconBgStyle, {backgroundColor: this.props.SecondaryColor + '1A'}]}>
             <TransactionImps height={25} width={25} color={this.props.SecondaryColor} />
            </View>
           </View>
           <Text style={styles.MainTextStyle}>Transaction Status</Text>
          </View>
          <View
            style={styles.dropDownImgView}>
           <DropDown width={24} height={24} />
          </View>
         </View>
        </TouchableOpacity>
       </CardView> */}
              <CardView cardElevation={2} cardMaxElevation={3} cornerRadius={12} style={styles.CardStyle}>
                <TouchableOpacity
                  onPress={() => {
                    this.History();
                  }}
                >
                  <View style={styles.Touchablestyle}>
                    <View style={styles.cardMainView}>
                      <View
                        style={styles.cardMainSubView}>
                        <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A' }]}>
                          <HistoryIocn height={25} width={25} color={this.props.SecondaryColor} />
                        </View>
                      </View>
                      <Text style={styles.MainTextStyle}>History</Text>
                    </View>
                    <View
                      style={styles.dropDownImgView}>
                      <DropDown width={24} height={24} />
                    </View>
                  </View>
                </TouchableOpacity>
              </CardView>
            </ScrollView>
          </View>

          <View
            style={styles.footerView}>
            <View style={styles.footerSubView}>
              <Footer height={70} width={300} />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}
const styles = {
  CardStyle: {
    backgroundColor: 'white',
    marginTop: 20,
    width: width - 40,
    alignItems: 'center',
  },
  Touchablestyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    alignItems: 'center',
    width: width - 40,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    borderColor: '#cdcdce',
    borderRadius: 12,
  },
  MainTextStyle: {
    fontSize: 15,
    includeFontPadding: false,
    color: Colors.boldTextColor,
    fontFamily: strings.fontMedium,
  },
  IconBgStyle: {
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainView:
  {
    flex: 1
  },
  headerView:
  {
    flex: 0.2
  },
  headerLabelView:
  {
    marginLeft: 25,
    marginBottom: 10,
  },
  impsText:
  {
    fontSize: 20,
    color: 'black',
    textAlign: 'left',
    fontFamily: strings.fontBold,
    color: colors.white,
  },
  impsTextDesciption:
  {
    fontSize: 15,
    color: 'black',
    textAlign: 'left',
    fontFamily: strings.fontMedium,
    color: colors.white,
  },
  mainViewContainer:
  {
    flex: 0.75,
    justifyContent: 'center',
    backgroundColor: '#fbfcfc',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flexDirection: 'column',
  },
  containerStyle:
  {
    alignItems: 'center',
    paddingBottom: 10,
  },
  cardMainView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardMainSubView:
  {
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  dropDownImgView:
  {
    width: 20,
    height: 20,
    justifyContent: 'flex-end',
  },
  footerView:
  {

    flex: 0.1,
    backgroundColor: 'white',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  footerSubView:
  {
    alignItems: 'flex-end'
  },

};

export default connect(mapStateToProps, mapDispatchToProps)(IMPSTransferMenu);

import React, { Component } from 'react';
import {
    Text,
    View,
    FlatList,
} from 'react-native';
import {
    colors,
    strings,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    width,
    navigation,
    sendData,
    RenderLoader,
    appThemeConfiguration
} from '../../App';
import { RFValue } from "react-native-responsive-fontsize";
import { TouchableOpacity } from 'react-native-gesture-handler';
import CardView from 'react-native-cardview'
import FixedHeader from '../../components/FixedHeader';
import MyAccount from '../../assets/icons/dashboardIcons/ico-my-account.svg';
import MiniStatements from '../../assets/icons/dashboardIcons/ico-mini-statements.svg';
import DownloadStatemet from '../../assets/icons/dashboardIcons/ico-download-statement.svg';
import MPassbook from '../../assets/icons/dashboardIcons/ico-m-passbook.svg';
import OpenAcc from '../../assets/icons/dashboardIcons/ico-open-account.svg';
import Renew from '../../assets/icons/dashboardIcons/ico-renew.svg';
import PrematuredEnqiry from '../../assets/icons/dashboardIcons/ico-prematured-enquiry.svg';
import CloseAcc from '../../assets/icons/dashboardIcons/ico-close-account.svg'
import SameBankOtrAcc from '../../assets/icons/dashboardIcons/same-bank-transfer.svg';
import QuickTransfer from '../../assets/icons/dashboardIcons/ico-24x7-quick-transfer.svg';
import NeftEreq from '../../assets/icons/dashboardIcons/ico-neft-e-request.svg';
import AddSI from '../../assets/icons/dashboardIcons/ico-add-standing-instructions.svg';
import ViewSI from '../../assets/icons/dashboardIcons/ico-view-standing-instructions.svg';
import AtmBal from '../../assets/icons/dashboardIcons/ico-atm-card-balance.svg';
import AtmCardFT from '../../assets/icons/dashboardIcons/ico-atm-card-fund-transf.svg';
import AtmLinkMobile from '../../assets/icons/dashboardIcons/ico-atm-link-mobile.svg';
import CardBlk from '../../assets/icons/dashboardIcons/ico-card-block.svg';
import CardUnblock from '../../assets/icons/dashboardIcons/ico-card-unblock.svg';
import AtmMiniState from '../../assets/icons/dashboardIcons/ico-atm-mini-statement.svg';
import AtmCardInfo from '../../assets/icons/dashboardIcons/ico-atm-card-information.svg'
import Prepaid from '../../assets/icons/dashboardIcons/ico-prepaid.svg';
import Postpaid from '../../assets/icons/dashboardIcons/ico-postpaid.svg';
import BillDTH from '../../assets/icons/dashboardIcons/ico-dth.svg';
import DataCard from '../../assets/icons/dashboardIcons/ico-data-card.svg';
import Landline from '../../assets/icons/dashboardIcons/ico-landline.svg';
import History from '../../assets/icons/dashboardIcons/ico-history.svg';
import ElectricityBill from '../../assets/icons/dashboardIcons/ico-electricity-bill.svg';
import MobileBill from '../../assets/icons/dashboardIcons/ico-mobile-bill.svg';
import TxnHistory from '../../assets/icons/dashboardIcons/ico-txn-history.svg';
import ComplainHistory from '../../assets/icons/dashboardIcons/ico-complaint-history.svg';
import AgntComplaint from '../../assets/icons/dashboardIcons/ico-agent-complaint.svg';
import BillerComplaint from '../../assets/icons/dashboardIcons/ico-biller-complaints.svg';
import OwnFundTransfer from '../../assets/icons/dashboardIcons/own_fund_transfer.svg';
import TransactionImps from '../../assets/icons/dashboardIcons/transaction_imps.svg';
import { RemoveFromFavPopup } from '../../components/RemoveFromFavPopup';
import Constants from '../../common/Constants';
import APIUrlConstants from '../../common/APIUrlConstants';
import AddToFavorites from '../../assets/icons/AddToFavorites.svg'

class FavoriteScreen extends Component {
    constructor(props) {
        super(props);
        var userData = props.route.params.customData
        this.DashboardAcc = []
        this.dynamicDegrees = []
        this.state = {
            selectedValue: 'option1',
            isFocus: false,
            isSearchButtonClick: false,
            userName: userData.NAME,
            totalAmount: 0,
            positionNo: 0,
            perVal: [],
            colors: [],
            data4: [],
            labels4: [],
            combinedData: [],
            myTempData: [],
            ACNO: '',
            accountTypeBalances: {},
            doubleBackToExitPressedOnce: false,
            SelectedeAccountList: [],
            isYesNoModalVisible: false,
            searchTerm: '',
              bgImage: appThemeConfiguration(this.props.AppThemeSet).bgImg, //HRP task No 107295
            confirmDialog: false,
            MenuName: '',
            MenuList: ''
        };
        let userAccArray = userData.Acdtls
        this.state.obj = this
        if (userAccArray.length > 0) {
            userAccArray.map((item) => {
                this.DashboardAcc.push(JSON.parse(item))
            })
            this.state.SelectedeAccountList = this.DashboardAcc[0]
        }
       
        this.DashboardAcc.forEach(element => {
            if (element.ACTYPE === 'CURRENT ACCOUNT' || element.ACTYPE === 'SAVING ACCOUNT') {
                console.log("In")
                this.state.totalAmount = this.state.totalAmount + Math.abs((element.BALANCE))
            }

        });

        this.DashboardAcc.forEach(element => {
            if (element.ACTYPE === 'CURRENT ACCOUNT' || element.ACTYPE === 'SAVING ACCOUNT') {
                const existing = this.state.myTempData.find(e => e.ACTYPE == element.ACTYPE);
                if (existing) {
                    existing.time += element.BALANCE;
                } else {
                    this.state.myTempData.push({ BALANCE: element.BALANCE, ACTYPE: element.ACTYPE });
                }
            }
            return null;
        });
    }
    
    onBackArrow = () => {
        navigation.goBack(this)
    }

    sendRequest = async (obj) => {
        try {
            console.log('ImageName : ' + Constants.GMST_CODE);
            const Headers = {
                ProdCD: Constants.ProdCD,
                BankCD: Constants.BankCode,
                OprCD: 'GETFMENU',
                Content_Type: 'application/json',
                REQ_TYPE: 'POST'
            };
            const reqParams = {
                GMST_CODE: Constants.GMST_CODE
            };            
            const Body = {
                PARACNT: "1",
                PARA1_TYP: "STR",
                PARA1_VAL: JSON.stringify(reqParams),
            }
          
            sendData(obj,
                'post',
                APIUrlConstants.BASE_URL,
                Headers,
                JSON.stringify(Body),
                async (obj, response) => {

                    if (response.hasOwnProperty('fmenulist')) {
                        var responseData = response.fmenulist.map(item => JSON.parse(item.replace(/\\/g, '')));
                        this.setState({ MenuList: responseData })
                    }
                    else {

                        this.setState({ MenuList: '' })
                    }

                });
        } catch (error) {
            console.error('Error in API:', error);
        }
    };

    componentDidMount() {
        this.props.navigation.addListener('focus', () => { this.sendRequest(this) });
    }

    hideDialog = () => {
        this.setState({ confirmDialog: false })
        this.sendRequest(this)
    }


    render() {
        return (
            <View style={styles.mainContainer}>
                {this.state.confirmDialog === true ? (
                    <RemoveFromFavPopup
                        isVisible={this.state.confirmDialog}
                        isDisabled={this.hideDialog}
                        MenuName={this.state.MenuName}
                        onConfirm={this.onConfirm}
                        obj={this}/>
                ) : null}
                <View style={styles.innerContainer}>
                    <FixedHeader
                        backAction={() => this.onBackArrow()}
                        color={'#1F3C66'}/>
                    <View style={styles.favoriteContainer}>
                        <Text style={styles.favoriteMenuText}>Favourite Menu</Text>
                    </View>
                    {this.state.MenuList === '' ? (
                        <View style={styles.welcomeContainer}>
                            <View style={styles.welcomeInnerContainer}>
                                <AddToFavorites height={110}
                                    width={110}></AddToFavorites>
                            </View>
                            <Text style={styles.welcomeText}>{'Welcome!'}</Text>
                            <Text style={styles.addFavoriteMenu}>Add your Favourite menus from Home</Text>
                            <Text style={styles.justLongPress}>Just Long press on your Favourite menu to add it. </Text>
                        </View>
                    ) : (
                        <View>
                            <View style={styles.recentlyContainer}>
                                <CardView
                                    cardElevation={3}
                                    cardMaxElevation={3}
                                    cornerRadius={15}
                                    style={styles.recentlyCard}>
                                    <Text style={styles.recentlyAddedText}>Recently Added</Text>
                                    <FlatList
                                        data={this.state.MenuList}
                                        numColumns={4}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) => {
                                            const menuComponentMappings = {
                                                'My Account': <MyAccount height={22} width={22} color={this.props.SecondaryColor} />,
                                                'Mini Statements': <MiniStatements height={22} width={22} color={this.props.SecondaryColor} />,
                                                'Download Statement': <DownloadStatemet height={22} width={22} color={this.props.SecondaryColor} />,
                                                'M-Passbook': <MPassbook height={22} width={22} color={this.props.SecondaryColor} />,
                                                'Within Bank Own A/c': <OwnFundTransfer height={22} width={22} color={this.props.SecondaryColor} />,
                                                'Within Bank Other A/c': <SameBankOtrAcc height={22} width={22} color={this.props.SecondaryColor} />,
                                                'IMPS Transfer': <QuickTransfer height={22} width={22} color={this.props.SecondaryColor} />,
                                                'NEFT': <NeftEreq height={22} width={22} color={this.props.SecondaryColor} />,
                                                'IMPS TXT. Status': <TransactionImps height={22} width={22} color={this.props.SecondaryColor} />,
                                                'Prepaid': <Prepaid height={22} width={22} color={this.props.SecondaryColor} />,
                                                'Postpaid': <Postpaid height={22} width={22} color={this.props.SecondaryColor} />,
                                                'DTH': <BillDTH height={22} width={22} color={this.props.SecondaryColor} />,
                                                'Data Card': <DataCard height={22} width={22} color={this.props.SecondaryColor} />,
                                                'Landline': <Landline height={22} width={22} color={this.props.SecondaryColor} />,
                                                'History': <History height={22} width={22} color={this.props.SecondaryColor} />,
                                                'Electricity Bill': <ElectricityBill height={22} width={22} color={this.props.SecondaryColor} />,
                                                'Mobile Bill': <MobileBill height={22} width={22} color={this.props.SecondaryColor} />,
                                                'Txn History': <TxnHistory height={22} width={22} color={this.props.SecondaryColor} />,
                                                'Complaint History': <ComplainHistory height={22} width={22} color={this.props.SecondaryColor} />,
                                                'Agent Complaint': <AgntComplaint height={22} width={22} color={this.props.SecondaryColor} />,
                                                'Biller Complaints': <BillerComplaint height={22} width={22} color={this.props.SecondaryColor} />,
                                                'Open A/c': <OpenAcc height={22} width={22} color={this.props.SecondaryColor} />,
                                                'Renew': <Renew height={22} width={22} color={this.props.SecondaryColor} />,
                                                'Prematured Enquiry': <PrematuredEnqiry height={22} width={22} color={this.props.SecondaryColor} />,
                                                'Close A/c': <CloseAcc height={22} width={22} color={this.props.SecondaryColor} />,
                                                'Add Standing Instructions': <AddSI height={22} width={22} color={this.props.SecondaryColor} />,
                                                'View Standing Instructions': <ViewSI height={22} width={22} color={this.props.SecondaryColor} />,
                                                'ATM Card Balance': <AtmBal height={22} width={22} color={this.props.SecondaryColor} />,
                                                'ATM Card Fund Transf.': <AtmCardFT height={22} width={22} color={this.props.SecondaryColor} />,
                                                'ATM Link Mobile': <AtmLinkMobile height={22} width={22} color={this.props.SecondaryColor} />,
                                                'Card Block': <CardBlk height={22} width={22} color={this.props.SecondaryColor} />,
                                                'Card Unblock': <CardUnblock height={22} width={22} color={this.props.SecondaryColor} />,
                                                'ATM Mini Statement': <AtmMiniState height={22} width={22} color={this.props.SecondaryColor} />,
                                                'ATM Card Information': <AtmCardInfo height={22} width={22} color={this.props.SecondaryColor} />,
                                            };
                                            const defaultComponent = <MyAccount height={22} width={22} color={this.props.SecondaryColor} />;
                                            const renderedComponent = menuComponentMappings[item.MENU_NAME] || defaultComponent;
                                            return (
                                                <TouchableOpacity
                                                    style={styles.FlatListTouchableStyle}
                                                    activeOpacity={0.5}
                                                    onLongPress={() => {
                                                        this.setState({ confirmDialog: true });
                                                        this.setState({ MenuName: item });
                                                    }}
                                                    onPress={() => {
                                                        console.log("item click is", item.MENU_IMAGE)
                                                        if (item.MENU_NAME == 'My Account') {
                                                            navigation.navigate(this, 'myAccountList', this.DashboardAcc)
                                                        }
                                                        else if (item.MENU_NAME == 'Mini Statements') {
                                                            navigation.navigate(this, 'myAccountMiniStatement', this.DashboardAcc)
                                                        }
                                                        else if (item.MENU_NAME == 'Download Statement') {
                                                            navigation.navigate(this, 'downloadStatement', this.DashboardAcc)
                                                        }
                                                        else if (item.MENU_NAME == 'M-Passbook') {
                                                            navigation.navigate(this, 'mpassBook', this.state.SelectedeAccountList)
                                                        }
                                                        else if (item.MENU_NAME == 'Open A/c') {
                                                            navigation.navigate(this, 'newDepositAccountOpening')
                                                        }
                                                        else if (item.name == 'Within Bank Own A/c') {
                                                            navigation.navigate(this, 'quickPayOwnAccTransfer', { from: 'dashboard', dashboardArray: this.DashboardAcc })
                                                        }
                                                        else if (item.name == 'Within Bank Other A/c') {
                                                            navigation.navigate(this, 'sameBankOtherAcc', { from: 'dashboard', dashboardArray: this.DashboardAcc })
                                                        }
                                                        else if (item.MENU_NAME == 'Prepaid') {
                                                            navigation.navigate(this, 'prepaid')
                                                        }
                                                        else if (item.MENU_NAME == 'Postpaid') {
                                                            navigation.navigate(this, 'postpaidScreen')
                                                        }
                                                        else if (item.MENU_NAME == 'DTH') {
                                                            navigation.navigate(this, 'DTHHomeScreen')
                                                        }
                                                        else if (item.MENU_NAME == 'Landline') {
                                                            navigation.navigate(this, 'landlineBill')
                                                        }
                                                        else if (item.MENU_NAME == 'History') {
                                                            navigation.navigate(this, 'billsPaymentHistory')
                                                        }
                                                        else if (item.MENU_NAME == 'Data Card') {
                                                            navigation.navigate(this, 'dataCard')
                                                        }
                                                        else if (item.MENU_NAME == 'Electricity Bill') {
                                                            navigation.navigate(this, 'electricityBillScreen')
                                                        }
                                                        else if (item.MENU_NAME == 'Agent Complaint') {
                                                            navigation.navigate(this, 'complaintsHomeScreen')
                                                        }
                                                        else if (item.name == 'Txn History') {
                                                            navigation.navigate(this, 'transHistoryHomeScreen')
                                                        }
                                                    }}>
                                                    <View style={[styles.ItemBg,{ backgroundColor: this.props.SecondaryColor + '1A' }]}>
                                                        <View style={[styles.ItemBg, { backgroundColor: this.props.SecondaryColor + '1A' }]}>
                                                            {renderedComponent}
                                                        </View>
                                                    </View>
                                                    <Text
                                                        style={[
                                                            styles.Itemtext,
                                                            { color: this.props.PrimaryColor }
                                                        ]}>
                                                        {item.MENU_NAME}
                                                    </Text>
                                                </TouchableOpacity>
                                            )
                                        }}
                                    />
                                </CardView>
                                <Text style={styles.longPressToMenu}>*Long Press on menu to remove menu from Favourite list</Text>
                            </View>
                        </View>
                    )}
                </View>
                <RenderLoader />
            </View>
        );
    }
}

const styles = {
    placeholderStyle: {
        fontSize: 14,
        color: 'black',
    },
    selectedTextStyle: {
        fontSize: 16,
        backgroundColor: 'red',
    },

    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,

    },
    FlatListTouchableStyle:
    {
        width: (width - 26) / 4,
        alignItems: 'center',
        marginVertical: 10,
        marginBottom: 15,
    },
    ItemBg:
    {
        height: 54,
        width: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 5
    },
    Itemtext:
    {
        width: 68,
        fontSize: 10,
        textAlign: 'center',
        fontFamily: strings.fontMedium
    },
    mainContainer:
    {
        flex: 1,
         backgroundColor: colors.white
    },
    innerContainer:
    {
        flex: 1,
        alignItems: 'center',
    },
    favoriteContainer:
    {  
        marginTop: -40,
    },
    favoriteMenuText:
    {
        fontSize: RFValue(23),
        fontFamily: strings.fontBold,
        color: "#1f3c66",
        textAlign: 'center',
        includeFontPadding: false,
        fontWeight: "700",
        fontFamily: "SF UI Display",
    },
    welcomeContainer:
    {
        flex: 0.92, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    welcomeInnerContainer:
    {
        marginBottom: 30, 
        marginHorizontal: 19,
         alignItems: 'center'
    },
    welcomeText:
    {
        fontSize: 24,
        fontFamily: strings.fontMedium,
        color: "#ff0000",
        textAlign: "center",
    },
    addFavoriteMenu:
    {
        fontSize: RFValue(14),
        fontWeight: "600",
        fontFamily: "SF UI Display",
        color: "#1f3c66",
        textAlign: "center",
        marginTop: 8
    },
    justLongPress:
    {
        fontSize: RFValue(12),
        fontFamily: strings.fontMedium,
        color: "#ff0000",
        fontWeight: "400",
        textAlign: "center",
        marginTop: 5,
        width: width
    },
    recentlyContainer:
    {
        alignItems: 'center',
         marginTop: 15 
    },
    recentlyCard:
    {
        backgroundColor: colors.white, 
        width: width - 26, 
        marginTop: 5
    },
    recentlyAddedText:
    {
        fontSize: 15,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        color: "#1f3c66",
        paddingLeft: 15,
        paddingTop: 10,
    },
    longPressToMenu:
    {
        fontSize: 12,
        fontFamily: strings.fontMedium,
        color: "#ff0000",
        textAlign: "center",
        marginTop: 10
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(FavoriteScreen);

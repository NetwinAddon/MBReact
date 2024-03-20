import React, { Component } from 'react';
import {
    Text,
    View,
    StatusBar,
    SafeAreaView,
    Animated,
    Image,
    Button,
    TouchableOpacity,
    Dimensions,
    FlatList,
    ImageBackground,
    Platform,
    BackHandler,
    ToastAndroid,
    Alert,
    ScrollView,
    AppState,
    LogBox,

} from 'react-native';



import {
    colors,
    strings,
    assets,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    okDialog,
    RenderOkDialog,
    width,
    dashBoardData,
    config
} from '../../App';

import { PieChart as SVGPieChart } from 'react-native-svg-charts';
import { Defs, LinearGradient, Stop } from 'react-native-svg';
import LinearGradient1 from 'react-native-linear-gradient';
import { selectAccount } from '../../components/CustomPopups';

// import SearchImage from '../../assets/icons/search_icon.svg'
import SearchImage from '../../assets/icons/dashboardIcons/search_icon.svg'

import ProfileMenuImage from '../../assets/icons/dashboardIcons/Profile_Menu.svg'
import LogOffImage from '../../assets/icons/dashboardIcons/ico_power.svg'
import Arrowdown from '../../assets/icons/dashboardIcons/arrow_down.svg'
import Refresh from '../../assets/icons/dashboardIcons/refresh.svg'
import OnlineServies from '../../assets/icons/dashboardIcons/ico-online-services.svg'
import Upi from '../../assets/icons/dashboardIcons/ico-upi.svg'
import CardView from 'react-native-cardview';

import { appThemeConfiguration, navigation, renderWelcomeMsg, sendData, themeImage } from '../../common/util';
import Constants from '../../common/Constants';
import Strings from '../../common/Strings';
import { TextInput } from 'react-native-paper';
import Colors from '../../common/Colors';
import Snackbar from 'react-native-snackbar';
import { FavoriteMenuPopup } from '../../components/FavoriteMenuPopup';
import APIUrlConstants from '../../common/APIUrlConstants';
import NetInfo from '@react-native-community/netinfo';
import { RFValue } from "react-native-responsive-fontsize";
import Swiper from 'react-native-swiper';
import { DialogYesNoModal } from '../../components/DialogYesNoModal';



class BankingHomeScreen extends Component {



    staticColorsArray = [
        '#F93307',
        '#FFA903',
        '#5775A0',
        '#1F3C66',

    ];

    generateGradients = (data) => {

        console.log("..........." + JSON.stringify(data))

        return data.map((item, index) => (

            <Defs key={`grad${index}`}>

                <LinearGradient id={`grad${index}`} x1={'0%'} y={'0%'} x2={'0%'} y2={'100%'}>
                    <Stop offset="0%" stopColor={item.startColor} />
                    <Stop offset="100%" stopColor={item.endColor} />

                </LinearGradient>

            </Defs>

        ));
    };
    constructor(props) {
        super(props);

        // console.log(props)

        var userData = props.route.params.customData

        this.TempAcc = []
        this.dynamicDegrees = []

        this.BalanceRefresh = []

        this.SavingAccountList = []  // To show Saving Account On Top
        this.RemainingAccountList = [] // To show Remaining Account below of Saving A/c


        this.state = {
            DashboardAcc: [],
            isSearchButtonClick: false,
            Selected_ACTYPE: '',
            userName: userData.NAME,
            SelectedAcNo_ACTYPE: '',
            totalAmount: 0,
            colors: [],
            combinedData: [],
            myTempData: [],
            ACNO: '',
            doubleBackToExitPressedOnce: false,
            SelectedeAccountList: [],
            isYesNoModalVisible: false,
            searchTerm: '',
            filteredData: dashBoardData,
            bgImage: appThemeConfiguration(this.props.AppThemeSet).bgImg, //HRP task No 107295
            confirmDialog: false,  //RGP
            MenuName: '',    //RGP
            loginResponseData: userData, //DAA,
            AddList: []
        };
        let userAccArray = userData.Acdtls


        if (userAccArray.length > 0) {
            userAccArray.map((item) => {

                this.TempAcc.push(JSON.parse(item))    // 2- Store Resp in Temp Array

            })
        }

        this.TempAcc.forEach(element => {
            if (element.ACTYPE === 'SAVING ACCOUNT') {

                this.SavingAccountList.push(element)  // 3- sort to Saving & Remaining List

            }
            else {
                this.RemainingAccountList.push(element)
            }

            // else if (element.ACTYPE !== 'FIXED DEPOSIT ACCOUNT') {
            //     this.RemainingAccountList.push(element)
            // }
        });


        if (this.SavingAccountList.length > 0 || this.RemainingAccountList.length > 0) {

            // 4- Addded Saving in Top List & Remaining in Below List

            this.SavingAccountList.map((item) => {

                this.state.DashboardAcc.push(item)

            })

            this.RemainingAccountList.map((item) => {


                this.state.DashboardAcc.push(item)



            })
            this.state.SelectedeAccountList = this.state.DashboardAcc[0]

        }

        // 5 - Setting Oth position of account details if exists
        if (this.state.DashboardAcc.length > 0) {
            this.state.Selected_ACTYPE = this.state.DashboardAcc[0].ACTYPE.toLowerCase()
            Constants.Selected_ACTYPE = this.state.DashboardAcc[0].ACTYPE
            Constants.Selected_GMST_CODE = this.state.DashboardAcc[0].GMST_CODE
            Constants.Selected_AC_NO = this.state.DashboardAcc[0].AC_NO
            Constants.Selected_ACMASTCODE = this.state.DashboardAcc[0].ACMASTCODE
            Constants.Selected_BALANCE = this.state.DashboardAcc[0].BALANCE

            Constants.Selected_AC_NAME = this.state.DashboardAcc[0].AC_NAME
            Constants.Selected_DEBIT_STOP = this.state.DashboardAcc[0].DEBITSTOP
            Constants.Selected_MIN_BAL = this.state.DashboardAcc[0].MIN_BAL
            Constants.Selected_MIN_BAL_REQ = this.state.DashboardAcc[0].MIN_BAL_REQ
            Constants.Selected_DEBIT_GL_TYPE = this.state.DashboardAcc[0].ACTYPE + " - " + this.state.DashboardAcc[0].AC_NO

            this.setState({
                SelectedAcNo_ACTYPE: this.state.DashboardAcc[0].AC_NO,

                Selected_ACTYPE: this.state.DashboardAcc[0].ACTYPE
            });

        }


        this.state.DashboardAcc.forEach(element => {

            if (element.ACTYPE === 'CURRENT ACCOUNT' || element.ACTYPE === 'SAVING ACCOUNT') {

                this.state.totalAmount = this.state.totalAmount + Math.abs((element.BALANCE)) //Total Amount Calculation


                const index = this.state.myTempData.findIndex(e => e.ACTYPE === element.ACTYPE);

                if (index !== -1) {
                    // Element exists
                    this.state.myTempData[index].BALANCE += Math.abs(element.BALANCE);
                } else {
                    // Element doesn't exist
                    this.state.myTempData.push({ BALANCE: Math.abs(element.BALANCE), ACTYPE: element.ACTYPE });
                }

            }

            return null;
        });



        this.state.myTempData.map(temp => {
            var percentval = parseInt((Math.abs((temp.BALANCE)) / this.state.totalAmount) * 100)
            var degrees = (percentval / 100) * 360
            this.dynamicDegrees.push(degrees)
        })

        this.pieChartData = this.dynamicDegrees.map((degree, index) => {

            let startColor = this.staticColorsArray[index]; // Dynamically generate startColor
            let endColor = this.staticColorsArray[index + 1]; // Dynamically generate endColor

            if (index == 0) {
                startColor = this.staticColorsArray[0]; // Dynamically generate startColor
                endColor = this.staticColorsArray[1]; // Dynamically generate endColor 
            }
            else if (index == 1) {
                startColor = this.staticColorsArray[2]; // Dynamically generate startColor
                endColor = this.staticColorsArray[3]; // Dynamically generate endColor 
            }

            const value = degree / 360 * 100; // Convert degrees to a percentage value

            return {
                value,
                svg: { fill: `url(#grad${index})` },
                startColor,
                endColor,
            };
        });



    }

    async componentDidMount() {
        this.getAdd()
        this.gradients = this.generateGradients(this.pieChartData);

        dashBoardData[2].url = assets.banner1
        dashBoardData[4].url = assets.banner2
        this.screenWidth = Dimensions.get("window").width;
        this.size = new Animated.Value(0);
        //On Back press refresh
        // this.focusSubscription = this.props.navigation.addListener(
        //     'focus',
        //     () => {
        //         console.log('refresh')
        //         this.GetAccountBalance();
        //     }
        // );

        const isConnected = await this.checkInternetConnection();

        if (isConnected) {
            // console.log("Connected to the internet");

            // this.GetTransactionHistory();


        } else {
            // console.log("Not connected to the internet");


        }
        // this.changeEventListener = AppState.addEventListener('change', () => {
        //     // your listener function
        //   })

        this.calculateTotalBalances();


    }

    getAdd() {

        try {

            const Headers = APIUrlConstants.Headers("GETADD");
            console.log("Headers:- " + JSON.stringify(Headers));
            const Body =
            {
                PARACNT: "1",
                PARA1_TYP: "STR",
                PARA1_VAL: '',
            }


            sendData(this,
                'post',
                APIUrlConstants.BASE_URL,
                Headers,
                JSON.stringify(Body),
                async (obj, response) => {
                    var finalRes = response

                    //    console.log("Responseeeeeee:- " + JSON.stringify(response.fmenulist));

                    // let res = finalRes.SUCCESS
                    if (finalRes.fmenulist.length > 0) {

                        this.setState({ AddList: finalRes.fmenulist })
                    }



                })

        }
        catch (e) {
            console.log('Error: ', e)
        }

    }

    componentWillUnmount() {
        // this.changeEventListener.remove()
    }




    checkInternetConnection = async () => {
        try {
            const state = await NetInfo.fetch();

            const isConnected = state.isConnected;
            // console.log("Internet status:", isConnected);

            return isConnected;
        } catch (error) {
            console.error("Error checking internet connection:", error);
            return false;
        }
    };

    async componentDidUpdate(preProps, prevState) {

        if (preProps.AppThemeSet !== this.props.AppThemeSet) {
            this.setState({ bgImage: appThemeConfiguration(this.props.AppThemeSet).bgImg })
        }
        const isConnected = await this.checkInternetConnection();

        if (isConnected) {
            // console.log("Connected to the internet");
            // Perform actions when connected
        } else {
            // console.log("Not connected to the internet");
            // Handle the case when not connected
        }

    }

    toggleModal = () => {
        this.setState({ isYesNoModalVisible: false })
    };
    toggleYesModal = () => {
        this.toggleModal();
        this.logout()
    };
    handleSearch = searchTerm => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        // Filter the data based on the search term
        const filteredData = dashBoardData.map(item => {
            if (item.type === 'list') {
                const filteredList = item.data.filter(subItem => {
                    // console.log("SearchingData:  ", subItem.name)
                    const lowerCaseName = subItem.name.toLowerCase();
                    return lowerCaseName.includes(lowerCaseSearchTerm)
                        ? {
                            ...subItem,
                            highlightedName: (
                                <this.HighlightedText
                                    text={subItem.name}
                                    searchTerm={lowerCaseSearchTerm}
                                    highlightColor='Yellow' // Specify your desired highlight color
                                />
                            ),
                        }
                        : null
                });
                return { ...item, data: filteredList };
            }
            return item;
        });

        // this.setState({
        //     searchTerm,
        //     filteredData,
        // });


        const hasResults = filteredData.some(item => item.type === 'list' && item.data.length > 0);

        this.setState({
            searchTerm,
            filteredData,
            noResultsMessage: hasResults ? null : Snackbar.show({
                text: 'No search result',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red'

            }),
        });
    };


    HighlightedText = ({ text, searchTerm, highlightColor }) => {
        const lowerCaseText = text.toLowerCase();
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        const parts = lowerCaseText.split(new RegExp(`(${lowerCaseSearchTerm})`, 'gi'));

        return (
            <Text>
                {parts.map((part, index) => (
                    <Text
                        key={index}
                        style={
                            part.toLowerCase() === lowerCaseSearchTerm
                                ? { color: highlightColor, fontWeight: 'bold' }
                                : {}
                        }
                    >
                        {part}
                    </Text>
                ))}
            </Text>
        );
    };

    onLogoutClick() {
        this.setState({ isYesNoModalVisible: true })
        this.props.setOkDialogText("Are you sure you want to exit app ?")
    }

    async onRefreshClick() {
        const isConnected = await this.checkInternetConnection();

        if (isConnected) {
            // console.log("Connected to the internet");

            this.GetAccountBalance();


        } else {
            Snackbar.show({
                text: 'Check Internet Connection',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red'

            });
            // console.log("Not connected to the internet");


        }

    }

    onSearchButtonClick() {
        this.setState({ isSearchButtonClick: true })
    }

    logout() {
        const GMST_CODE = this.props.gmstCode
        if (GMST_CODE === null || GMST_CODE === undefined || GMST_CODE.trim() === "") {
            navigation.navigate(this, 'loginType')
        } else {
            navigation.navigate(this, 'mainLogin', { from: 'Dashboard' })
        }

    }

    calculateTotalBalances() {
        let tmp4 = [];
        this.state.DashboardAcc.forEach((o, i) => {
            if (o.ACTYPE === 'CURRENT ACCOUNT' || o.ACTYPE === 'SAVING ACCOUNT') {
                const existing = tmp4.find(e => e.ACTYPE === o.ACTYPE);
                if (existing) {
                    existing.BALANCE += parseFloat(o.BALANCE);
                } else {
                    tmp4.push({ BALANCE: parseFloat(o.BALANCE), ACTYPE: o.ACTYPE });
                }
            }
        });

        this.setState({
            combinedData: tmp4.map(o => ({ ACTYPE: o.ACTYPE, BALANCE: o.BALANCE.toFixed(2) })),
        });


        this.setState({
            totalAmount: this.state.combinedData.reduce((total, item) => total + Math.abs(item.BALANCE), 0)
        });

    }

    calculateTotalChartBalance() {
        this.state.DashboardAcc.forEach(element => {

            if (element.ACTYPE === 'CURRENT ACCOUNT' || element.ACTYPE === 'SAVING ACCOUNT') {

                this.state.totalAmount = this.state.totalAmount + Math.abs((element.BALANCE)) //Total Amount Calculation


                const index = this.state.myTempData.findIndex(e => e.ACTYPE === element.ACTYPE);

                if (index !== -1) {
                    // Element exists
                    this.state.myTempData[index].BALANCE += Math.abs(element.BALANCE);
                } else {
                    // Element doesn't exist
                    this.state.myTempData.push({ BALANCE: Math.abs(element.BALANCE), ACTYPE: element.ACTYPE });
                }

            }

            return null;
        });



        this.state.myTempData.map(temp => {
            var percentval = parseInt((Math.abs((temp.BALANCE)) / this.state.totalAmount) * 100)
            var degrees = (percentval / 100) * 360
            this.dynamicDegrees.push(degrees)
        })

        this.pieChartData = this.dynamicDegrees.map((degree, index) => {

            let startColor = this.staticColorsArray[index]; // Dynamically generate startColor
            let endColor = this.staticColorsArray[index + 1]; // Dynamically generate endColor

            if (index == 0) {
                startColor = this.staticColorsArray[0]; // Dynamically generate startColor
                endColor = this.staticColorsArray[1]; // Dynamically generate endColor 
            }
            else if (index == 1) {
                startColor = this.staticColorsArray[2]; // Dynamically generate startColor
                endColor = this.staticColorsArray[3]; // Dynamically generate endColor 
            }

            const value = degree / 360 * 100; // Convert degrees to a percentage value

            return {
                value,
                svg: { fill: `url(#grad${index})` },
                startColor,
                endColor,
            };
        });


        this.gradients = this.generateGradients(this.pieChartData);

        dashBoardData[2].url = assets.banner1
        dashBoardData[4].url = assets.banner2
        this.screenWidth = Dimensions.get("window").width;
        this.size = new Animated.Value(0);
    }

    hideDialog = () => {
        this.setState({ confirmDialog: false })
    }

    toSideMenu() {
        navigation.navigate(this, 'sideProfileScreen', { UserName: this.state.userName })
    }

    onBackAction() {
        // ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
        Snackbar.show({
            text: 'Press back again to exit',
            duration: Snackbar.LENGTH_SHORT,

        });
    }

    //PassedValue on Click
    onSelectAccount = (ACTYPE, Gsmtcode, AcNO, AcmMastCod, Balance, item) => {
        console.log("Balance----ACTYPE " + ACTYPE)
        // console.log("Balance----Gsmtcode " + Balance)
        // console.log("Balance----AcNO " + AcNO)
        // console.log("Balance----AcmMastCod " + AcmMastCod)
        this.setState({ isModalVisible: false, ACTYPE })
        if (Gsmtcode === null || Gsmtcode === undefined || Gsmtcode.trim() === "") {
        }
        else {
            this.state.Selected_ACTYPE = ACTYPE
            Constants.Selected_ACTYPE = ACTYPE
            Constants.Selected_GMST_CODE = Gsmtcode
            Constants.Selected_AC_NO = AcNO
            Constants.Selected_ACMASTCODE = AcmMastCod
            Constants.Selected_BALANCE = Balance
            Constants.Selected_AC_NAME = ACTYPE
            Constants.Selected_DEBIT_STOP = item.DEBITSTOP
            Constants.Selected_MIN_BAL = item.MIN_BAL
            Constants.Selected_MIN_BAL_REQ = item.MIN_BAL_REQ
            Constants.Selected_DEBIT_GL_TYPE = ACTYPE + " - " + item.AC_NO
            this.state.SelectedeAccountList = item

        }

    }


    GetAccountBalance() {
        try {
            let update = false;

            this.BalanceRefresh = [];

            const Headers = APIUrlConstants.Headers("DASACSUM");

            const Body =
            {
                PARACNT: "3",
                PARA1_TYP: "STR",
                PARA1_VAL: Constants.GMST_CODE,
                PARA2_TYP: "STR",
                PARA2_VAL: Constants.BankCode,
                PARA3_TYP: "STR",
                PARA3_VAL: Constants.SecretKey,

            }
            console.log("GetAccountBalance URL:- " + APIUrlConstants.BASE_URL);
            console.log("");
            console.log("GetAccountBalance Json:- " + JSON.stringify(Body));
            console.log("");

            sendData(this,
                'post',
                APIUrlConstants.BASE_URL,
                Headers,
                JSON.stringify(Body),
                async (obj, response) => {
                    var finalRes = response

                    console.log("GetAccountBalance Response:- " + JSON.stringify(response));

                    let res = finalRes.SUCCESS
                    if (res === "FALSE") {

                        const ErrorMsg = finalRes.RESULT
                        Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });

                    }
                    else {

                        let userAccArray = finalRes.Acdtls


                        if (userAccArray.length > 0) {
                            userAccArray.map((value) => {

                                this.BalanceRefresh.push(JSON.parse(value))    // 2- Store Resp in Temp Array
                                update = true;
                            })

                        }
                        // console.log("BalanceRefresh" + JSON.stringify(this.BalanceRefresh));
                        if (update) {
                            for (let i = 0; i < this.BalanceRefresh.length; i++) {

                                this.setState(prevState => ({
                                    DashboardAcc: prevState.DashboardAcc.map(item => (item.AC_NO === this.BalanceRefresh[i].AC_NO ? { ...item, BALANCE: this.BalanceRefresh[i].BALANCE } : item)),
                                }));

                            }
                            console.log("Balanace Updated")
                            this.calculateTotalBalances(); // DAA for refresh saving and current balacne also

                        }

                    }


                })

        }
        catch (e) {
            console.log('Error: ', e)
        }
    }


    CompFooter() {
        return (
            <View style={styles.compFooterView}>
                <View style={styles.compFooterInnerView} >
                    {this.state.loginResponseData.ESERVICES_MENU_REQ === 'Y' ?
                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={15}
                            style={styles.onlineServiceCard}>
                            <TouchableOpacity style={styles.onlineServiceTouchable}>
                                <View style={styles.onlineServiceMainView}>
                                    <View style={[styles.onlineServiceInnerView, { backgroundColor: this.props.SecondaryColor + '1A', }]}>
                                        <OnlineServies height={18} width={22} color={this.props.SecondaryColor} />
                                    </View>
                                </View>
                                <View style={styles.onlineServiceValuesView}>
                                    <Text style={[styles.eServiceText, { color: this.props.PrimaryColor }]}>{strings.eServices}</Text>
                                    <Text style={[styles.onlineServiceText, { color: this.props.PrimaryColor }]}>{strings.onlineServices}</Text>
                                </View>
                            </TouchableOpacity>
                        </CardView> : null
                    }
                    {this.state.loginResponseData.UPI_MAIN_MENU_CODE === 'Y' ? <CardView
                        cardElevation={3}
                        cardMaxElevation={3}
                        cornerRadius={15}
                        style={styles.upiCard}>
                        <TouchableOpacity style={styles.upiTouchable}>
                            <View style={styles.onlineServiceMainView}>
                                <View style={[styles.onlineServiceInnerView, { backgroundColor: this.props.SecondaryColor + '1A', }]}>
                                    <Upi height={35} width={45} />
                                </View>
                            </View>
                            <View style={styles.upiValuesView}>
                                <Text style={[styles.eServiceText, { color: this.props.PrimaryColor }]}>{strings.upi}</Text>
                                <Text style={[styles.onlineServiceText, { color: this.props.PrimaryColor }]}>{strings.upif}</Text>
                            </View>
                        </TouchableOpacity>
                    </CardView> : null}
                </View>
            </View>
        )
    }


    render() {



        return (
            <View style={{ flex: 1 }}>
                {this.state.confirmDialog === true ? (
                    <FavoriteMenuPopup
                        isVisible={this.state.confirmDialog}
                        isDisabled={this.hideDialog}
                        MenuName={this.state.MenuName}
                        onConfirm={this.onConfirm}
                        obj={this} />
                ) : null}
                <View
                    style={{
                        height: 330,
                        marginBottom: 30,
                    }}>

                    <ImageBackground
                        style={{
                            overflow: 'hidden',
                            height: 330,
                            borderBottomRightRadius: 30,
                            borderBottomLeftRadius: 30
                        }}
                        source={this.state.bgImage}
                        resizeMode='stretch'>
                        {!this.state.isSearchButtonClick ?
                            <View style={{
                                flexDirection: 'row',
                                marginTop: Platform.OS == 'ios' ? 50 : 40,
                                marginHorizontal: 10
                            }}>


                                <TouchableOpacity style={{
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                                    onPress={() => this.toSideMenu()}
                                >
                                    <View style={[styles.UserInitialBg, { backgroundColor: this.props.SecondaryColor }]}>
                                        <Text style={{ color: 'white', fontSize: RFValue(22), fontFamily: strings.fontBold }}>

                                            {this.state.userName.charAt(0).toUpperCase()}
                                        </Text>
                                    </View>

                                    {/* profile Menu */}
                                    <View style={{
                                        width: 20,
                                        height: 20,
                                        marginLeft: -12,
                                        marginTop: 35,
                                        borderWidth: 2,
                                        borderColor: colors.profilemenu,
                                        backgroundColor: colors.white,
                                        borderRadius: 150 / 2,
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <ProfileMenuImage height={7} width={7} />
                                    </View>
                                </TouchableOpacity>

                                <View style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    marginLeft: 10,
                                }}>
                                    <Text style={{
                                        color: '#FEBE5C',
                                        fontSize: RFValue(11),
                                        fontFamily: strings.fontMedium,
                                        includeFontPadding: false,
                                    }}>
                                        {renderWelcomeMsg()}
                                    </Text>
                                    <Text style={{
                                        color: 'white',
                                        fontSize: RFValue(13),
                                        fontFamily: strings.fontMedium,
                                        includeFontPadding: false,
                                        textTransform: 'capitalize'
                                    }}>
                                        {this.state.userName}
                                    </Text>

                                    {/* LastLogin */}
                                    <Text style={{ color: 'white', fontSize: RFValue(10), fontFamily: strings.fontMedium, includeFontPadding: false, }}>
                                        Last Login : {Constants.LAST_LOGIN}
                                    </Text>
                                </View>

                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                    <TouchableOpacity style={{
                                        padding: 5,
                                        justifyContent: 'center',
                                    }} onPress={() => this.onRefreshClick()}>
                                        <Refresh height={20} width={20} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{
                                        padding: 5,
                                        justifyContent: 'center',
                                    }} onPress={() => this.onSearchButtonClick()}>
                                        <SearchImage height={20} width={20} />
                                    </TouchableOpacity>


                                    <TouchableOpacity style={{
                                        padding: 5,
                                        justifyContent: 'center',
                                    }} onPress={() => this.onLogoutClick()}>
                                        <LogOffImage height={20} width={20} />
                                    </TouchableOpacity>
                                </View>
                            </View> :
                            <View style={{
                                marginTop: Platform.OS == 'ios' ? 40 : 30,
                                height: 64,
                                width: width - 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                borderRadius: 8,
                                borderRadius: 8
                            }}>
                                <CardView
                                    cardElevation={3}
                                    cardMaxElevation={3}
                                    cornerRadius={6}
                                    style={{
                                        height: 48,
                                        backgroundColor: 'white',
                                        width: width - 60,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginTop: 30,
                                        flexDirection: 'row',
                                        marginBottom: 8,
                                    }}
                                >
                                    <Image style={{ height: 23, width: 23 }} source={require('../../assets/icons/search.png')}></Image>
                                    <TextInput
                                        maxLength={10}
                                        style={{

                                            flex: 0.85,
                                            height: 54,
                                            backgroundColor: 'white',
                                            fontFamily: strings.fontRegular,
                                            fontSize: RFValue(15),
                                            color: Colors.textColorForOrange,
                                        }}
                                        onChangeText={text => this.handleSearch(text)}
                                        value={this.state.searchTerm}
                                        placeholder='Search menu here... '

                                    />

                                    <View>
                                        {/* {this.state.searchTerm.length >= 3 ?
                                            <TouchableOpacity onPress={() => {
                                                this.handleSearch('')
                                                this.setState({ isSearchButtonClick: false, searchTerm: '' })
                                            }}>
                                                <Image style={{ height: 23, width: 23 }} source={require('../../assets/icons/cancel_icon.png')}></Image>
                                            </TouchableOpacity>
                                            :
                                            <Image style={{ height: 23, width: 23 }} source={require('../../assets/icons/search.png')}></Image>
                                        } */}
                                        <TouchableOpacity onPress={() => {
                                            this.handleSearch('')
                                            this.setState({ isSearchButtonClick: false, searchTerm: '' })
                                        }}>
                                            <Image style={{ height: 23, width: 23 }} source={require('../../assets/icons/cancel_icon.png')}></Image>
                                        </TouchableOpacity>
                                    </View>
                                </CardView>
                            </View>}

                        <View style={{
                            height: 200,
                            flexDirection: 'row',
                            // backgroundColor: '#a3b4c5',
                            marginHorizontal: 5,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                            }}>
                                <View style={{
                                    flex: 0.5,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <SVGPieChart
                                        style={{ height: 200, width: 200, }}
                                        data={this.pieChartData}
                                        labelRadius={8}
                                        spacing={5}
                                        outerRadius={'80%'}
                                        innerRadius={'70%'} >
                                        {this.gradients}

                                    </SVGPieChart>

                                    <View
                                        style={styles.gauge}>
                                        <Text
                                            style={styles.gaugeText}>
                                            Total
                                        </Text>
                                        <Text
                                            style={{
                                                backgroundColor: 'transparent',
                                                color: colors.white,
                                                fontSize: RFValue(14),
                                                fontFamily: strings.fontRegular
                                            }}>
                                            {this.state.totalAmount.toFixed(2)}
                                        </Text>
                                    </View>
                                </View>

                                <View style={{
                                    flex: 0.6,
                                    flexDirection: 'column',
                                    justifyContent: 'center',

                                }}>
                                    {/* {console.log("this.state.combinedData: ", this.state.combinedData)} */}
                                    {/* {console.log("this.state.combinedData: ", this.state.combinedData)} */}
                                    {this.state.combinedData.map((item, index) => {
                                        if (item.ACTYPE === 'CURRENT ACCOUNT' || item.ACTYPE === 'SAVING ACCOUNT') {
                                            return (
                                                <View
                                                    key={index}
                                                    style={{
                                                        flexDirection: 'column',
                                                        padding: 5,
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                        }}
                                                    >
                                                        {/* {console.log("this.state.combinedData: ", index)} */}


                                                        <LinearGradient1
                                                            colors={index === 0 ? [this.staticColorsArray[0], this.staticColorsArray[1]] : [this.staticColorsArray[2], this.staticColorsArray[3]]}
                                                            style={styles.CircleShape}
                                                            start={{ x: 1, y: 0.5 }}
                                                            end={{ x: 0.5, y: 1.0 }}
                                                        />

<View
                                                            style={{
                                                                flexDirection: 'row',
                                                                alignItems: 'center',
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    marginLeft: 10,
                                                                    fontSize: RFValue(12),
                                                                    color: 'white',
                                                                    fontFamily: strings.fontMedium,
                                                                }}
                                                            >
                                                               
                                                                {item.ACTYPE.split(' ')[0]?.charAt(0).toUpperCase() + item.ACTYPE.split(' ')[0]?.slice(1).toLowerCase() || ''} A/c:
                                                            </Text>
                                                            <Text
                                                                style={{
                                                                    textAlign: 'right',
                                                                    marginLeft: 3,
                                                                    fontSize: RFValue(13),
                                                                    color: 'white',
                                                                    fontFamily: strings.fontMedium,
                                                                }}
                                                            >

                                                                {item.BALANCE.startsWith('-') ? (item.BALANCE.replace('-', '') + " Cr") : (item.BALANCE + " Dr")}

                                                            </Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            );
                                        }
                                        return null; // Skip rendering for "Loan Account"
                                    })}
                                </View>
                            </View>
                        </View>
                    </ImageBackground >

                    {/*UI-TAG SHOW BALANCE*/}
                    < View
                        style={{ alignItems: 'center' }
                        }
                    >
                        <CardView
                            style={styles.ShowAccountStyle}
                            cardElevation={2}
                            cardMaxElevation={2}
                            cornerRadius={8}>
                            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}

                                onPress={() => {
                                    this.onRefreshClick();
                                    this.setState({ isModalVisible: true, labelText: strings.showBal })
                                }}
                            >

                                <View style={{ flex: 1, }}>
                                    <Text style={{
                                        color: colors.accTextColor + '80',
                                        marginLeft: 15,
                                        fontSize: RFValue(11),
                                        fontFamily: strings.fontMedium
                                    }}>
                                        {strings.showBal}
                                    </Text>

                                    <Text style={{
                                        color: colors.accTextColor,
                                        marginLeft: 15,
                                        fontSize: RFValue(14),
                                        fontFamily: strings.fontMedium,
                                        textTransform: 'capitalize'
                                    }}>
                                        {this.state.Selected_ACTYPE.split(' ')[0]?.charAt(0).toUpperCase() + this.state.Selected_ACTYPE.split(' ')[0]?.slice(1).toLowerCase() || ''} A/c ****{Constants.Selected_AC_NO.slice(-4)}
                                    </Text>
                                </View>

                                <View style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginHorizontal: 10
                                }} >
                                    <Arrowdown height={15} width={15} />
                                </View>
                            </TouchableOpacity>


                        </CardView>
                    </View >
                    {
                        selectAccount(
                            this.state.isModalVisible,
                            this.state.DashboardAcc.filter(item => item.ACTYPE === 'SAVING ACCOUNT' || item.ACTYPE === 'CURRENT ACCOUNT' || item.ACTYPE === 'LOAN ACCOUNT' && (item.SUB_TYPE === '2' || item.SUB_TYPE === '6' || item.SUB_TYPE === '7')),
                            this.onSelectAccount,
                            this.state.labelText,
                            this.state.Selected_ACTYPE,
                        )
                    }
                </View >
                <ScrollView>
                    <View style={{
                        flex: 1,
                        backgroundColor: colors.dashboardBgColor,
                    }}>

                        <Text style={{
                            fontSize: RFValue(12),
                            fontFamily: strings.fontMedium,
                            color: "#ff0000",
                            textAlign: "center",

                        }}>*Long Press on menu to Add in Favourite menu list </Text>
                        <FlatList

                            ListFooterComponent={
                                this.state.searchTerm == null || this.state.searchTerm === ''
                                    ? this.CompFooter() // Render the footer component
                                    : null // Do not render anything (null)
                            }
                            Style={{ flex: 1 }}

                            data={

                                this.state.filteredData.filter(item => item.title === "Deposits" && this.state.loginResponseData.DEP_MENU_REQ === 'Y' || item.title === "ATM Card" && this.state.loginResponseData.ATM_MENU_REQ === 'Y' || item.title === "Account Summary"
                                    || item.title === "banner2" || item.title === "Fund Transfer" || item.title === "Loans" || item.title === "Recharge & Bill Pay" && this.state.loginResponseData.RECHARGE_OPTIONS_CODE === 'Y' || item.title === "BBPS" && this.state.loginResponseData.BBPS_MENU_REQ === 'Y')
                            }
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => {
                                if (item.type == 'list') {
                                    if (item.data.length === 0) {
                                        return null;
                                    }
                                    return (
                                        <View style={{ padding: 10, alignItems: 'center' }}>

                                            <CardView
                                                cardElevation={3}
                                                cardMaxElevation={3}
                                                cornerRadius={15}
                                                style={{ backgroundColor: colors.white, width: width - 26, }} >

                                                <Text style={[styles.TitleText, { color: this.props.PrimaryColor }]}> {item.title} </Text>

                                                <FlatList
                                                    data={item.data.filter(item => {
                                                        if (this.state.filteredData[2].title === 'Fund Transfer') {
                                                            if ((this.state.loginResponseData.IS_IMPS === '0' && item.Mid === '7') || (this.state.loginResponseData.IS_NEFT === '0' && item.Mid === '8')) {
                                                                // If IS_IMPS is '0' and the item id is '4' (NEFT), or if IS_NEFT is '0' and the item id is '8' (NEFT), hide it
                                                                return false;
                                                            }
                                                        
                                                        }
                                                        return true;
                                                    })}
                                                    numColumns={4}
                                                    keyExtractor={(item, index) => index}
                                                    renderItem={({ item }) => (
                                                        <TouchableOpacity
                                                            style={styles.FlatListTouchableStyle}
                                                            activeOpacity={0.5}
                                                            onLongPress={() => {
                                                                this.setState({ confirmDialog: true })
                                                                this.setState({ MenuName: item })
                                                            }}
                                                            onPress={() => {
                                                                // console.log("item click is", item.name)
                                                                if (item.name == 'My Account') {
                                                                    navigation.navigate(this, 'myAccountList', this.state.DashboardAcc)
                                                                }
                                                                else if (item.name == 'Mini Statements') {
                                                                    navigation.navigate(this, 'myAccountMiniStatement', this.state.DashboardAcc)

                                                                }
                                                                else if (item.name == 'Download Statement') {
                                                                    navigation.navigate(this, 'downloadStatement', this.state.DashboardAcc)

                                                                }
                                                                else if (item.name == 'M-Passbook') {
                                                                    navigation.navigate(this, 'mpassBook', this.state.SelectedeAccountList)
                                                                }
                                                                else if (item.name == 'Open A/c') {
                                                                    navigation.navigate(this, 'newDepositAccountOpening')
                                                                }
                                                                else if (item.name == 'Within Bank Own A/c') {
                                                                    navigation.navigate(this, 'quickPayOwnAccTransfer', { from: 'dashboard', dashboardArray: this.state.DashboardAcc })
                                                                }
                                                                else if (item.name == 'Within Bank Other A/c') {
                                                                    navigation.navigate(this, 'sameBankOtherAcc', { from: 'dashboard', dashboardArray: this.state.DashboardAcc })
                                                                }
                                                                else if (item.name == 'IMPS Transfer') {
                                                                    navigation.navigate(this, 'IMPSTransferMenu', { from: 'dashboard', dashboardArray: this.state.DashboardAcc })
                                                                }
                                                                else if (item.name == 'Prepaid') {
                                                                    navigation.navigate(this, 'prepaid')
                                                                }
                                                                else if (item.name == 'Postpaid') {
                                                                    navigation.navigate(this, 'postpaidScreen')
                                                                }
                                                                else if (item.name == 'DTH') {
                                                                    navigation.navigate(this, 'DTHHomeScreen')
                                                                }

                                                                else if (item.name == 'Landline') {
                                                                    navigation.navigate(this, 'landlineBill')
                                                                }
                                                                else if (item.name == 'History') {
                                                                    navigation.navigate(this, 'billsPaymentHistory')
                                                                }
                                                                else if (item.name == 'Data Card') {
                                                                    navigation.navigate(this, 'dataCard')
                                                                }
                                                                else if (item.name == 'Electricity Bill') {
                                                                    navigation.navigate(this, 'electricityBillScreen')
                                                                }
                                                                else if (item.name == 'NEFT') {
                                                                    navigation.navigate(this, 'neftMenu', { from: 'dashboard', dashboardArray: this.state.DashboardAcc })
                                                                }
                                                                else if (item.name == 'IMPS TXT. Status') {
                                                                    navigation.navigate(this, 'ImpsTxtStatus', { from: 'dashboard', dashboardArray: this.state.DashboardAcc })
                                                                }
                                                                else if (item.name == 'Agent Complaint') {
                                                                    navigation.navigate(this, 'complaintsHomeScreen')
                                                                }
                                                                else if (item.name == 'Complaint History') {
                                                                    navigation.navigate(this, 'historyHomeScreen')
                                                                }
                                                                else if (item.name == 'Txn History') {
                                                                    navigation.navigate(this, 'transHistoryHomeScreen')
                                                                }
                                                                else if (item.name == 'Biller Complaints') {
                                                                    navigation.navigate(this, 'billersComplaintsHomeScreen')
                                                                }
                                                                else if (item.name == 'Renew') {
                                                                    navigation.navigate(this, 'renewAccHomeScreen')
                                                                }
                                                                else if (item.name == 'Prematured Enquiry') {
                                                                    navigation.navigate(this, 'prematuredEnquiryHomeScreen')
                                                                }
                                                                else if (item.name == 'Close A/c') {
                                                                    navigation.navigate(this, 'closeDepositHomeScreen')
                                                                }
                                                                else if (item.name == 'Add Standing Instructions') {
                                                                    navigation.navigate(this, 'AddStandingInstructions');
                                                                }
                                                                else if (item.name == 'Vehicle Loan') {
                                                                    navigation.navigate(this, 'LoanHomeScreen', { LoanType: 'Vehicle' })
                                                                }
                                                                else if (item.name == 'Gold Loan') {
                                                                    navigation.navigate(this, 'LoanHomeScreen', { LoanType: 'Gold' })
                                                                }
                                                                else if (item.name == 'Loan EMI Calculator') {
                                                                    navigation.navigate(this, 'Emi_Calculator');
                                                                }
                                                                else if (item.name == 'Interest Rate Calculator') {
                                                                    navigation.navigate(this, 'InterestRateCircularMenu', { from: 'dashboard', dashboardArray: this.state.DashboardAcc });
                                                                }
                                                            }
                                                            }>

                                                            <View style={[styles.ItemBg, { backgroundColor: this.props.SecondaryColor + '1A' }]}>
                                                                <item.Img height={21} width={21} color={this.props.SecondaryColor} />
                                                            </View>

                                                            <Text style={[styles.Itemtext, { color: this.props.PrimaryColor }]}>{item.name}</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                />
                                            </CardView>
                                        </View>
                                    )
                                }
                                else if (item.type == 'banner' && this.state.AddList.length > 0) {
                                    return (

                                        <View style={{ height: 130, width: width, marginTop: 10, marginBottom: 10 }}>
                                            <Swiper
                                                autoplay={true}
                                                autoplayTimeout={4}
                                                showsPagination={false}
                                                loop={true}
                                            >
                                                {this.state.AddList.map((slide, index) => (

                                                    <View key={index}>
                                                        <View style={{ alignItems: 'center' }}>
                                                            <CardView
                                                                cardElevation={0}
                                                                cardMaxElevation={0}
                                                                cornerRadius={8}
                                                                style={{ justifyContent: 'center', width: width - 26, alignItems: 'center', }}>

                                                                <Image
                                                                    style={{ height: 130, width: width - 26, }}
                                                                    source={{ uri: JSON.parse(slide).ADDIMAGE }}
                                                                    resizeMode='stretch'
                                                                />
                                                            </CardView>
                                                        </View >
                                                    </View >
                                                ))}
                                            </Swiper >

                                        </View >



                                    )
                                }
                            }}
                        ></FlatList>
                        {
                            DialogYesNoModal(
                                this.state.isYesNoModalVisible,
                                this.toggleModal,
                                this.toggleYesModal,
                                this.props.okDialogText,
                                this.props.SecondaryColor
                            )
                        }
                        <RenderOkDialog />
                    </View >

                </ScrollView>
            </View>




        );
    }
}


const styles = {


    gauge: {
        position: 'absolute',
        width: 150,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    gaugeText: {
        backgroundColor: 'transparent',
        color: '#ffffff',
        fontSize: 16,
        fontFamily: strings.fontMedium,

    },
    CircleShape: {

        width: 20,
        height: 20,
        borderRadius: 150 / 2,
    },
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
    },
    ShowAccountStyle:
    {
        height: 45,
        width: '75%',
        borderRadius: 8,
        marginTop: -25,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center'
    },

    TitleText:
    {
        flex: 1,
        fontFamily: strings.fontMedium,
        fontSize: 15,
        marginTop: 10,
        marginLeft: 16,
        textAlign: 'left',
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
        fontSize: RFValue(8),
        textAlign: 'center',
        fontFamily: strings.fontMedium
    },

    UserInitialBg:
    {
        width: 50,
        height: 50,
        borderRadius: 150 / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    compFooterView:
    {
        flexDirection: 'row',
        width: width - 26,
        padding: 10,
        marginBottom: 20,
    },
    compFooterInnerView:
    {
        flexDirection: 'row'
    },
    onlineServiceTouchable:
    {
        height: 75,
        borderRadius: 15,
        flexDirection: 'row',
        backgroundColor: 'white',
    },
    onlineServiceCard:
    {
        backgroundColor: 'white',
        width: (width - 30) / 2,
    },
    onlineServiceMainView:
    {
        flex: 0.4,
        height: 75,
        borderRadius: Platform.OS == 'ios' ? 15 : 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    onlineServiceInnerView:
    {
        height: 54,
        width: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center'
    },
    onlineServiceValuesView:
    {
        flex: 0.6,
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 3
    },
    eServiceText:
    {

        fontSize: RFValue(12),
        fontFamily: strings.fontBold
    },
    onlineServiceText:
    {

        fontSize: RFValue(10),
        fontFamily: strings.fontMedium
    },
    upiCard:
    {
        backgroundColor: 'white',
        marginLeft: 10,
        width: (width - 30) / 2,
    },
    upiTouchable:
    {
        height: 75,
        borderRadius: 15,
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: Platform.OS == 'ios' ? 15 : 0,
    },
    upiValuesView:
    {
        flex: 0.5,
        flexDirection: 'column',
        justifyContent: 'center',
    }

}



export default connect(mapStateToProps, mapDispatchToProps)(BankingHomeScreen);
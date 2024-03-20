import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    FlatList,
    ScrollView,
    BackHandler,
} from 'react-native';
import {
    colors,
    strings,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    navigation,
    appThemeConfiguration,
    constants,
    sendData
} from '../App';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CardView from 'react-native-cardview'
import BackArrowIcon from '../assets/icons/backArrow.svg'
import EditProfile from '../assets/icons/editProfile.svg'
import NotificationIcon from '../assets/icons/notificationIcon.svg'
import LanguageIcon from '../assets/icons/languageIcon.svg'
import SecurityIcon from '../assets/icons/securityIcon.svg'
import ThemeIcon from '../assets/icons/themeIcon.svg'
import SetpasswprdIcon from '../assets/icons/setpasswprdIcon.svg'
import Colors from '../common/Colors';
import Strings from '../common/Strings';
import { selectAccount } from '../components/CustomDialog';
import { DialogLogout } from '../components/Dialog_logout';
import Constants from '../common/Constants';
import APIUrlConstants from '../common/APIUrlConstants';
import { RFValue } from "react-native-responsive-fontsize";
import { Switch } from 'react-native-paper';


class SideProfileScreen extends Component {
    constructor(props) {
        super(props);
        this.UserName = props.route.params.UserName
        this.state = {
            ThemeMode: this.props.AppThemeSet,
            isModalVisible: false,
            isLogoutDialogVisible: false,
            viewAHeight: 0,
            isEnabled: this.props.IsNotification 
        };

        this.ThemeList = [
            { label: Strings.ThemeOne, value: '1' },
            { label: Strings.ThemeTwo, value: '2' },
        ];
        this.Profile = []
        this.ProfileDetails = [
            { label: 'Mobile Number', value: Constants.MobileNumber },
            { label: 'Last Login', value: Constants.LAST_LOGIN },
        ];

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentDidMount() {
        this.GetProfileDetails()
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        navigation.goBack(this)
        return true;
    }

    onBackAction() {
        navigation.goBack(this)
    }

    setChangePassword() {
        navigation.navigate(this, 'changeOrSetPassward')
    }

    onSelectTheme = (label) => {
        this.setState({ isModalVisible: false, ThemeMode: label })
        this.props.setAppTheme(label)
        this.props.setThemeColor(appThemeConfiguration(label).themeColor)
        this.props.setTextColor(appThemeConfiguration(label).textColor)
        this.props.setPrimaryColor(appThemeConfiguration(label).PrimaryColor)
        this.props.setSecondaryColor(appThemeConfiguration(label).SecondaryColor)
    }

    PressNo = () => {
        this.setState({ isLogoutDialogVisible: false })
    }

    PressYes = () => {
        this.setState({ isLogoutDialogVisible: false })
        this.props.setGmstCode(null)
        this.props.setSecretKey(null)
        this.props.setNAME(null)
        this.props.setUserId(null)
        this.props.setFingerPrint(false)
        this.props.setAnyDeskAllowed(false)
        this.props.setNotification(false)
        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'loginType' }],
        });
    }

    handleViewALayout = (event) => {
        const { height } = event.nativeEvent.layout;
        this.setState({ viewAHeight: height });
    };

    GetProfileDetails() {
        const Headers = APIUrlConstants.Headers("GETPROFDTLS");
        const Body =
        {
            PARACNT: "3",
            PARA1_TYP: "STR",
            PARA1_VAL: constants.GMST_CODE,
            PARA2_TYP: "STR",
            PARA2_VAL: Constants.BankCode,
            PARA3_TYP: "STR",
            PARA3_VAL: Constants.SecretKey,
        }
        sendData(this,
            'post',
            APIUrlConstants.BASE_URL,
            Headers,
            JSON.stringify(Body),
            async (obj, response) => {
                var finalRes = response
                let Data = finalRes.data
                if (Data.length > 0) {
                    Data.map((item) => {
                        this.Profile.push(JSON.parse(item))  
                    })
                }
                this.ProfileDetails = [
                    { label: 'Address', value: this.Profile[0].ADDR },
                    { label: 'City', value: this.Profile[0].CITY },
                    { label: 'Date of Birth', value: this.Profile[0].DOB },
                    { label: 'Mobile Number', value: Constants.MobileNumber },
                    { label: 'Last Login', value: Constants.LAST_LOGIN },
                ];
            })
    }

    toggleSwitch = () => {
        this.setState((prevState) => ({  isEnabled: !prevState.isEnabled }));
        if(this.state.isEnabled)
        {
            this.props.setNotification(false)
        }
        else{
            this.props.setNotification(true)
        }
    }

    render() {
        return (
            <View style={[styles.mainView, { backgroundColor: '#e5e6e7'}]}>
                <View style={styles.parent}>
                    <View style={styles.child}>
                        <View style={styles.viewContainer}>
                            <View style={[styles.mainView, {flexDirection: 'row', alignItems: 'center'}]}>
                                <TouchableOpacity style={styles.viewTouchable} onPress={() => this.onBackAction()}>
                                    <BackArrowIcon height={18} width={18} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.userNameTouchable}>
                    <View style={[styles.ProfileCircle, { backgroundColor: this.props.SecondaryColor, }]}>
                        <Text style={styles.userNameText}>
                            {this.UserName.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.accountHolderView}>
                    <Text style={[styles.userNameTextValue, { color: this.props.textColor }]}>{this.UserName}</Text>
                    <Text style={[styles.accountHolderName, { color: this.props.textColor }]}>{strings.strAccountHolderName}
                    </Text>
                </View>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.innermainView}>
                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={10}
                            style={styles.cardContainer}>
                            <View style={styles.userInfoContainer}>
                                <View style={styles.editProfileContainer}>
                                    <View>
                                        <EditProfile height={18} width={18} />
                                    </View>
                                    <Text style={[styles.TextStyle, { color: this.props.PrimaryColor }]}>User Information</Text>
                                </View>


                                <View style={[styles.verticalLine, { height: 15 }]} />
                                
                                <FlatList
                                    data={this.ProfileDetails}
                                    style={styles.FlatListStyle}
                                    renderItem={({ item }) =>
                                        <View style={styles.flatListInnerView}>
                                            <View style={[styles.flatListInnerViewTwo, {height: this.state.viewAHeight }]}>
                                                <View style={[styles.Circle, { backgroundColor: this.props.SecondaryColor, marginLeft: 19, flexDirection: 'column' }]} />
                                            <View style={[styles.verticalLine]} />
                                            </View>

                                            <View style={[styles.flatListInnerViewTwo, {flexWrap : 'nowrap'} ]} onLayout={this.handleViewALayout}>
                                         
                                            {/* <View style={[styles.flatListInnerViewTwo, {flexWrap: 'wrap' }]} onLayout={this.handleViewALayout}> */}
                                                
                                                <Text style={[styles.FlatListTextStyle, { color: this.props.PrimaryColor,}]} 
                                                numberOfLines={1}
                                                >{item.value}</Text>
                                                
                                                <Text style={{ marginHorizontal: 15, color: '#929CAC', fontSize: RFValue(10), marginBottom: 8 }}
                                                    numberOfLines={1}>{item.label}</Text>
                                                    
                                            </View>
                                        </View>
                                    }
                                />
                            </View>
                        </CardView>
                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={10}
                            style={styles.notificationCard}>
                            <View style={styles.notificationMainView}>
                                <View
                                    style={styles.notificationInnerView}>
                                    <View>
                                        <NotificationIcon height={18} width={18} />
                                    </View>
                                    <Text style={[styles.TextStyle, { color: this.props.PrimaryColor }]}>
                                        {strings.strNotification}
                                    </Text>
                                    <View style={styles.switchMainView}>
                                        <Switch
                                            trackColor={{ false: '#767577', true: this.props.SecondaryColor + '1A', }}
                                            thumbColor={this.state.isEnabled ? this.props.SecondaryColor : '#f4f3f4'}
                                            ios_backgroundColor="#f4f3f4"
                                            onValueChange={this.toggleSwitch}
                                            value={this.state.isEnabled}
                                            cardElevation={3}                                               
                                        />
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.langTouchable}>
                                    <View>
                                        <LanguageIcon height={18} width={18} />
                                    </View>
                                    <Text style={[styles.TextStyle, { color: this.props.PrimaryColor }]}>
                                        {strings.strLanguage}
                                    </Text>
                                    <View style={styles.switchMainView}>
                                        <Text style={[styles.TextAnsStyle, { color: this.props.SecondaryColor }]}>
                                            {strings.strEnglish}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </CardView>
                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={10}
                            style={styles.notificationCard}>
                            <View style={styles.notificationMainView}>
                                <View style={styles.notificationInnerView}>
                                    <View>
                                        <SecurityIcon height={18} width={18} />
                                    </View>
                                    <Text style={[styles.TextStyle, { color: this.props.PrimaryColor }]}>
                                        {strings.strSecurity}
                                    </Text>
                                </View>
                                <TouchableOpacity style={styles.langTouchable}
                                    onPress={() => this.setState({ isModalVisible: true, labelText: strings.showBal })}>
                                    <View>
                                        <ThemeIcon height={18} width={18} />
                                    </View>
                                    <Text style={[styles.TextStyle, { color: this.props.PrimaryColor }]}>
                                        {strings.strTheme}
                                    </Text>
                                    <View style={styles.switchMainView}>
                                        <Text style={[styles.TextAnsStyle, { color: this.props.SecondaryColor }]}>
                                            {this.state.ThemeMode}
                                        </Text>
                                    </View>
                                    {
                                        selectAccount(
                                            this.state.isModalVisible,
                                            this.ThemeList,
                                            this.onSelectTheme,
                                            "Select Theme",
                                            this.props.AppThemeSet,
                                            "Theme",
                                        )
                                    }
                                </TouchableOpacity>
                            </View>
                        </CardView>
                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={10}
                            style={styles.notificationCard}>
                            <TouchableOpacity style={styles.notificationMainView}
                                onPress={() => this.setChangePassword()}>
                                <View style={styles.langTouchable}>
                                    <View>
                                        <SetpasswprdIcon height={18} width={18} />
                                    </View>
                                    <Text style={[styles.TextStyle, { color: this.props.PrimaryColor }]}>
                                        {strings.strSetChangePassword}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </CardView>
                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={10}
                            style={styles.notificationCard}>
                            <TouchableOpacity style={[styles.logoutTouchable, { backgroundColor: this.props.SecondaryColor }]}
                                onPress={() => this.setState({ isLogoutDialogVisible: true, })}>
                                <View style={styles.logoutView}>
                                    <Text style={styles.logoutText}>
                                        {strings.strLogout}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </CardView>
                        {

                            DialogLogout(this.state.isLogoutDialogVisible, this.PressNo, this.PressYes, this.props.SecondaryColor)
                        }
                    </View>
                </ScrollView>
            </View>
        );
    }
}




const styles = StyleSheet.create({
    parent: {
        height: '28%',
        width: '100%',
        transform: [{ scaleX: 2 }],
        borderBottomStartRadius: 200,
        borderBottomEndRadius: 200,
        overflow: 'hidden',
    },
    child: {
        flex: 1,
        transform: [{ scaleX: 0.5 }],
        backgroundColor: '#EBF0F0',
    },
    Circle:
    {
        width: 40,
        height: 40,
        marginTop: -35,
        marginLeft: 90,
        borderWidth: 2,
        borderColor: colors.white,
        backgroundColor: colors.profilemenu,
        borderRadius: 150 / 2,
        alignItems: 'center',
        justifyContent: 'center'

    },
    ProfileCircle:
    {
        width: 120,
        height: 120,
        borderRadius: 150 / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    Circle:
    {
        width: 10,
        height: 10,
        borderRadius: 10 / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    TextStyle:
    {
        marginLeft: 15,
        fontSize: RFValue(13),
        fontFamily: strings.fontMedium,
    },

    FlatListTextStyle:
    {
        marginLeft: 15,
        fontSize: RFValue(13),
        fontFamily: strings.fontMedium,
        marginTop: -2 
    },

    TextAnsStyle:
    {
        marginLeft: 15,
        fontSize: RFValue(13),
        fontFamily: strings.fontMedium
    },
    verticalLine: {
        borderLeftWidth: 1, // Set the width of the line
        borderColor: Colors.btnDisable, // Set the color of the line
        marginLeft: 24,
        flex: 1,

    },
    ItemSepraterr:
    {
        height: 0.5,
        width: '90%',
        backgroundColor: colors.backgroundColor,
        alignSelf: 'center'
    },
    mainView:
    {
        flex: 1,
    },
    viewContainer:
    {
        flexDirection: 'row',
        marginTop: 50,
        marginHorizontal: 10,
    },
    viewTouchable:
    {
        padding: 10,
        justifyContent: 'center',
    },
    userNameTouchable:
    {
        justifyContent: 'center',
         alignItems: 'center', 
         marginTop: -140,
    },
    userNameText:
    {
        color: 'white',
        fontSize: RFValue(35),
        fontFamily: strings.fontBold
    },
    accountHolderView:
    {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,

    },
    userNameTextValue:
    {
        fontSize: RFValue(18),
        textAlign: 'left',
        fontFamily: strings.fontBold,
    },
    accountHolderName:
    {
        marginTop: 10,
                        fontSize: RFValue(14),
                        textAlign: 'left',
                        fontFamily: strings.fontRegular,
    },
    scrollView:
    {
        marginTop: 10, 
        marginBottom: 40
    },
    innermainView:
    {
        padding: 15
    },
    cardContainer:
    {
        justifyContent: 'center'
    },
    userInfoContainer:
    {
        borderRadius: 10, 
        backgroundColor: 'white', 
        paddingVertical: 5
    },
    editProfileContainer:
    {
        marginTop: 15,
        marginLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    flatListInnerView:
    {
        flexDirection: 'row', 
        flexWrap: 'wrap',
    },
    flatListInnerViewTwo:
    {
        flexDirection: 'column', 
    },
    notificationCard:
    {
        marginTop: 15,
        justifyContent: 'center'
    },
    notificationMainView:
    {
        borderRadius: 10,
        backgroundColor: 'white'
    },
    notificationInnerView:
    {
        marginTop: 15,
        marginLeft: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    switchMainView:
    {
        flex: 1,
        alignItems: 'flex-end',
        marginRight: 15,
    },
    langTouchable:
    {
        marginTop: 15,
        marginLeft: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoutView:
    {
        marginTop: 15,
        marginBottom: 15,
        alignItems: 'center',
    },
    logoutText:
    {
        color: colors.white,
        fontSize: RFValue(13),
        fontFamily: strings.fontBold,
        textAlign: 'center'
    },
    logoutTouchable:
    {
        borderRadius: 10,
                                 
    }
})


export default connect(mapStateToProps, mapDispatchToProps)(SideProfileScreen);
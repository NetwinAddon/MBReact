
//  RGP

import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    ImageBackground,
    FlatList,
    StyleSheet,
    BackHandler,
} from 'react-native';
import {
    colors,
    strings,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    width,
    navigation,
    appThemeConfiguration,
    config,
    RenderLoader,
} from '../../../../App';

import { RFValue } from "react-native-responsive-fontsize";
import { TextInput } from 'react-native-paper';
import TrasnsperantFixedHeader from '../../../../components/TrasnperantFixedHeader';
import CardView from 'react-native-cardview';
import { ScrollView } from 'react-native-gesture-handler';
import Arrow from '../../../../assets/icons/Vectorarrow.svg';
import Constants from '../../../../common/Constants';
import { _toEncrypt, decryptData, sendData, } from '../../../../common/util';
import APIUrlConstants from '../../../../common/APIUrlConstants';
import BBPS from '../../../../assets/icons/BBPS_Logo.svg';


class ElectricityBillScreen extends Component {
    constructor(props) {
        super(props);
        this.RechargePlans = [
            {
                provider: 'Maharashtra State Electricity Distribution Company Limited',
                BillAmount: '151',
                Date: '5th Nov 2023',
                ID: 'MAHA00000MAH01',
                validity: '27 day',
                AC_No: '143652050666',
                code: 'MSEDCL',
                LOGO: require('../../../../assets/icons/ElectricityIcons/MSEB-elect.png'),
            },
            {
                provider: 'Gulbarga Electricity Supply Company Limited (GESCOM)',
                BillAmount: '299',
                Date: '30th Dec 2023',
                ID: 'GESCOM00KAR01',
                validity: '',
                AC_No: '143652050666',
                code: 'GESCOM',
                LOGO: require('../../../../assets/icons/ElectricityIcons/GESCOM-elect.png'),
            },
        ];




        this.state = {
            isModalVisible: false,
            isStateModalVisible: false,
            selectedValue: 'option1',
            labelText: '',
            amount: '',
            remark: '',
            searchTerm: '',
            searchTermAct: 0,
            matchedBank: null,
            searchPerformed: false,
            constactsNumbers: [],
            Billerlist: '',
            searchTermAct: 0,

            searchTerm: '',
            filteredData: {},
        };


        this.ElectricityProviderLogos = {
            MAHA00000MAH01: require('../../../../assets/icons/ElectricityIcons/MSEB-elect.png'),
            GESCOM000KAR01: require('../../../../assets/icons/ElectricityIcons/GESCOM-elect.png'),
            BESCOM000KAR01: require('../../../../assets/icons/ElectricityIcons/BESCOM-Elect.png'),
            CESCOM000KAR01: require('../../../../assets/icons/ElectricityIcons/CESC---Elect.png'),
            MESCOM000KAR01: require('../../../../assets/icons/ElectricityIcons/MESCOM-elect.png'),
            HESCOM000KAR01: require('../../../../assets/icons/ElectricityIcons/HESCOM-elct.png'),
            KSEBL0000KER01: require('../../../../assets/icons/ElectricityIcons/KSEB-elect.png'),
            TNEB00000TND01: require('../../../../assets/icons/ElectricityIcons/Tamilnadu-elect.png'),
            TORR00000SUR04: require('../../../../assets/icons/ElectricityIcons/torrent-electricity.png'),
            DGVCL0000GUJ01: require('../../../../assets/icons/ElectricityIcons/DGVCL-elec.png'),
            PGVCL0000GUJ01: require('../../../../assets/icons/ElectricityIcons/PGVCL-Elec.png'),
            UGVCL0000GUJ01: require('../../../../assets/icons/ElectricityIcons/UGVCL-elec.png'),
            MGVCL0000GUJ01: require('../../../../assets/icons/ElectricityIcons/MGVCL-elec.png'),
            RELI00000MUM03: require('../../../../assets/icons/ElectricityIcons/adani-electricity.png'),
            TORR00000BHW03: require('../../../../assets/icons/ElectricityIcons/torrent-electricity.png'),
            TATAPWR00MUM01: require('../../../../assets/icons/ElectricityIcons/tata-electricity.png'),
            BEST00000MUM01: require('../../../../assets/icons/ElectricityIcons/Best-electricity.png'),
            TORR00000AHM02: require('../../../../assets/icons/ElectricityIcons/torrent-electricity.png'),
        };
    }

    renderAllProviders = ({ item }) => {
        console.log(item);
        const biller = JSON.parse(item);
        const billerName = biller.BILLERNAME;
       

        return (
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('billFetch',
                    {
                        ProviderName: billerName,
                        ID: biller.BILLERID,
                        LOGO: this.ElectricityProviderLogos[biller.BILLERID],
                        BILLERSRNO: biller.BILLERSRNO,
                        BILLERFETCHREQUIREMET: biller.BILLERFETCHREQUIREMET,
                    })}>
                <View style={styles.renderView}>
                    <View style={styles.iconContainer}>
                        <View style={styles.simIcon}>
                            <Image source={this.ElectricityProviderLogos[biller.BILLERID]} style={styles.simIconStyle}></Image>
                        </View>
                    </View>
                    <View style={styles.textView}>
                        <Text style={styles.username}>{billerName}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    SearchBiller = ({ item }) => {
     
        return (
            <TouchableOpacity
                onPress={() => this.props.navigation.navigate('billFetch',
                    {
                        ProviderName: item.BILLERNAME,
                        ID: item.BILLERID,
                        LOGO: this.ElectricityProviderLogos[item.BILLERID],
                        BILLERSRNO: item.BILLERSRNO,
                        BILLERFETCHREQUIREMET: item.BILLERFETCHREQUIREMET,
                    })}
            >
                <View style={styles.renderView}>
                    <View style={styles.iconContainer}>
                        <View style={styles.simIcon}>
                            <Image source={this.ElectricityProviderLogos[item.BILLERID]} style={styles.simIconStyle}></Image>
                        </View>
                    </View>
                    <View style={styles.textView}>
                        <Text style={styles.username}>{item.BILLERNAME}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    handleSearch(searchTerm) {
        const biller = this.state.Billerlist;
        const mainArry = biller.map((jsonStr) => JSON.parse(jsonStr))
        const filteredData = mainArry.filter(item => {
            const searchTermLower = searchTerm.toLowerCase();
            return (
                item.BILLERNAME.toLowerCase().includes(searchTermLower)
            );
        });
        this.setState({ filteredData: JSON.stringify(filteredData) });
    };





    renderRecentBillPayment = ({ item }) => (
        <CardView
            cardElevation={3}
            cardMaxElevation={5}
            cornerRadius={15}
            style={styles.recentCardContainer}
        >
            <TouchableOpacity
            // onPress={() => this.props.navigation.navigate('billFetch', {
            //     RechargeAmount: item.RechargeAmount,
            //     UserName: this.props.route.params.name,
            //     MobileNumber: this.props.route.params.mobno
            //  onPress={() => this.props.navigation.navigate('billPayment', { ProviderName: item.provider, ID: item.ID })}

            >
                <View style={styles.container}>
                    <View style={styles.iconContainer}>
                        <View style={styles.simIcon}>
                            <Image source={item.LOGO} style={styles.simIconStyle}></Image>
                        </View>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.providerText} numberOfLines={1} ellipsizeMode="tail">{item.provider}
                        </Text>
                        <Text style={styles.idText}>ID: {item.ID}</Text>
                        <View style={styles.detailsContainer}>
                            <View style={styles.innerDetailsView}>
                                <Text style={styles.accountNo} numberOfLines={1} ellipsizeMode="tail">A/c No:{item.AC_No}
                                </Text>
                                <Text style={styles.lastText}>Last Bill ₹1690, Paid On 11th May 2023</Text>
                            </View>
                            <View style={styles.arrowIcon}>
                                <Arrow ></Arrow>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </CardView>
        // </TouchableOpacity>

    );

    getBillList = async () => {
        const Headers =
        {
            ProdCD: Constants.ProdCD,
            BankCD: Constants.BankCode,
            OprCD: 'GETBILLLIST',
            Content_Type: 'application/json',
            REQ_TYPE: 'POST'
        };
        const jsonReq =
        {
            CUSTOMER_ID: Constants.GMST_CODE,
            BILLERCATEGORY: 'ELECTRICITY',
            CORPID: Constants.BRANCH_CODE,
            SEC_KEY: Constants.SecretKey,
            divId: this.props.DeviceId,
            secKey: Constants.SecretKey
        }

        let jsonValue = await _toEncrypt(JSON.stringify(jsonReq))



        const Body =
        {
            PARACNT: "1",
            PARA1_TYP: "STR",
            PARA1_VAL: JSON.stringify(jsonValue),
        }

        console.log("Change Mpin URL:- " + APIUrlConstants.BASE_URL);
        console.log("");
        console.log("Change Mpin JSON:- " + JSON.stringify(Body));
        console.log("");

        console.log("Change Mpin sub JSON:- " + JSON.stringify(jsonReq));

        sendData(this,
            'post',
            APIUrlConstants.BASE_URL,
            Headers,
            JSON.stringify(Body),
            async (obj, response) => {

                var responseData = await decryptData(response)
                var newRes = responseData.slice(16)

                var finalRes = JSON.parse(newRes)
                console.log('finalRes--' + finalRes)

                if (finalRes.SUCCESS === "TRUE") {
                    if (finalRes.hasOwnProperty('BILLER')) {

                        this.setState({ Billerlist: finalRes.BILLER })
                    }


                }
                else {

                    const Msg = finalRes.RESULT
                    // ToastAndroid.show(Msg, ToastAndroid.SHORT)
                    Snackbar.show({
                        text: Msg,
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: 'red'
                    });




                }

            })
    }
    componentDidMount() {

        this.getBillList()


    }
    bgImage = appThemeConfiguration(config.themeColor).bgImg





    onBackAction() {
        navigation.goBack(this)
    }


    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    handleBackButton = () => {
        navigation.goBack(this)
        return true;
    };

    toOwnAccTransfer() {
        navigation.navigate(this, 'ownAccTransferScreen')
        console.log('hellooooo')
    }

    toReview() {
        navigation.navigate(this, 'quickPayWithinBankOtherAccount')
    }


    onSelectOperator = (value) => {
        console.log('valueeeeeeeeee' + value)
        { value !== '' || value !== 'undefined' ? console.log('true') : console.log('false') }
        this.setState({ isModalVisible: false, operaterName: value })
        console.log("state.isModalVisible", this.state.isModalVisible, value);
        // renderWelcomeMsg()


    }

    onSelectState = (value) => {
        console.log('valueeeeeeeeee' + value)
        { value !== '' || value !== 'undefined' ? console.log('true') : console.log('false') }
        this.setState({ isStateModalVisible: false, StateName: value })
        console.log("state.isStateModalVisible", this.state.isStateModalVisible, value);
        // renderWelcomeMsg()


    }

    render() {

        return (
            <View style={styles.mainContainer}>
                <ImageBackground style={styles.mainContainer} source={this.bgImage} resizeMode='cover'>
                    <TrasnsperantFixedHeader backAction={() => this.onBackAction()} />
                    <View style={styles.headingContainer}>
                        <View style={styles.innerContainer}>
                            <Text style={styles.title}>Electricity Bill Pay
                            </Text>
                            <Text style={styles.subTitle}>Select Your Electricity Provider
                            </Text>
                        </View>
                    </View>
                    <View style={styles.containerView}>
                        <View style={styles.rowContainer}>
                            <View style={styles.bbpsContainer}>
                                <BBPS style={styles.bbpsStyle} />
                            </View>
                        </View>
                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={6}
                            style={styles.cardContainer}
                        >
                            <TextInput
                                maxLength={10}
                                style={[styles.textInput, { color: this.props.textColor }]}
                                onChangeText={(text) => {
                                    if (text.length === 0) {
                                        this.setState({ searchTermAct: 0 });
                                    } else {
                                        this.setState({ searchTermAct: 1 });
                                        this.handleSearch(text);
                                    }
                                }}
                                placeholder='Search Provider Name'
                            />
                            <View style={styles.iconContainer1}>
                                <Image
                                    style={styles.icon}
                                    source={require('../../../../assets/icons/search.png')}
                                />
                            </View>
                        </CardView>
                        <ScrollView>
                            <View style={styles.viewStyle}>
                                {this.state.searchTermAct === 0 ? (
                                    <View style={styles.innerView}>
                                        <Text style={styles.titleView}>{'Recent'}</Text>
                                        <FlatList
                                            data={this.RechargePlans}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={this.renderRecentBillPayment}
                                        />
                                    </View>
                                ) : null}
                            </View>
                            <View style={styles.flatlistContainer}>
                                {
                                    this.state.searchTermAct === 0 ? (
                                        <View style={styles.headerView}>
                                            <Text style={styles.headerText}>{`Other Provider`}</Text>
                                        </View>) : null}
                                <ScrollView>
                                    <View style={styles.headerContent}>
                                        {
                                            this.state.searchTermAct === 0 ? (
                                                <View>
                                                    <FlatList
                                                        data={this.state.Billerlist}
                                                        keyExtractor={(item, index) => index.toString()}
                                                        renderItem={this.renderAllProviders}
                                                    />
                                                </View>
                                            ) : (
                                                <View>
                                                    <FlatList
                                                        data={JSON.parse(this.state.filteredData)}
                                                        keyExtractor={(item, index) => index.toString()}
                                                        renderItem={this.SearchBiller}
                                                    />
                                                </View>
                                            )}
                                    </View>
                                </ScrollView>
                            </View>
                        </ScrollView>
                    </View>
                </ImageBackground>
                <RenderLoader />
            </View>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ElectricityBillScreen);


const styles = StyleSheet.create({
    recentCardContainer: {
        backgroundColor: 'white',
        width: width - 55,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 8,
        alignSelf: 'center',
        borderRadius: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    container: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        marginBottom: 5,
        width: width - 50,
    },

    iconContainer: {
        flex: 1,
        marginRight: 10,
    },

    renderView: {
        flexDirection: 'row',
        padding: 9,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems: 'center',
    },
    simIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 0.5,
        elevation: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    simIconStyle: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        flex: 4,

    },
    providerText: {
        fontSize: 14,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        color: "#000",
        textAlign: "left"
    },
    idText: {
        fontSize: 12,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        color: "#929cac",
        textAlign: "left",
        width: 130
    },
    detailsContainer: {
        flexDirection: 'row',
        marginTop: 5,
        borderRadius: 15,
        backgroundColor: "#edeff4",
        flex: 1,
        height: 45,
        padding: 9,

    },
    innerDetailsView: {
        width: '92%'
    },
    accountNo: {
        fontSize: 13,
        lineHeight: 15,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        color: "#252525",
        textAlign: "left",
        opacity: 0.8
    },
    lastText: {

        fontSize: 10,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        color: "#929cac",
        textAlign: "left",
        //  width: 130

    },
    arrowIcon: {
        alignSelf: 'center',
        width: '8%'
    },
    textView: { flex: 4 },
    username: {
        fontSize: RFValue(14),
        fontWeight: '500',
        color: '#000',
        width: '90%'
    },
    mobileNumber: {
        fontSize: 16,
    },
    rechargeAmount: {
        fontSize: 16,

        fontWeight: "500",
        fontFamily: "SF UI Display",
        color: "#1f3c66",
        textAlign: "left"
    },
    logo: {
        width: 50,
        height: 20,
    },
    mainContainer: {
        flex: 1
    },
    headingContainer: {
        flex: 0.15,
    },
    innerContainer: {
        marginLeft: 25,
        marginTop: 15,
    },
    containerView: {
        flex: 0.85,
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    rowContainer: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
        width: width - 50,
        marginTop: 5,
    },
    bbpsContainer: {
        alignItems: 'flex-end',
        width: width - 60,
    },
    bbpsStyle: {
        marginTop: 5,
    },
    title: {
        fontSize: 22,
        textAlign: 'left',
        fontFamily: strings.fontBold,
        color: colors.white,
    },
    subTitle: {
        fontSize: 15,
        textAlign: 'left',
        fontFamily: strings.fontMedium,
        color: colors.white,
    },
    cardContainer: {
        height: 48,
        backgroundColor: 'white',
        width: width - 50,
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 8,
    },
    textInput: {
        flex: 0.95,
        height: 50,
        backgroundColor: 'white',
        fontFamily: strings.fontRegular,
        fontSize: 17,
    },
    iconContainer1: {
        marginLeft: 5,
    },
    icon: {
        height: 23,
        width: 23,
    },
    viewStyle: {
        alignItems: 'center',
    },
    innerView: {
        flex: 1,
        width: width - 50,
    },
    titleView: {
        textAlign: 'left',
    },
    flatlistContainer: {
        flex: 0.85,
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    headerView: {
        width: width - 60,
    },
    headerText: {
        textAlign: 'left',
    },
    headerContent: {
        width: width - 50,
    },
});

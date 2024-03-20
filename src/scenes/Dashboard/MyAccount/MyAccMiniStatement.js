import React, { useEffect, useState, Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform,
    ScrollView,
    SectionList,
    StyleSheet,
    BackHandler,
} from 'react-native';
import {
    colors,
    strings,
    assets,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    width,
    navigation,
    appThemeConfiguration,
    config,
    height,
    constants,
    RenderLoader,

} from '../../../App';

import { useRoute } from '@react-navigation/native';
import CardView from 'react-native-cardview'
import Arrowdown from '../../../assets/icons/dashboardIcons/arrow_down.svg';
import TrasnsperantFixedHeader from '../../../components/TrasnperantFixedHeader';
// import Download from '../assets/icons/fi-rr-download.svg'
import Doc from '../../../assets/icons/document-signed.svg'
import Profile from '../../../assets/icons/MiniStatementMyAcc.svg'
import Deposit from '../../../assets/icons/deposited.svg'
import Withdraw from '../../../assets/icons/withdraw.svg'


import Download from '../../../assets/icons/fi-rr-download.svg'
import EditProfileIcon from '../../../assets/icons/editProfileIcon.svg'
import moment from 'moment'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { FlatList } from 'react-native-gesture-handler';
import Constants from '../../../common/Constants';
import APIUrlConstants from '../../../common/APIUrlConstants';
import { decryptData, sendData } from '../../../common/util';
import { RFValue } from "react-native-responsive-fontsize";





class MyAccMiniStatement extends Component {

    constructor(props) {
        super(props);

        const AccountData = this.props.route.params

        this.AccountDetails = AccountData

        this.UserName = AccountData.NAME

        this.UserBalance = AccountData.BALANCE

        this.UserAccountNo = AccountData.AC_NO

        this.UserAccountType = AccountData.ACTYPE

        this.UserACMASTCODE = AccountData.ACMASTCODE



        this.MiniStatement = []

        this.state = {
            startDate: new Date(),
            endDate: new Date(),
            startShowDatePicker: false,
            endShowDatePicker: false,
            initialDate: false,
            showDatePicker: false,
            hrpdata: [],
            isLoading: true,
            page: 1,
            itemsToShow: 10,
            start_count: 0,
            end_count: 30
        };
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);


    }

    componentDidMount() {
        this.GetMiniStatementList()


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


    GetMiniStatementList() {

        const Headers = APIUrlConstants.Headers("GETACSTAT");

        const Body =
        {
            PARACNT: "5",
            PARA1_TYP: "STR",
            PARA1_VAL: Constants.GMST_CODE,
            PARA2_TYP: "STR",
            PARA2_VAL: this.UserAccountNo,
            PARA3_TYP: "STR",
            PARA3_VAL: this.UserACMASTCODE,
            PARA4_TYP: "STR",
            PARA4_VAL: Constants.BankCode,
            PARA5_TYP: "STR",
            PARA5_VAL: Constants.SecretKey,
        }

        sendData(this,
            'post',
            APIUrlConstants.BASE_URL,
            Headers,
            JSON.stringify(Body),
            async (obj, response) => {
                var responseData = response

                if (responseData === "FALSE") {
                    return okDialog(this, "Hellos")
                }
                else {

                    console.log("MiniStatement response is", JSON.stringify(response))
                    let res = response.Acdtls

                    let mainArry = [];
                    mainArry = res.map((jsonStr) => JSON.parse(jsonStr))

                    // console.log('resss', mainArry)

                    this.setState({ hrpdata: mainArry })

                }
            })






    }


    LoadMoreOnPress = () => {

        //increment next value by 30 in load more press
        this.setState((prevState) => ({

            start_count: prevState.end_count,
            end_count: prevState.end_count + 30,


        }), () => {
            console.log("start ", this.state.start_count)
            console.log("end ", this.state.end_count)
            this.GetMiniStatementList()
        });


    }






    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg


    // renderListItem = ({ item }) => {


    //     return (
    //         <View style={{
    //             flexDirection: 'row',
    //             alignItems: 'center', marginVertical: 10
    //         }}>
    //             {item.DRCR === ('TO') ?
    //                 //    uparrow
    //                 <View style={{
    //                     height: 36,
    //                     width: 36,
    //                     borderRadius: 36 / 2,
    //                     backgroundColor: "#eb5757" + '1A',
    //                     alignItems: 'center',
    //                     justifyContent: 'center',
    //                     // marginTop: 5,
    //                     // marginBottom: 5
    //                 }}>
    //                     <Withdraw height={16} width={16} color={'#eb5757'} />
    //                 </View>

    //                 :
    //                 // downArrow
    //                 <View style={{
    //                     height: 36,
    //                     width: 36,
    //                     borderRadius: 36 / 2,
    //                     backgroundColor: "#27ae60" + '1A',
    //                     alignItems: 'center',
    //                     justifyContent: 'center',
    //                     // marginTop: 5,
    //                     // marginBottom: 5
    //                 }}>
    //                     <Deposit height={16} width={16} color={'#27ae60'} />
    //                 </View>

    //             }



    //             {/* <Icon name={iconName} size={20} color={iconColor} style={{ marginRight: 10 }} /> */}
    //             <View
    //                 style={{ flex: 1, flexDirection: 'row' }}
    //             >
    //                 <View
    //                     style={{
    //                         marginLeft: 5,
    //                         padding: 2,
    //                         flex: 0.75
    //                     }}
    //                 >
    //                     <Text
    //                         style={{
    //                             fontFamily: strings.fontMedium,
    //                             fontSize: RFValue(12),
    //                             color: 'black'
    //                         }}
    //                         numberOfLines={1}
    //                     >{item.PRTCLS}</Text>

    //                     <Text
    //                         style={{
    //                             fontFamily: strings.fontRegular,
    //                             fontSize: RFValue(12),
    //                             color: '#929CAC'
    //                         }}
    //                     >{moment(item.TDATE).format("DD MMM YYYY")}</Text>

    //                 </View>

    //                 <Text style={{
    //                     flex: 0.25,
    //                     textAlign: 'right',
    //                     padding: 5,
    //                     fontFamily: strings.fontRegular,
    //                     fontSize: RFValue(12),
    //                     color: item.DRCR === ('TO') ? '#EB5757' : '#27AE60',
    //                 }}>{item.DRCR === 'TO' ? "₹ " + item.DEBIT +" Dr" : "₹ " + item.CREDIT+" Cr"}</Text>


    //             </View>


    //         </View>
    //     );
    // };

    renderListItem = ({ item }) => {
        const { filteredData } = this.state;

        return (
            <View style={styles.MainView}>

                {item.DRCR === ('TO') ?
                    <View style={styles.WithDrawIcon}>
                        <Withdraw height={16} width={16} color={'#eb5757'} />
                    </View>
                    :
                    <View style={styles.DeposityIcon}>

                        <Deposit height={16} width={16} color={'#27ae60'} />
                    </View>

                }
  

                <View style={styles.SubMainView}>

                    <View style={styles.InnerLayputView}>

                        <Text
                            style={styles.PerticularStyle}
                            numberOfLines={1}>{item.PRTCLS}</Text>

                        <Text style={[styles.DrCrStyle, { color: item.DRCR === ('TO') ? '#EB5757' : '#27AE60' }]}
                            numberOfLines={1}
                        >{item.DRCR === 'TO' ? "₹ " + item.DEBIT + " Dr" : "₹ " + item.CREDIT + " Cr"}</Text>


                    </View>

                    <View style={styles.InnerLayputView}>


                        <Text style={styles.DateStyle}> {moment(item.TDATE).format("DD MMM YYYY")}</Text>

                    </View>

                </View>

            </View>
        );
    };


    _onDateSelectedForStartDate = (selDate) => {
        this.setState({ startDate: selDate, startShowDatePicker: false })
        console.log("start date is", this.state.startDate)

    }

    _onDateSelectedForEndDate = (selDate) => {
        this.setState({ endDate: selDate, endShowDatePicker: false })
        console.log("end date is", this.state.endDate)
    }

    _startHideDatePicker = () => {
        this.setState({ startShowDatePicker: false });
    };

    _endHideDatePicker = () => {
        this.setState({ endShowDatePicker: false });
    };

    toMyAcc() {
        navigation.navigate(this, 'myAccDetails', this.AccountDetails)
    }

    onBackAction() {
        navigation.goBack(this)
    }


    toDownload() {
        navigation.navigate(this, 'myAccountDownloadStatement', this.AccountDetails)
    }

    toOwnAccTransfer() {
        navigation.navigate(this, 'ownAccTransferScreen')
        console.log('hellooooo')
    }

    render() {

        return (


            <View style={{ flex: 1 }}>

                <ImageBackground style={{ flex: 1 }}
                    source={this.bgImage}
                    resizeMode='cover'
                >


                    <TrasnsperantFixedHeader
                        backAction={() => this.onBackAction()}
                    />

                    <View style={{ flex: 0.15 }}>
                        <View style={{
                            marginLeft: 25,
                            marginBottom: 10,
                        }}>
                            <Text style={{
                                fontSize: 20,
                                color: 'black',
                                textAlign: 'left',
                                fontFamily: strings.fontBold,
                                color: colors.white,
                            }}>Mini Statement
                            </Text>

                            <Text style={{
                                fontSize: 15,
                                color: 'black',
                                textAlign: 'left',
                                fontFamily: strings.fontMedium,
                                color: colors.white,
                            }}>Check your latest minimized statement
                            </Text>

                        </View>
                    </View>

                    <View style={{
                        flex: 0.85,
                        alignItems: 'center',
                        backgroundColor: 'white',
                        borderTopLeftRadius: 25,
                        borderTopRightRadius: 25,

                    }}>

                        <View style={{
                            marginTop: -30,

                        }}>
                            {/* profile card */}
                            <CardView
                                cardElevation={3}
                                cardMaxElevation={3}
                                cornerRadius={30}
                                style={{
                                    backgroundColor: this.props.PrimaryColor,
                                    height: 130, width: width - 40,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>

                                <View style={{
                                    // justifyContent: 'space-between',
                                    alignItems: 'center',
                                    height: 140,
                                    width: width - 60,
                                    flexDirection: 'row',
                                }}>
                                    <View style={{
                                        flex: 0.5,
                                        justifyContent: 'center',
                                        padding: 10

                                    }}>
                                        <View
                                            style={{
                                                flex: 0.5,
                                                // backgroundColor: 'red',
                                                justifyContent: 'center',
                                                // alignItems: 'center'
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: '#7E8CA0',
                                                    fontFamily: strings.fontRegular,
                                                    fontSize: 12
                                                }}
                                            >Full Name</Text>

                                            <Text
                                                style={{
                                                    color: 'white',
                                                    fontFamily: strings.fontRegular,
                                                    fontSize: 15
                                                }}
                                            >{this.UserName}</Text>
                                        </View>

                                        <View
                                            style={{
                                                flex: 0.5,
                                                // backgroundColor: 'red',
                                                justifyContent: 'center',
                                                // alignItems: 'center'
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: '#7E8CA0',
                                                    fontFamily: strings.fontRegular,
                                                    fontSize: 13
                                                }}
                                            >Account Number</Text>
                                            <Text
                                                style={{
                                                    color: 'white',
                                                    fontFamily: strings.fontRegular,
                                                    fontSize: 15
                                                }}
                                            >{this.UserAccountNo}</Text>
                                        </View>

                                    </View>

                                    <View
                                        style={{
                                            flex: 0.5,
                                            justifyContent: 'center',
                                            padding: 10
                                        }}
                                    >
                                        <View
                                            style={{
                                                flex: 0.5,
                                                // backgroundColor: 'red',
                                                justifyContent: 'center',
                                                // alignItems: 'center'
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: '#7E8CA0',
                                                    fontFamily: strings.fontRegular,
                                                    fontSize: 12
                                                }}
                                            >Available Balance</Text>
                                            <Text
                                                style={{
                                                    color: 'white',
                                                    fontFamily: strings.fontRegular,
                                                    fontSize: 15
                                                }}

                                            >{this.UserBalance.startsWith('-') ? ("₹ " + this.UserBalance.replace('-', '') + " Cr") : ("₹ " + this.UserBalance + " Dr")}</Text>
                                        </View>

                                        <View
                                            style={{
                                                flex: 0.5,
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    color: '#7E8CA0',
                                                    fontFamily: strings.fontRegular,
                                                    fontSize: 12
                                                }}
                                            >Account Type</Text>
                                            <Text
                                                style={{
                                                    color: 'white',
                                                    fontFamily: strings.fontRegular,
                                                    fontSize: 15
                                                }}
                                            >{this.UserAccountType}</Text>
                                        </View>

                                    </View>

                                </View>
                            </CardView>
                        </View>

                        {/* download and my Account */}
                        <View
                            style={{
                                height: 70,
                                // width : 
                                width: width - 80,
                                flexDirection: 'row',
                                // justifyContent : 'center',
                                alignItems: 'center',
                                backgroundColor: '#e4e7ed',
                                marginTop: -35,
                                zIndex: -1,
                                borderBottomEndRadius: 15,
                                borderBottomLeftRadius: 15

                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                }}

                            >
                                {/* mini statement */}

                                <TouchableOpacity
                                    style={{
                                        flex: 0.5,
                                        height: 70,
                                        // flex: 1,
                                        alignItems: 'flex-end',
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                        paddingBottom: 12

                                    }}
                                    onPress={() => this.toDownload()}

                                >
                                    <View
                                        style={{
                                            height: 15,
                                            width: 15,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            //   backgroundColor : 'red',
                                            marginRight: 3
                                        }}
                                    >
                                        <Download height={12} width={12} fill={this.props.SecondaryColor} />

                                    </View>
                                    <Text
                                        style={{
                                            fontSize: 11,
                                            color: '#686868',
                                            fontFamily: strings.fontMedium


                                        }}
                                    >Download Statement</Text>
                                </TouchableOpacity>
                                {/* devider */}
                                <View
                                    style={{

                                        // height: '100%',
                                        width: 1,
                                        backgroundColor: '#ced1df',
                                    }}
                                />
                                {/* my  Acc */}
                                <TouchableOpacity
                                    style={{
                                        height: 70,
                                        flex: 0.5,
                                        alignItems: 'flex-end',
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                        // backgroundColor : 'red',
                                        paddingBottom: 12
                                    }}
                                    onPress={() => this.toMyAcc()}
                                >
                                    <View
                                        style={{
                                            height: 15,
                                            width: 15,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            //   backgroundColor : 'red',
                                            marginRight: 3
                                        }}
                                    >
                                        <Profile height={12} width={12} fill={this.props.SecondaryColor} />

                                    </View>
                                    <Text
                                        style={{
                                            fontSize: 11,
                                            color: '#686868',
                                            fontFamily: strings.fontMedium
                                        }}
                                    >My Account </Text>

                                </TouchableOpacity>
                            </View>
                        </View>

                      



                        {/* Account history */}

                        {/* {console.log("HP Data --> " + this.state.hrpdata)} */}

                        <FlatList
                            data={this.state.hrpdata}
                            style={{
                                marginTop: 15,
                                width: width - 40
                            }}
                            ItemSeparatorComponent={() => {
                                return (
                                    // Flat List Item Separator
                                    <View
                                        style={{
                                            height: 0.5,
                                            width: '90%',
                                            backgroundColor: colors.backgroundColor,
                                            alignSelf: 'center'
                                        }}
                                    />
                                );
                            }}
                            renderItem={this.renderListItem}
                            ListFooterComponent={
                                // this.state.hrpdata.length > 0 && (<Text style={styles.ErrorDisplay}>Note : Visit M-Passbook or Download Account Statement For More Transactions</Text>)
                                this.state.hrpdata.length > 0 && (<View style={styles.noteView}>
                                    <Text style={styles.ErrorDisplay}>
                                        Note : 
                                        </Text>
                                        <Text style={styles.ErrorDisplay}>
                                       Visit M-Passbook or Download Account {'\n'}Statement For More Transactions
                                        </Text>
                                        </View>)
                            }

                        />





                        {/* Load More -- Hide as parameter for this not available in api */}
                        {/* <TouchableOpacity
                            style={{
                                marginTop: 15,
                                marginBottom: 15,
                                height: 40,
                                width: width - 50,
                                alignItems: 'center',
                                backgroundColor: 'white',
                                // marginTop: 20,
                                justifyContent: 'center',
                                borderRadius: 12,
                                borderWidth: 2,
                                borderColor: '#8bb9dc'

                            }}
                            onPress={this.LoadMoreOnPress}
                        ><Text style={{
                            color: 'black',
                            fontFamily: strings.fontMedium,
                            fontSize: 14
                        }}>Load More</Text></TouchableOpacity> */}

                    </View >

                </ImageBackground >

                <RenderLoader />



                <DateTimePickerModal
                    isVisible={this.state.startShowDatePicker}
                    mode="date"
                    maximumDate={new Date()}
                    date={new Date()}
                    isDarkModeEnabled={false}
                    themeVariant={"light"}
                    onConfirm={this._onDateSelectedForStartDate}
                    onCancel={this._startHideDatePicker}
                    format="DD-MMM-YYYY"
                    display={Platform.OS === "ios" ? "inline" : "default"}
                />

                <DateTimePickerModal
                    isVisible={this.state.endShowDatePicker}
                    mode="date"
                    minimumDate={this.state.startDate}
                    maximumDate={new Date()}
                    date={new Date()}
                    isDarkModeEnabled={false}
                    themeVariant={"light"}
                    onConfirm={this._onDateSelectedForEndDate}
                    onCancel={this._endHideDatePicker}
                    format="DD-MMM-YYYY"
                    display={Platform.OS === "ios" ? "inline" : "default"}
                />

            </View >


        );
    }
}


const styles = StyleSheet.create({

    SubMainView:
    {
        flex: 1,
        marginLeft: 10
    },

    InnerLayputView:
    {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    PerticularStyle:
    {
        fontFamily: strings.fontMedium,
        fontSize: RFValue(12),
        color: 'black',
        flex: 2.4,
       
    },

    DrCrStyle:
    {
        textAlign: 'right',
        paddingTop: 5,
        fontFamily: strings.fontRegular,
        fontSize: RFValue(12),
        flex: 1,
    },

    DateStyle:
    {
        fontFamily: strings.fontRegular,
        fontSize: RFValue(12),
        color: '#929CAC'
    },
    DeposityIcon:
    {
        height: 36,
        width: 36,
        borderRadius: 36 / 2,
        backgroundColor: "#27ae60" + '1A',
        alignItems: 'center',
        justifyContent: 'center',
    },

    WithDrawIcon:
    {
        height: 36,
        width: 36,
        borderRadius: 36 / 2,
        backgroundColor: "#eb5757" + '1A',
        alignItems: 'center',
        justifyContent: 'center',
    },

    MainView:
    {
        flexDirection: 'row',
        alignItems: 'center', 
        marginVertical: 10
    },



    ErrorDisplay: { color: "#FF0000", marginLeft: 5, fontWeight: '400' , fontSize: RFValue(12) , marginBottom: 20, marginTop: 20, },
    noteView:
    {
        flexDirection:'row'
    }

})

export default connect(mapStateToProps, mapDispatchToProps)(MyAccMiniStatement);
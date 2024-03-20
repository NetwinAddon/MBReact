import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform,
    ScrollView,
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
    sendData,

} from '../../../App';

import CardView from 'react-native-cardview'
import TrasnsperantFixedHeader from '../../../components/TrasnperantFixedHeader';
import Download from '../../../assets/icons/fi-rr-download.svg'
import Doc from '../../../assets/icons/document-signed.svg'

import EditProfileIcon from '../../../assets/icons/editProfileIcon.svg'
import moment from 'moment';
import APIUrlConstants from '../../../common/APIUrlConstants';
import Constants from '../../../common/Constants';

class MyAccDetails extends Component {
    constructor(props) {
        super(props);
        console.log("props areMyAc Details", props.route.params)


        this.AccDetails = props.route.params

        this.AccInfo = [];
        this.state = {
            userName :'',

            FullName: '',
            AC_NO:'',
            IFSC_CODE:'',
            CBSACNo:'',
            ETRNO:'',
            AC_NAME:'',
            ACTYPE:'',
            BRANCHCODE:'',
            ADDR:'',
            BALANCE:'',
            AC_STRT_DT:'',
            MOBILENO:'',
            INT_RATE:'',

        };

        const date = new Date(this.AccDetails.AC_STRT_DT);

        // Extract year, month, and day
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 to month because months are zero-based
        const day = String(date.getDate()).padStart(2, '0');

        // Create the formatted date string in MM/DD/YYYY format
        this.formattedDate = `${month}/${day}/${year}`;


        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    }
    componentDidMount() {

        this.GetAccounList();

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

    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg




    UserInfo = ({ text1, text2 }) => {
        return (
            <View style={{
                height: 45,
                width: width - 60,
                backgroundColor: 'white',
            }}>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent : 'center',marginBottom:5}}>
                        <View style={{ flex: 1}}>
                            <Text style={{ fontSize: 14, color: '#7e8ca0',padding:10  }}>
                                {text1}
                            </Text>
                        </View>
                        <View
                            style={{
                                alignItems: 'center',
                                alignContent: 'center',
                                justifyContent: 'center',
                                marginHorizontal: 10,
                            }}
                        >
                            <Text style={{ fontSize: 12, color: this.props.PrimaryColor }}>{text2}</Text>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        height: 0.5,
                        width: '95%',
                        backgroundColor: colors.backgroundColor,
                        alignSelf: 'center',
                    }}
                />
            </View>
        );
    };

    toOwnAccTransfer() {
        navigation.navigate(this, 'ownAccTransferScreen')
        console.log('hellooooo')
    }


    GetAccounList() {


        const Headers = APIUrlConstants.Headers("GETACDET");

        const Body =
        {
            PARACNT: "5",
            PARA1_TYP: "STR",
            PARA1_VAL: Constants.GMST_CODE,
            PARA2_TYP: "STR",
            PARA2_VAL: this.AccDetails.ACMASTCODE,
            PARA3_TYP: "STR",
            PARA3_VAL: this.AccDetails.AC_NO,
            PARA4_TYP: "STR",
            PARA4_VAL: Constants.BankCode,
            PARA5_TYP: "STR",
            PARA5_VAL: Constants.SecretKey,

        }
        console.log("Account_Details URL:- " + APIUrlConstants.BASE_URL);
        console.log("");
        console.log("Account_Details Json:- " + JSON.stringify(Body));
        console.log("");

        sendData(this,
            'post',
            APIUrlConstants.BASE_URL,
            Headers,
            JSON.stringify(Body),
            async (obj, response) => {
                var responseData = response

                console.log("Account_Details Response:- " + JSON.stringify(responseData));

                // let res = response.SUCCESS
                // if (res === "FALSE") {

                // }
                // else if (res === "TRUE") {

                    let userAccArray = responseData.Acdtls 

                    if (userAccArray.length > 0) {
                        userAccArray.map((item) => {
            
                            this.AccInfo.push(JSON.parse(item))  
            
                        })

                        console.log("Account_Details:- " + JSON.stringify(this.AccInfo));


                        this.setState({
                            FullName :this.AccInfo[0].NAME,
                            AC_NO :this.AccInfo[0].AC_NO,
                            IFSC_CODE :this.AccInfo[0].IFSC_CODE,
                            ETRNO :this.AccInfo[0].ETRNO,
                            AC_NAME :this.AccInfo[0].AC_NAME,
                            ACTYPE :this.AccInfo[0].ACTYPE,
                            BRANCHCODE :this.AccInfo[0].BRANCHCODE,
                            ADDR :this.AccInfo[0].ADDR,
                            BALANCE :this.AccInfo[0].BALANCE,
                            AC_STRT_DT :this.AccInfo[0].AC_STRT_DT,
                            MOBILENO :this.AccInfo[0].MOBILENO,
                            ADDR :this.AccInfo[0].ADDR,
                            INT_RATE :this.AccInfo[0].INT_RATE,
                            CBSACNo :this.AccInfo[0].AADHAR_REFNO,
                        
                        
                        })



 
                    }
            //     }

            })

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

                    <View style={{ flex: 0.05 }}>
                        <View style={{
                            marginLeft: 25,
                            marginBottom: 10,
                        }}>
                        </View>
                    </View>

                    <View style={{
                        flex: 0.95,
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
                                }}
                            >
                                <View style={{
                                    alignItems: 'center',
                                    height: 140,
                                    width: width - 60,
                                    flexDirection: 'row',
                                }}

                                >
                                    <View style={{
                                        height: 130,
                                        flex: 0.4,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        // backgroundColor : 'white'
                                    }}>

                                        <View style={{
                                            width: 75,
                                            height: 75,
                                            borderRadius: 75 / 2,
                                            backgroundColor: this.props.SecondaryColor,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderWidth: 4,
                                            borderColor: 'white'
                                        }}>
                                            <Text style={{
                                                color: 'white',
                                                fontSize: 35,
                                                fontFamily: strings.fontBold
                                            }}>
                                                {this.AccDetails.NAME.charAt(0).toUpperCase()}
                                            </Text>
                                        </View>

                                        {/* profile Menu */}
                                        <View style={{
                                            width: 30,
                                            height: 30,
                                            marginTop: -30,
                                            marginLeft: 55,
                                            borderWidth: 2,
                                            borderColor: colors.white,
                                            backgroundColor: colors.profilemenu,
                                            borderRadius: 40 / 2,
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <EditProfileIcon height={13} width={13} />
                                        </View>
                                    </View>

                                    <View
                                        style={{
                                            flex: 0.6,
                                        }}
                                    >
                                        <Text
                                            style={{ fontSize: 20, fontFamily: strings.fontBold, color: 'white' }}
                                        >{this.AccDetails.NAME.split(' ').map((word, index) => (index === 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word.charAt(0).toUpperCase())).join(' ') + '.'}</Text>
                                        <Text
                                            style={{ fontSize: 15, fontFamily: strings.fontMedium, color: '#ffffff80' }}
                                        >{strings.strAccountHolderName}</Text>

                                    </View>

                                </View>
                            </CardView>
                        </View>

                        {/* ministatement and download statemment */}
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
                                {/* mini statemen */}
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
                                    onPress={() => navigation.navigate(this, 'myAccMiniStatement',this.AccDetails)}

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
                                        <Doc height={12} width={12} fill={this.props.SecondaryColor} />

                                    </View>
                                    <Text
                                        style={{
                                            fontSize: 11,
                                            color: '#686868',
                                            fontFamily: strings.fontMedium
                                        }}
                                    >{strings.miniStatement}</Text>

                                </TouchableOpacity>

                                {/* devider */}
                                <View
                                    style={{

                                        // height: '100%',
                                        width: 1,
                                        backgroundColor: '#ced1df',
                                    }}
                                />

                                {/* Download */}
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
                                    onPress={() =>  navigation.navigate(this, 'myAccountDownloadStatement',this.AccDetails)}
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
                                    >{strings.downloadStatemant}</Text>

                                </TouchableOpacity>
                            </View>
                        </View>


                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={12}
                            style={{
                                flex: 1,
                                backgroundColor: 'white',
                                width: width - 40,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: 15,
                                marginBottom: 15,
                            }}
                        >


                            <ScrollView

                            >
                                <View style={{ flex: 1 }}>
                            {/* IFSC_CODE :this.AccInfo[0].IFSC_CODE,
                 
                            BALANCE :this.AccInfo[0].BALANCE,
                            AC_STRT_DT :this.AccInfo[0].AC_STRT_DT,
                            MOBILENO :this.AccInfo[0].MOBILENO,
                            ADDR :this.AccInfo[0].ADDR,
                            INT_RATE :this.AccInfo[0].INT_RATE, */}
                                    <this.UserInfo text1={'Full Name'} text2={this.state.FullName} />
                                    <this.UserInfo text1={'Account Number'} text2={this.state.AC_NO} />
                                    <this.UserInfo text1={'IFSC Code'} text2={this.state.IFSC_CODE} />
                                    <this.UserInfo text1={'CBS Account Number'} text2={this.state.CBSACNo} />
                                    <this.UserInfo text1={'ETRN Number'} text2={this.state.ETRNO} />
                                    <this.UserInfo text1={'Account Name'} text2={this.state.AC_NAME} />
                                    <this.UserInfo text1={'Account Type'} text2={this.state.ACTYPE} />
                                    <this.UserInfo text1={'Branch'} text2={this.state.BRANCHCODE} />
                                    <this.UserInfo text1={'Address'} text2={this.state.ADDR} />
                                    <this.UserInfo text1={'Available Balance'} text2={this.state.BALANCE.startsWith('-') ? ("₹ " + this.state.BALANCE.replace('-', '') + " Cr") : ("₹ " + this.state.BALANCE + " Dr")} />
                                    <this.UserInfo text1={'Account Opening Date'} text2={moment(this.state.AC_STRT_DT).format('DD/MM/YYYY')} />
                                    <this.UserInfo text1={'Mobile Number'} text2={this.state.MOBILENO} />
                                    <this.UserInfo text1={'Interest Rate'} text2={this.state.INT_RATE +" %"} />
                                </View>
                            </ScrollView>
                        </CardView >



                    </View >
                </ImageBackground >

            </View >


        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccDetails);

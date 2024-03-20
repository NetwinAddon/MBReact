
//  RGP

import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform,
    FlatList,
    StyleSheet,
    PermissionsAndroid,
    Alert,
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
    RenderOkDialog,
    sendData,
    util,
} from '../../../../App';

import Arrowdown from '../../../../assets/icons/dashboardIcons/arrow_down.svg';



import Smsicon from '../../../../assets/icons/smsicon.svg'
import moment from 'moment'

import DateTimePickerModal from "react-native-modal-datetime-picker";

//import { TouchableOpacity } from 'react-native-gesture-handler';
import TrasnsperantFixedHeader from '../../../../components/TrasnperantFixedHeader.js';
import CardView from 'react-native-cardview';
import { ScrollView } from 'react-native-gesture-handler';

import Arrow from '../../../../assets/icons/Vectorarrow.svg';



import { CustomPopupsRecharge } from '../../../../components/CustomPopupsRecharge.js';
import BBPS from '../../../../assets/icons/BBPS_Logo.svg'
import { TextInput } from 'react-native-paper';
import OtpInputs from 'react-native-otp-inputs';
import { ServiceReasonPopup } from '../AgentComplaints/ServiceReasonPopup.js'
import MyValidator from '../../../../common/MyValidator.js';
import Constants from '../../../../common/Constants.js';
import APIUrlConstants from '../../../../common/APIUrlConstants.js';
import Snackbar from 'react-native-snackbar';
import { _toEncrypt, decryptData } from '../../../../common/util.js';
class TransHistoryHomeScreen extends Component {

    constructor(props) {
        super(props);





        this.state = {
            //transList: [],
            startShowDatePicker: false,
            selectedFromDate: '',
            endShowDatePicker: false,
            selectedToDate: '',
            MobNum: '',
            TransactionID: '',
            fromDate: '',
            toDate: '',
            MobNumError: '',
            TransactionIDError: '',
            fromDateError: '',
            toDateError: '',
            isModalVisible: false,
            isModalVisible1: false,
            isStateModalVisible: false,
            selectedValue: 'option1',
            // operaterName: this.OperatorsList.length > 0 ? 'Select Operator' : '',
            labelText: '',
            amount: '',

            remark: '',
            searchTerm: '',
            searchTermAct: 0,
            searchPerformed: false,
            constactsNumbers: [],
            confirmDialog: false,
            otp_length: '',
            otp: '',
            timer: 30
        };

    }






    _onDateSelectedForStartDate = (date) => {
        // Handle the selected date as needed
        console.log('date===' + moment(date).format("DD/MM/YYYY"))

        this.setState({ selectedFromDate: date, startShowDatePicker: false })

    };
    _onDateSelectedForEndDate = (date) => {
        // Handle the selected date as needed
        console.log('date===' + moment(date).format("DD/MM/YYYY"))

        this.setState({ selectedToDate: date, endShowDatePicker: false })

    };


    _startHideDatePicker = () => {
        // Close the date picker when canceled
        this.setState({ startShowDatePicker: false })

    };
    _endHideDatePicker = () => {
        // Close the date picker when canceled
        this.setState({ endShowDatePicker: false })

    };





    componentDidMount() {




    }
    bgImage = appThemeConfiguration(config.themeColor).bgImg


    hideDialog = () => {
        this.setState({ confirmDialog: false })
    }


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



    TransactionHistoryAPI = async () => {

        const Headers = APIUrlConstants.Headers("GETBBPSTRANLIST");
        // console.log('this.state.compType'+this.state.compType)
        const jsonReq =
        {
            TXNREFID: this.state.TransactionID,
            GMSTCODE: Constants.GMST_CODE,
            MOBILENO: this.state.MobNum,
            CORP_ID: Constants.BankCode,
            SEC_KEY: Constants.SecretKey,
            FROMDT: moment(this.state.selectedFromDate).format("DD-MMM-YYYY"),
            TODT: moment(this.state.selectedToDate).format("DD-MMM-YYYY"),
            divId: this.props.DeviceId,
            secKey: Constants.SecretKey,
        }
        let jsonValue = await _toEncrypt(JSON.stringify(jsonReq), Constants.DeviceId, '#', Constants.SecretKey);
        const Body =
        {
            PARACNT: "1",
            PARA1_TYP: "STR",
            PARA1_VAL: JSON.stringify(jsonValue)
        }
        console.log("GetDataCardRechargeApi URL:- " + APIUrlConstants.BASE_URL);
        console.log("");
        console.log("GetDataCardRechargeApi Json:- " + JSON.stringify(jsonReq));
        console.log("");
        console.log("GetDataCardRechargeApi Body:- " + JSON.stringify(Body));
        console.log("");


        sendData(this,
            'post',
            APIUrlConstants.BASE_URL,
            Headers,
            JSON.stringify(Body),
            async (obj, response) => {
                this.props.navigation.navigate('transHistoryList')
                var responseData = await decryptData(response)
                //  console.log("GetDataCardRechargeApi Json:- " + JSON.stringify(finalRes));
                console.log("GetDataCardRechargeApi Json:- " + responseData);


                let res = responseData.SUCCESS
                console.log("res:- " + res);

                if (res === "FALSE") {
                    console.log("res11111:- " + res);
                    const ErrorMsg = finalRes.RESULT


                    Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });

                }
                else {

                    if (responseData.hasOwnProperty('TRANSLIST')) {
                        // Assuming finalResult is a JSON object in React Native
                        //this.Status(1);
                        //  const complist = finalResult?.COMPLIST; // Using optional chaining to handle null or undefined

                        if (responseData.TRANSLIST.length > 0) {
                            this.props.navigation.navigate('transHistoryList', { complaintList: responseData.TRANSLIST })
                        } else {
                            Snackbar.show({ text: "No Record Found!!", duration: Snackbar.LENGTH_SHORT, backgroundColor: 'orange' });
                        }
                    }
                    else {

                        Snackbar.show({ text: "Error To Search, Retry !!", duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });


                    }

                    //     for (let i = 0; i < complist.length; i++) {
                    //         const json = JSON.parse(complist[i][4]);
                    //         this.state.transList.push(json);
                    //     }

                    //     if (this.state.transList.length === 0) {

                    //         ErrorMsg = "No Record Found!";
                    //         Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });
                    //     }

                    //     console.log("Result: ", this.state.transList);
                    // }



                }




            })

    }



    Status = (status) => {

        if (status === 1) {
            this.props.navigation.navigate('historyList', { complaintList: this.state.transList })
        }

    }

    onSearchClick = () => {

        const result = this.isValidate();

        if (result) {

            this.TransactionHistoryAPI()

        }
    };
    isValidate() {

        console.log("MobNum " + this.state.MobNum.length)
        console.log("TransactionID " + this.state.TransactionID)
        console.log("fromDate " + this.state.fromDate)
        console.log("toDate " + this.state.toDate)

        var result = true;

        this.setState({ MobNumError: '', TransactionIDError: '', fromDateError: '', toDateError: '' });


        if (this.state.MobNum.length < 10) {
            this.setState({ MobNumError: "Please Enter valid mobile number" });
            result = false;
        }


        // if (this.state.BillAmount != this.state.confirmBillAmount) {
        //     this.setState({ ConfirmBillAmountError: "Amount not match" });

        //     result = false;
        // }

        if (!MyValidator.isEmptyField(this.state.MobNum).isValid) {
            this.setState({ MobNumError: "Please Enter mobile number" });
            result = false;
        }


        if (!MyValidator.isEmptyField(this.state.TransactionID).isValid) {
            this.setState({ TransactionIDError: "Please Enter Transaction ID" });

            result = false;
        }
        if (!MyValidator.isEmptyField(this.state.selectedFromDate).isValid) {
            this.setState({ fromDateError: "Please Enter correct From Date!!" });

            result = false;
        }
        if (!MyValidator.isEmptyField(this.state.selectedToDate).isValid) {
            this.setState({ toDateError: "Please Enter correct To Date!!" });

            result = false;
        }





        return result;
    };



    onSelectState = (value) => {
        console.log('valueeeeeeeeee' + value)
        { value !== '' || value !== 'undefined' ? console.log('true') : console.log('false') }
        this.setState({ isModalVisible: false, operaterName: value })
        console.log("state.isModalVisible", this.state.isModalVisible, value);
        // renderWelcomeMsg()


    }






    render() {

        return (
            <View style={styles.mainContainer}>
                <ImageBackground style={styles.mainContainer}
                    source={this.bgImage}
                    resizeMode='cover'
                >
                    <TrasnsperantFixedHeader
                        backAction={() => this.onBackAction()}
                    />

                    <View style={styles.headingContainer}>
                        <View style={styles.innerContainer}>
                            <Text style={styles.title}>Transaction History
                            </Text>
                            <Text style={styles.subTitle}>Search BBPS Transaction
                            </Text>

                        </View>
                    </View>


                    <View style={styles.containerView}>
                        <View style={styles.rowContainer}>
                            <View style={styles.bbpsContainer}>
                                <BBPS style={styles.bbpsStyle} />
                            </View>
                        </View>



                        <View style={styles.container1}>
                            <View style={styles.InputBoxDesign}>
                                <TextInput
                                    style={styles.touchableOpacity}
                                    theme={{
                                        colors: {
                                            placeholder: '#DFE1E8',
                                            text: this.props.textColor,
                                            primary: this.props.themeColor,
                                            underlineColor: 'transparent',
                                            background: 'white',
                                        },
                                        roundness: 8,
                                    }}
                                    label="Transaction ID"
                                    //  keyboardType='numeric'
                                    value={this.state.TransactionID}
                                    onChangeText={TransactionID => {
                                        this.setState({ TransactionID });
                                    }}
                                    mode='outlined'
                                />
                                {this.state.TransactionIDError !== '' && (<Text style={styles.ErrorDisplay}>{this.state.TransactionIDError}</Text>)}
                            </View>
                            <View style={styles.InputBoxDesign}>
                            <TextInput
                                    style={styles.touchableOpacity}
                                    theme={{
                                        colors: {
                                            placeholder: '#DFE1E8',
                                            text: this.props.textColor,
                                            primary: this.props.themeColor,
                                            underlineColor: 'transparent',
                                            background: 'white',
                                        },
                                        roundness: 8,
                                    }}
                                    label="Mobile Number"
                                    maxLength={10}
                                    keyboardType='numeric'
                                    value={this.state.MobNum}
                                    onChangeText={MobNum => {
                                        this.setState({ MobNum });
                                    }}

                                    mode='outlined'
                                />
                                {this.state.MobNumError !== '' && (<Text style={styles.ErrorDisplay}>{this.state.MobNumError}</Text>)}
                            </View>

                            <View style={styles.InputBoxDesign}>
                                <TouchableOpacity onPress={() => this.setState({ startShowDatePicker: true })}>
                                    <TextInput
                                        style={styles.touchableOpacity}
                                        theme={{
                                            colors: {
                                                placeholder: '#DFE1E8',
                                                text: this.props.textColor,
                                                primary: this.props.themeColor,
                                                underlineColor: 'transparent',
                                                background: 'white',
                                            },
                                            roundness: 8,
                                        }}
                                        // label="From Date"
                                        // keyboardType='numeric'

                                        value={this.state.selectedFromDate ? moment(this.state.selectedFromDate).format("DD MMM YYYY") : ''}
                                        placeholder="From Date"
                                        editable={false}
                                        mode='outlined'
                                    />
                                </TouchableOpacity>
                                {this.state.fromDateError !== '' && (<Text style={styles.ErrorDisplay}>{this.state.fromDateError}</Text>)}
                            </View>
                            <DateTimePickerModal
                                isVisible={this.state.startShowDatePicker}
                                mode="date"
                                date={new Date()}
                                isDarkModeEnabled={false}
                                maximumDate={new Date()}
                                themeVariant={"light"}
                                onConfirm={this._onDateSelectedForStartDate}
                                onCancel={() => this._startHideDatePicker}
                                format="DD-MMM-YYYY"
                                // minimumDate={new Date()}
                                display={Platform.OS === "ios" ? "inline" : "default"}
                            //timeZoneOffsetInMinutes={2 * 60}
                            />
                              <View style={styles.InputBoxDesign}>
                                <TouchableOpacity onPress={() => {
                                    if (this.state.selectedFromDate === '') {
                                        this.setState({ fromDateError: 'Select from date first' });
                                    } else {
                                        this.setState({ endShowDatePicker: true });
                                    }
                                }}
                                >
                                    <TextInput
                                       style={styles.touchableOpacity}
                                        theme={{
                                            colors: {
                                                placeholder: '#DFE1E8',
                                                text: this.props.textColor,
                                                primary: this.props.themeColor,
                                                underlineColor: 'transparent',
                                                background: 'white',
                                            },
                                            roundness: 8,
                                        }}
                                        // label="From Date"
                                        // keyboardType='numeric'

                                        value={this.state.selectedToDate ? moment(this.state.selectedToDate).format("DD MMM YYYY") : ''}
                                        placeholder="To Date"
                                        editable={false}
                                        mode='outlined'
                                    />

                                </TouchableOpacity>
                                {this.state.toDateError !== '' && (<Text style={styles.ErrorDisplay}>{this.state.toDateError}</Text>)}
                            </View>
                            <DateTimePickerModal
                                isVisible={this.state.endShowDatePicker}
                                mode="date"
                                minimumDate={this.state.selectedFromDate}
                                //  maximumDate={new Date()}
                                date={new Date()}
                                isDarkModeEnabled={false}
                                themeVariant={"light"}
                                onConfirm={this._onDateSelectedForEndDate}
                                onCancel={() => this._endHideDatePicker}
                                display={Platform.OS === "ios" ? "inline" : "default"}
                            // timeZoneOffsetInMinutes={2 * 60}
                            />


                        </View>



                        <View style={styles.btnContainer}>
                            <CardView
                                cardElevation={2}
                                cardMaxElevation={2}
                                cornerRadius={12}
                                style={styles.card}>
                                <TouchableOpacity
                                  style={styles.searchButton}
                                    //onPress={() => this.props.navigation.navigate('historyList')}
                                    onPress={this.onSearchClick}
                                >
                                  <Text style={styles.buttonText}>
                                        Search
                                    </Text>
                                </TouchableOpacity>
                            </CardView>
                            <TouchableOpacity
                                onPress={() => this.props.navigation.goBack(this)}
                            >
                                 <Text style={styles.backText}>Back</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </ImageBackground>

            </View>


        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TransHistoryHomeScreen);


const styles = StyleSheet.create({
    InputBoxDesign: {
        flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start'
    },
    container: {
        flexDirection: 'row',
        padding: 10,

        alignItems: 'center',
        width: width - 50,
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
    container1: {
        width: width - 50,
        alignItems: 'center',
        flex: 1,
    },
    rowContainer: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
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
    touchableOpacity: {
        lineHeight: 40,
        height: 48,
        width: width - 50,
          marginTop: 5,
    },
    textContainer: {
        flex: 1,
    },
    labelText: {
        color: colors.accTextColor + '80',
        marginLeft: 15,
        fontSize: 10,
        fontFamily: strings.fontMedium,
    },
    compTypeText: {
        color: colors.accTextColor,
        marginLeft: 15,
        fontSize: 15,
        fontFamily: strings.fontMedium,
    },
    arrowContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    textInputContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    textInput: {
        lineHeight: 40,
        height: 48,
        width: width - 50,
        marginTop: 10,
    },
    iconContainer: {
        flex: 1,
    },

    textContainer: {
        flex: 3.5,
    },
    ErrorDisplay: {
        color: '#FF0000',
        marginLeft: 5,
        fontSize: 12,
        marginTop: 3,
    },
    username: {
        fontSize: 18,
        fontWeight: '500',
        color: '#000',
    },
    consumerNo: {
        fontSize: 13,

        fontWeight: '500',
        fontFamily: 'SF UI Display',
        color: 'rgba(0, 0, 0, 0.5)',
        textAlign: 'left',
    },
    paymentMode: {
        fontSize: 12.6,
        fontWeight: '500',
        fontFamily: 'SF UI Display',
        color: 'rgba(0, 0, 0, 0.75)',
        textAlign: 'left',
        lineHeight: 18,
    },
    btnContainer: {
        flex: 0.3,
    },
    card: {
        backgroundColor: 'gray',
        justifyContent: 'center',
        marginVertical: 20,
    },
    searchButton: {
        padding: 15,
        width: width - 50,
        backgroundColor: colors.btnColor,
        justifyContent: 'center',
        borderRadius: 12,
    },
    buttonText: {
        alignSelf: 'center',
        color: 'white',
        fontFamily: strings.fontRegular,
        fontSize: 15,
    },
    backText: {
        fontSize: 15,
        fontWeight: '700',
        fontFamily: 'SF UI Display',
        color: '#ff5936',
        textAlign: 'center',
    },
});

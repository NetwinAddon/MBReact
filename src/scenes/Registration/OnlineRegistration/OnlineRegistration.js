import React, { Component } from 'react';
import {
    Text,
    View,
    Animated,
    TouchableOpacity,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import Arrowdown from '../../../assets/icons/dashboardIcons/arrow_down.svg'
import moment from 'moment'
import {
    colors,
    strings,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    RenderOkDialog,
    width,
    sendData,
    RenderLoader
} from '../../../App';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { selectAccount } from '../../../components/CustomDialog';

import MyValidator from '../../../common/MyValidator';
import Constants from '../../../common/Constants';
import APIUrlConstants from '../../../common/APIUrlConstants';
import Snackbar from 'react-native-snackbar';
import { ScrollView } from 'react-native-gesture-handler';




class OnlineRegistration extends Component {
    constructor(props) {
        super(props);

        this.accData = [
            { label: 'Savings Account', value: 'Saving' },
            { label: 'Loan Account', value: 'Loan' },
            { label: 'Current Account', value: 'Current' },

        ];


        this.verifyData = [
            { label: 'Pan card Number', value: 'PAN Number' },
            { label: 'Aadhar card Number', value: 'Adhar Number' },
        ]


        this.state = {
            isVerify: false,
            isModalVisible: false,
            accType: this.accData.length > 0 ? this.accData[0].label : '',
            verifyType: this.verifyData[0].label,

            AccType_Key: this.accData.length > 0 ? this.accData[0].value : '',
            VerifType_key: this.verifyData[0].value,

            labelText: '',
            accon: '',
            mobile: '',
            panOrAadharLable: 'PAN Number',
            panOrAadharNo: '',
            showDatePicker: false,
            selectedDate: '',
            Accno_error: '',
            Dob_error: '',
            MobNo_error: '',
            PanAdhar_error: '',

        };
        this.size = new Animated.Value(0);

    }
    componentDidMount() {

    }






    onSelectAccount = (value, key) => {

        this.setState({ isModalVisible: false, accType: value, AccType_Key: key })

    }


    onSelectVerify = (value, key) => {

        this.setState({ isVerify: false, verifyType: value, VerifType_key: key, panOrAadharLable: value == "Pan card Number" ? "PAN Number" : "Aadhar Number", panOrAadharNo: '' })

    }


    _onDateSelected = (selDate) => {
        this.setState({ selectedDate: selDate, showDatePicker: false })

    }


    _hideDatePicker = () => {
        this.setState({ showDatePicker: false });
    };

    Submit = () => {
        const result = this.ValidateForm();


        if (result) {
            this.OnlineRegistration_OTPApi()
        }
    }

    OnlineRegistration_OTPApi() {

        const Headers = APIUrlConstants.Headers("REGUSERONLINE");

        const Body =
        {
            PARACNT: "1",
            PARA1_TYP: "STR",
            PARA1_VAL: "{\"BNK_CODE\":\"" + Constants.BankCode + "\",\"ACC_NO\":\"" + this.state.accon + "\",\"ADHAR_PAN\":\"" + this.state.panOrAadharNo + "\",\"MOB\":\"" + this.state.mobile + "\",\"DOB\":\"" + moment(this.state.selectedDate).format("DD-MMM-YYYY") + "\",\"KYC_TYPE\":\"" + this.state.VerifType_key + "\",\"ACC_TYPE\":\"" + this.state.AccType_Key + "\",\"OPR_TYPE\":\"NEWREG\"}"
        }


        sendData(this,
            'post',
            APIUrlConstants.BASE_URL,
            Headers,
            JSON.stringify(Body),
            async (obj, response) => {
                var responseData = response

                let res = response.SUCCESS
                if (res === "FALSE") {

                    const ErrorMsg = response.RESULT
                    Snackbar.show({
                        text: ErrorMsg,
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: 'red'
                    });

                }
                else if (res === "TRUE") {
                    const USERID = response.USERID

                    this.props.onSubmit(this.state.mobile, USERID)
                }

            })

    }


    ValidateForm() {

        var result = true;

        this.setState({ Accno_error: '', Dob_error: '', MobNo_error: '', PanAdhar_error: '' });

        if (!MyValidator.isValidIndianMobile(this.state.mobile).isValid) {
            this.setState({ MobNo_error: MyValidator.isValidIndianMobile(this.state.mobile).Response });
            result = false;
        }

        const isNumber = /^\d+$/.test(this.state.accon);

        if (!isNumber) {
            this.setState({ Accno_error: 'Please remove special characters' });
            result = false;
        }

        const isBlankSpace = /\s/.test(this.state.accon);
        if (isBlankSpace) {
            this.setState({ Accno_error: 'Please remove blank space' });
            result = false;
        }

        if (!MyValidator.isEmptyField(this.state.accon).isValid) {
            this.setState({ Accno_error: MyValidator.isEmptyField('').Response });
            result = false;
        }


        if (!MyValidator.isValidDate(this.state.selectedDate).isValid) {
            this.setState({ Dob_error: MyValidator.isEmptyField('').Response });
            result = false;
        }

        if (this.state.verifyType === 'Aadhar card Number') {
            if (!MyValidator.isValidAadharCard(this.state.panOrAadharNo).isValid) {
                this.setState({ PanAdhar_error: MyValidator.isValidAadharCard(this.state.panOrAadharNo).Response });
                result = false;
            }
        }

        if (this.state.verifyType === 'Pan card Number') {

            if (!MyValidator.isValidPanCard(this.state.panOrAadharNo).isValid) {
                this.setState({ PanAdhar_error: MyValidator.isValidPanCard(this.state.panOrAadharNo).Response });
                result = false;
            }

        }



        return result;
    };


    render() {


        return (
            <View
                style={styles.MainView}>

                <ScrollView>

                    <View style={styles.SubView} >

                        {/* Acc Type */}
                        <View style={styles.InputBoxDesign} >

                            <TouchableOpacity style={styles.TouchableStyle}
                                onPress={() => this.setState({ isModalVisible: true, labelText: ' Account Type' })}>

                                <View style={styles.FlexOne}>

                                    <Text style={styles.TextViewStyle}>  Account Type </Text>

                                    <Text style={styles.TextViewSubStyle}> {this.state.accType} </Text>

                                </View>

                                <View style={styles.IConStyle} >

                                    <Arrowdown height={15} width={15} />

                                </View>


                            </TouchableOpacity>

                            {selectAccount(
                                this.state.isModalVisible,
                                this.accData,
                                this.onSelectAccount,
                                this.state.labelText,
                                this.state.accType,
                                "ListTypeDesign"
                            )}



                        </View>


                        {/* Account No */}
                        <View style={styles.ViewTwoStyle}>

                            <TextInput
                                style={styles.TextInputStyleTwo}

                                theme={{
                                    colors: {
                                        placeholder: '#DFE1E8',
                                        text: this.props.textColor,
                                        primary: this.props.SecondaryColor,
                                        underlineColor: 'transparent',
                                        background: 'white',
                                    },
                                    roundness: 8,
                                }}
                                label="Account number"
                                value={this.state.accon}
                                keyboardType='numeric'
                                onChangeText={accon => {
                                    this.setState({ accon: accon.replace(/[^0-9]/g, '') });
                                }}
                                mode='outlined'
                                autoComplete='off'
                                placeholder='Account number'
                                returnKeyType='next'
                                onSubmitEditing={() => { this.mobileno.focus(); }}
                                blurOnSubmit={false}
                            />

                            {this.state.Accno_error !== '' && (<Text style={styles.ErrorDisplay}>{this.state.Accno_error}</Text>)}

                        </View>





                        {/* DOB */}
                        <View style={styles.DOBViewStyle}>

                            <TouchableOpacity
                                onPress={() => this.setState({ showDatePicker: true })}
                                style={styles.DOB_TouchableStyle}>

                                {this.state.selectedDate ? (

                                    <Text style={[styles.DOB_TextStyleAppcolor,{ color: this.props.textColor }]}> {moment(this.state.selectedDate).format("DD/MM/YYYY")}</Text>
                                )
                                    :
                                    <Text style={styles.DOB_TextStyle}>Date of Birth</Text>

                                }
                            </TouchableOpacity>

                            {this.state.Dob_error !== '' && (<Text style={styles.ErrorDisplay}>{this.state.Dob_error}</Text>)}


                        </View>

                        {/* Mobile number */}
                        <View style={styles.ViewTwoStyle}>

                            <TextInput
                                style={styles.TextInputStyleTwo}
                                theme={{
                                    colors: {
                                        placeholder: '#DFE1E8',
                                        text: this.props.textColor,
                                        primary: this.props.SecondaryColor,
                                        underlineColor: 'transparent',
                                        background: 'white',
                                    },
                                    roundness: 8,
                                }}
                                label="Mobile No."
                                value={this.state.mobile}
                                maxLength={10}
                                keyboardType='numeric'
                                onChangeText={mobile => {
                                    this.setState({ mobile: mobile.replace(/[^0-9]/g, '') });}}
                                mode='outlined'
                                autoComplete='off'
                                ref={(input) => { this.mobileno = input; }}
                                placeholder='Mobile No.'
                                returnKeyType='next'
                                onSubmitEditing={() => { this.aadharPan.focus(); }}
                                blurOnSubmit={false}
                            />

                            {this.state.MobNo_error !== '' && (<Text style={styles.ErrorDisplay}>{this.state.MobNo_error}</Text>)}



                        </View>

                        {/* Verify */}
                        <View
                            style={styles.VerifyViewStyle}>
                                
                            <TouchableOpacity style={styles.TouchableStyle}

                                onPress={() => this.setState({ isVerify: true, labelText: 'Verify' })}
                            >

                                <View style={styles.FlexOne}>
                                    <Text style={styles.TextViewStyle}>
                                        Verify
                                    </Text>
                                    <Text style={styles.TextViewSubStyle}>
                                        {this.state.verifyType}
                                    </Text>
                                </View>

                                <View style={styles.IConStyle} >
                                    <Arrowdown height={15} width={15} />


                                </View>
                            </TouchableOpacity>


                        </View>

                        {selectAccount(
                            this.state.isVerify,
                            this.verifyData,
                            this.onSelectVerify,
                            this.state.labelText,
                            this.state.verifyType,
                            "ListTypeDesign"
                        )}

                        {/* Pan/AdharNo */}
                        <View style={styles.PanAadharViewStyle}
                        >
                            <TextInput
                                style={styles.TextInputStyleTwo}
                                theme={{
                                    colors: {
                                        placeholder: '#DFE1E8',
                                        text: this.props.textColor,
                                        primary: this.props.SecondaryColor,
                                        underlineColor: 'transparent',
                                        background: 'white',
                                    },
                                    roundness: 8,
                                }}
                                label={this.state.panOrAadharLable}
                                value={this.state.panOrAadharNo}
                                keyboardType={this.state.panOrAadharLable == "PAN Number" ? 'default' : 'numeric'}
                                autoCapitalize={"characters"}
                                maxLength={this.state.panOrAadharLable == "PAN Number" ? 10 : 12}
                                onChangeText={text => {

                                    this.setState({ panOrAadharNo: this.state.panOrAadharLable == "PAN Number" ? text.replace(/[^A-Z0-9]/g, '') : text.replace(/[^0-9]/g, '') });
                                }}
                                mode='outlined'
                                ref={(input) => { this.aadharPan = input; }}
                                placeholder={this.state.panOrAadharLable}
                            />

                            {this.state.PanAdhar_error !== '' && (<Text style={styles.ErrorDisplay}>{this.state.PanAdhar_error}</Text>)}


                        </View>

                        {/* buttons */}
                        <TouchableOpacity
                            style={[,styles.ButtonStyle,{ backgroundColor: this.props.PrimaryColor,  }]}
                            onPress={() => { this.Submit() }}
                        >
                            <Text style={{ color: colors.white }}>Submit</Text></TouchableOpacity>

                    </View>


                </ScrollView>

                <RenderOkDialog />

                <RenderLoader />


                <DateTimePickerModal
                    isVisible={this.state.showDatePicker}
                    mode="date"
                    date={new Date()}
                    isDarkModeEnabled={false}
                    themeVariant={"light"}
                    onConfirm={this._onDateSelected}
                    onCancel={this._hideDatePicker}
                    display={Platform.OS === "ios" ? "inline" : "default"}
                    timeZoneOffsetInMinutes={2 * 60}

                />

            </View>
        );
    }


}


const styles = {

    MainView:
    {
        flex: 1,
        flexDirection: 'column',
    },
    SubView:
    {
        alignItems: 'center'

    },
    TouchableStyle:
    {
        flexDirection: 'row',
        alignItems: 'center'
    },
    FlexOne:
        { flex: 1, },

    TextViewStyle:
    {
        color: colors.accTextColor + '80',
        marginLeft: 15,
        fontSize: 10,
        fontFamily: strings.fontMedium
    },

    TextViewSubStyle:
    {
        color: colors.accTextColor,
        marginLeft: 15,
        fontSize: 15,
        fontFamily: strings.fontMedium
    },

    InputBoxDesign: {
        marginTop: 50,
        height: 48,
        width: width - 50,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DFE1E8',
        marginBottom: 10
    },

    IConStyle:
    {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10
    },

    ViewTwoStyle:
    {
        justifyContent: 'center',
        marginBottom: 12
    },

    TextInputStyleTwo:
    {
        lineHeight: 40,
        height: 48,
        width: width - 50,
    },
    DOBViewStyle:
    {
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    DOB_TouchableStyle:
    {
        height: 48,
        width: width - 50,
        borderRadius: 8,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: '#DFE1E8'
    },
    DOB_TextStyle:
    {
        fontSize: 15,
        paddingLeft: 15,
        color: '#DFE1E8'
    },
    DOB_TextStyleAppcolor:
    {
        fontSize: 15,
        paddingLeft: 15,
    },

    VerifyViewStyle:
    {
        height: 48,
        width: width - 50,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#DFE1E8',
        marginBottom: 10
    },
    PanAadharViewStyle:
    {
        justifyContent: 'center',
        alignItems: 'flex-start',
    },

    ButtonStyle:
    {
        marginTop: 15,
        height: 52,
        width: width - 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    },

    ErrorDisplay: { color: "#FF0000", marginLeft: 5, fontSize: 12 }

}


export default connect(mapStateToProps, mapDispatchToProps)(OnlineRegistration);

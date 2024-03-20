import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Keyboard,
} from 'react-native';
import { TextInput, Button, TouchableRipple } from 'react-native-paper';
import EyeOpen from '../../../assets/icons/formIcons/ico-eye.svg';
import EyeSlash from '../../../assets/icons/formIcons/ico-eye-slash.svg';
import CardView from 'react-native-cardview';

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
    RenderLoader,
} from '../../../App';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Colors from '../../../common/Colors';
import MyValidator from '../../../common/MyValidator';
import Constants from '../../../common/Constants';
import APIUrlConstants from '../../../common/APIUrlConstants';
import Snackbar from 'react-native-snackbar';


class OfflineRegistration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            refNo: '',
            mobile: '',
            userid: '',
            loginPass: '',
            loginConfPass: '',
            transPass: '',
            transConfpass: '',
            isloginVisible: true,
            isConfloginVisible: true,
            isTransPassword: true,
            isConfTransPassword: true,
            showDatePicker: false,
            selectedDate: '',

            RefNoError: '',
            DateError: '',
            MobNoError: '',
            UserIdError: '',
            LoginPassError: '',
            TransPinError: '',
        };

    }
    componentDidMount() {

    }


    _onDateSelected = (selDate) => {
        this.setState({ selectedDate: selDate, showDatePicker: false })

    }


    _hideDatePicker = () => {
        this.setState({ showDatePicker: false });
    };


    OnSubmit = () => {

        //    this.props.onSubmit(this.state.refNo, this.state.userid , this.state.mobile ,this.state.loginConfPass, this.state.transConfpass)

        const result = this.ValidateForm();

        if (result) {

            this.OfflineRegistration_OTPApi()
        }
    }

    ValidateForm() {

        var result = true;

        this.setState({ RefNoError: '', DateError: '', MobNoError: '', UserIdError: '', LoginPassError: '', TransPinError: '' });

        const isNumber = /^\d+$/.test(this.state.refNo);

        if (!isNumber) {
            this.setState({ RefNoError: 'Please remove special characters' });
            result = false;
        }
        const isBlankSpace = /\s/.test(this.state.refNo);
        if (isBlankSpace) {
            this.setState({ RefNoError: 'Please remove blank space' });
            result = false;
        }

        if (!MyValidator.isEmptyField(this.state.refNo).isValid) {
            this.setState({ RefNoError: MyValidator.isEmptyField(this.state.refNo).Response });
            result = false;
        }

        if (!MyValidator.isEmptyField(this.state.selectedDate).isValid) {
            this.setState({ DateError: MyValidator.isEmptyField(this.state.selectedDate).Response });
            result = false;
        }

        if (!MyValidator.isValidIndianMobile(this.state.mobile).isValid) {
            this.setState({ MobNoError: MyValidator.isValidIndianMobile(this.state.mobile).Response });
            result = false;
        }


        if (!MyValidator.isEmptyField(this.state.userid).isValid) {
            this.setState({ UserIdError: MyValidator.isEmptyField(this.state.userid).Response });
            result = false;
        }


        if (!MyValidator.isConfirmPassword(this.state.loginPass, this.state.loginConfPass).isValid) {
            this.setState({ LoginPassError: MyValidator.isConfirmPassword(this.state.loginPass, this.state.loginConfPass).Response });

            result = false;
        }

        if (!MyValidator.isConfirmTrasactionPassword(this.state.transPass, this.state.transConfpass).isValid) {
            this.setState({ TransPinError: MyValidator.isConfirmTrasactionPassword(this.state.transPass, this.state.transConfpass).Response });
            result = false;
        }

        const regex = /(.)(\1{3,})/g;

        if (this.state.loginPass.match(regex)) {
            this.setState({ LoginPassError: "Can't enter 4 consecutive variable" });
            result = false
        }

        if (this.state.transPass.match(regex)) {
            this.setState({ TransPinError: "Can't enter 4 consecutive variable" });
            result = false
        }

        if (this.state.loginPass.trim() === '') {
            this.setState({ LoginPassError: "Password can't be blank" });
            result = false
        }

        if (this.state.transPass.trim() === '') {
            this.setState({ TransPinError: "Password can't be blank" });
            result = false
        }

        return result;
    };


    OfflineRegistration_OTPApi() {

        const Headers = APIUrlConstants.Headers("REGUSER");

        const Body =
        {
            PARACNT: "1",
            PARA1_TYP: "STR",
            PARA1_VAL: "{\"BNK_CODE\":\"" + Constants.BankCode + "\",\"REF_ID\":\"" + this.state.refNo + "\",\"USER_ID\":\"" + this.state.userid + "\",\"L_PIN\":\"" + this.state.loginConfPass + "\",\"T_PIN\":\"" + this.state.transConfpass + "\",\"MOB\":\"" + this.state.mobile + "\",\"DOB\":\"" + moment(this.state.selectedDate).format("DD-MMM-YYYY") + "\"}"
        }

        sendData(this,
            'post',
            APIUrlConstants.BASE_URL,
            Headers,
            JSON.stringify(Body),
            async (obj, response) => {
                var responseData = response

                let res = responseData.SUCCESS
                if (res === "FALSE") {

                    const ErrorMsg = responseData.RESULT
                    Snackbar.show({
                        text: ErrorMsg,
                        duration: Snackbar.LENGTH_SHORT,
                        backgroundColor: 'red'
                    });

                }
                else {

                    this.props.onSubmit(this.state.refNo, this.state.userid, this.state.mobile, this.state.loginConfPass, this.state.transConfpass)
                }

            })

    }

    render() {
        return (
            <View
                style={styles.MainView}>

                <ScrollView
                    keyboardShouldPersistTaps="handled" >
                    <View style={styles.ScrollViewStyle} >

                        <View style={styles.ViewStyle}>

                            <TextInput
                                style={styles.TextInputStyle}
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
                                label="Referense No."
                                value={this.state.refNo}
                                onChangeText={refNo => { 
                                    this.setState({ refNo : refNo.replace(/[^0-9]/g, '')}); 
                                }}
                                mode='outlined'
                                placeholder='Referense No.'
                                returnKeyType='next'
                                keyboardType='numeric'
                                onSubmitEditing={() => { this.mobile.focus(); }}
                                blurOnSubmit={false}
                            />

                            {this.state.RefNoError !== '' && (<Text style={styles.ErrorDisplay}>{this.state.RefNoError}</Text>)}


                        </View>


                        {/* DOB */}
                        <View style={styles.ViewStyle}>
                            <TouchableOpacity
                                onPress={() => this.setState({ showDatePicker: true })}
                                style={styles.DOBTouchable}>

                                {this.state.selectedDate ?
                                    <Text style={[styles.DobTextStyleProps, { color: this.props.textColor }]}> {moment(this.state.selectedDate).format("DD/MM/YYYY")} </Text>
                                    :
                                    <Text style={styles.DobTextStyle}>Date of Birth</Text>
                                }
                            </TouchableOpacity>

                            {this.state.DateError !== '' && (<Text style={styles.ErrorDisplay}>{this.state.DateError}</Text>)}

                        </View>


                        {/* Mobile number */}
                        <View style={styles.ViewStyle}>

                            <TextInput
                                style={styles.TextInputStyle}
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
                                maxLength={10}
                                value={this.state.mobile}
                                keyboardType='numeric'
                                onChangeText={mobile => { this.setState({ mobile: mobile.replace(/[^0-9]/g, '') }); }}
                                mode='outlined'
                                ref={(input) => { this.mobile = input; }}
                                placeholder='Mobile No.'
                                returnKeyType='next'
                                onSubmitEditing={() => { this.userid.focus(); }}
                                blurOnSubmit={false}
                            />

                            {this.state.MobNoError !== '' && (<Text style={styles.ErrorDisplay}>{this.state.MobNoError}</Text>)}


                        </View>

                        {/* User Id */}
                        <View style={styles.ViewStyle}>


                            <TextInput
                                style={styles.TextInputStyle}
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
                                label="User ID"
                                value={this.state.userid}
                                onChangeText={userid => { this.setState({ userid }); }}
                                mode='outlined'
                                maxLength={20}
                                ref={(input) => { this.userid = input; }}
                                placeholder='User ID'
                                returnKeyType='next'
                                onSubmitEditing={() => { this.loginPass.focus(); }}
                                blurOnSubmit={false}
                            />

                            {this.state.UserIdError !== '' && (<Text style={styles.ErrorDisplay}>{this.state.UserIdError}</Text>)}



                        </View>

                        {/* Login password */}
                        <TextInput
                            style={styles.LoginInputStyle}
                            theme={{
                                colors: {
                                    placeholder: '#DFE1E8',
                                    text: Colors.textColorForOrange,
                                    primary: this.props.SecondaryColor,
                                    underlineColor: 'transparent',
                                },
                                roundness: 8,
                            }}
                            label="Login Password"
                            value={this.state.loginPass}
                            onChangeText={loginPass => { this.setState({ loginPass }); }}
                            mode='outlined'
                            ref={(input) => { this.loginPass = input; }}
                            placeholder='Login Password'
                            returnKeyType='next'
                            maxLength={20}
                            onSubmitEditing={() => { this.loginConfPass.focus(); }}
                            blurOnSubmit={false}
                            // secureTextEntry={this.state.isloginVisible}
                            // right={
                            //     <TextInput.Icon
                            //         forceTextInputFocus={false}
                            //         onPress={() => {
                            //             this.setState({ isloginVisible: !this.state.isloginVisible })
                            //             Keyboard.dismiss();
                            //         }}
                            //         icon={() =>
                            //             <TouchableRipple
                            //                 disabled={true}
                            //                 rippleColor={'gray'}
                            //                 style={styles.EyeIconStyle} >
                            //                 {this.state.isloginVisible ?
                            //                     <EyeSlash height={20} width={20} color={'#000000'} />
                            //                     : <EyeOpen height={20} width={20} color={'#000000'} />}
                            //             </TouchableRipple>}
                            //     />

                            // }
                        />



                        {/* confirm login password */}

                        <View style={styles.ViewStyle}>


                            <TextInput
                                style={styles.TextInputStyle}
                                theme={{
                                    colors: {
                                        placeholder: '#DFE1E8',
                                        text: Colors.textColorForOrange,
                                        primary: this.props.SecondaryColor,
                                        underlineColor: 'transparent',
                                    },
                                    roundness: 8,
                                }}
                                label="Confirm Login Password"
                                value={this.state.loginConfPass}
                                onChangeText={loginConfPass => { this.setState({ loginConfPass }); }}
                                mode='outlined'
                                maxLength={20}
                                secureTextEntry={this.state.isConfloginVisible}
                                ref={(input) => { this.loginConfPass = input; }}
                                placeholder='Confirm Login Password'
                                returnKeyType='next'
                                onSubmitEditing={() => { this.transPass.focus(); }}
                                blurOnSubmit={false}
                                right={
                                    <TextInput.Icon
                                        forceTextInputFocus={false}

                                        onPress={() => {
                                            this.setState({ isConfloginVisible: !this.state.isConfloginVisible })
                                            Keyboard.dismiss();
                                        }}
                                        icon={() =>
                                            <View
                                                style={styles.EyeIconStyle} >
                                                {this.state.isConfloginVisible ?
                                                    <EyeSlash height={20} width={20} color={'#000000'} />
                                                    : <EyeOpen height={20} width={20} color={'#000000'} />}
                                            </View>}
                                    />
                                }
                            />

                            {this.state.LoginPassError !== '' && (<Text style={[styles.ErrorDisplay]}>{this.state.LoginPassError}</Text>)}

                        </View>

                        <TextInput
                            style={styles.LoginInputStyle}
                            theme={{
                                colors: {
                                    placeholder: '#DFE1E8',
                                    text: Colors.textColorForOrange,
                                    primary: this.props.SecondaryColor,
                                    underlineColor: 'transparent',
                                },
                                roundness: 8,
                            }}
                            label="Transaction Password"
                            value={this.state.transPass}
                            onChangeText={transPass => {
                                this.setState({ transPass });
                            }}
                            mode='outlined'
                            // secureTextEntry={this.state.isTransPassword}
                            ref={(input) => { this.transPass = input; }}
                            placeholder='Transaction Password'
                            maxLength={20}
                            returnKeyType='next'
                            onSubmitEditing={() => { this.transConfpass.focus(); }}
                            blurOnSubmit={false}
                            // right={
                            //     <TextInput.Icon
                            //         forceTextInputFocus={false}

                            //         onPress={() => {
                            //             this.setState({ isTransPassword: !this.state.isTransPassword })
                            //             Keyboard.dismiss();
                            //         }}
                            //         icon={() =>
                            //             <View
                            //                 style={styles.EyeIconStyle} >
                            //                 {this.state.isTransPassword ?
                            //                     <EyeSlash height={20} width={20} color={'#000000'} />
                            //                     : <EyeOpen height={20} width={20} color={'#000000'} />}
                            //             </View>}
                            //     />
                            // }
                        />

                        <View style={styles.ViewStyle}>
                            <TextInput
                                style={styles.TextInputStyle}
                                theme={{
                                    colors: {
                                        placeholder: '#DFE1E8',
                                        text: Colors.textColorForOrange,
                                        primary: this.props.SecondaryColor,
                                        underlineColor: 'transparent',
                                    },
                                    roundness: 8,
                                }}
                                label="Confirm Transaction Password"
                                placeholder='Confirm Transaction Password'
                                value={this.state.transConfpass}
                                onChangeText={transConfpass => {
                                    this.setState({ transConfpass });
                                }}
                                mode='outlined'
                                maxLength={20}
                                secureTextEntry={this.state.isConfTransPassword}
                                ref={(input) => { this.transConfpass = input; }}
                                right={
                                    <TextInput.Icon
                                        forceTextInputFocus={false}
                                        onPress={() => {
                                            this.setState({ isConfTransPassword: !this.state.isConfTransPassword })
                                            Keyboard.dismiss();
                                        }}
                                        icon={() =>
                                            <View
                                                style={styles.EyeIconStyle} >
                                                {this.state.isConfTransPassword ?
                                                    <EyeSlash height={20} width={20} color={'#000000'} />
                                                    : <EyeOpen height={20} width={20} color={'#000000'} />}
                                            </View>}
                                    />
                                }
                            />

                            {this.state.TransPinError !== '' && (<Text style={[styles.ErrorDisplay]}>{this.state.TransPinError}</Text>)}



                        </View>


                        {/* buttons */}
                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={12}
                            style={styles.Cardstyle}
                        >
                            <TouchableOpacity
                                style={[styles.ButtonTouch, { backgroundColor: colors.btnColor }]}
                                onPress={() => this.OnSubmit()}
                            >
                                <Text style={[styles.TextStyle, { color: colors.white }]}>
                                    {strings.submit}
                                </Text>

                            </TouchableOpacity>
                        </CardView>

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

    ScrollViewStyle:
    {
        paddingTop: 5,
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 30
    },

    ViewStyle:
    {
        flexDirection: 'column',
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },

    DOBTouchable:
    {
        height: 48,
        width: width - 50,
        borderRadius: 8,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderWidth: 1,
        marginTop: 5,
        borderColor: '#DFE1E8'
    },
    DobTextStyleProps:
    {
        fontSize: 15,
        paddingLeft: 15,
    },

    DobTextStyle:
    {
        fontSize: 15,
        paddingLeft: 15,
        color: '#DFE1E8'
    },

    TextInputStyle:
    {
        lineHeight: 40,
        height: 48,
        width: width - 50,
    },

    LoginInputStyle:
    {
        flex: 1,
        marginBottom: 10,
        lineHeight: 40,
        height: 48,
        justifyContent: 'space-between',
        alignItems: 'stretch',
        width: width - 50,
    },
    InputTheme:
    {
        colors: {
            placeholder: '#DFE1E8',
            text: Colors.textColorForOrange,
            primary: Colors.themeColorOrange,
            underlineColor: 'transparent',
        },
        roundness: 8,
    },

    InputThemeLight:
    {
        colors: {
            placeholder: '#DFE1E8',
            text: Colors.textColorForOrange,
            primary: Colors.themeColorOrange,
            underlineColor: 'transparent',
            background: 'white',
        },
        roundness: 8,
    },

    ButtonTouch:
    {
        padding: 15,
        width: width - 50,
        backgroundColor: colors.btnColor,
        justifyContent: 'center',
        borderRadius: 12,
    },
    Cardstyle:
    {
        backgroundColor: 'white',
        justifyContent: 'center',
        marginVertical: 10,
        marginBottom: 30,
        marginTop: 20,
    },
    TextStyle:
    {
        alignSelf: 'center',
        fontFamily: strings.fontRegular,
        fontSize: 15
    },
    EyeIconStyle:
    {
        height: 30,
        width: 30,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ErrorDisplay: { color: "#FF0000", marginLeft: 5, fontSize: 12, }


}
export default connect(mapStateToProps, mapDispatchToProps)(OfflineRegistration);

import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    ImageBackground,
    Platform,
    ScrollView,
    SectionList,
    ToastAndroid,
    Linking,
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
    sendData,

} from '../../../App';

import CardView from 'react-native-cardview'
import Arrowdown from '../../../assets/icons/dashboardIcons/arrow_down.svg';
import TrasnsperantFixedHeader from '../../../components/TrasnperantFixedHeader';
import Download from '../../../assets/icons/fi-rr-download.svg'
import moment from 'moment'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { selectAccount } from '../../../components/CustomPopups';
import Constants from '../../../common/Constants';
import APIUrlConstants from '../../../common/APIUrlConstants';
import RNFS from 'react-native-fs';
import FileViewer from "react-native-file-viewer";
import { decryptData } from '../../../common/util';
import { decode, encode } from 'base-64';
import Snackbar from 'react-native-snackbar';
import RNFetchBlob from 'rn-fetch-blob';


class MyAccountDownloadStatement extends Component {



    constructor(props) {

        super(props)

        const AccountData = this.props.route.params

       

        this.AccountDetails = AccountData

        this.UserName = AccountData.NAME

        this.UserBalance = AccountData.BALANCE

        this.UserAccountNo = AccountData.AC_NO

        this.UserAccountType = AccountData.ACTYPE

        this.UserACMASTCODE = AccountData.ACMASTCODE

        this.BRANCHCODE = AccountData.BRANCHCODE+"#"+AccountData.AC_STRT_DT


        this.selectPeriod = [
            { label: '1 Month', value: '1' },
            { label: '3 Month', value: '2' },
            { label: '6 Month', value: '3' },
            { label: '12 Month', value: '4' },
            { label: strings.custom, value: '5' },
        ]

        this.state = {
            startDate: new Date(), //default first day of month
            endDate: new Date(),  // default current date
            startShowDatePicker: false,
            endShowDatePicker: false,
            verifyType: 'Select your statement month',
            selectedDate: null,

        };
    }

    componentDidMount() {
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
    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg3

    onSelectAccount = (value) => {
        this.setState({ isModalVisible: false, accType: value })
        console.log("state.isModalVisible", this.state.isModalVisible, value);
    }

    onSelectVerify = (value) => {
        console.log("state.isModalVisible", value);

        if (value === 'Custom') {
            this.setState({ endDate: new Date() })
        }
        this.setState({ isVerify: false, verifyType: value })
        // console.log("state.isModalVisible", this.state.isModalVisible, value);
    }
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

    toMyaccount() {
        navigation.navigate(this, 'myAccDetails', this.AccountDetails)
    }

    onBackAction() {
        navigation.goBack(this)
    }

    DownloadFile = async () => {
        console.log("INDownLoadFile")
        // Get the app's cache directory
        const { config, fs } = RNFetchBlob;
        const cacheDir = fs.dirs.DownloadDir;

        // Generate a unique filename for the downloaded image
        // const filename = url.split('/').pop();
        const imagePath = `${cacheDir}/${'filename'}`;

        console.log("ImagePath: ", imagePath)

        try {
            // Download the file and save it to the cache directory
            const configOptions = Platform.select({
                ios: {
                    fileCache: true,
                    path: imagePath,
                    appendExt: filename.split('.').pop(),
                },
                // android: {
                //     fileCache: true,
                //     path: imagePath,
                //     appendExt: filename.split('.').pop(),
                //     addAndroidDownloads: {
                //         // Related to the Android only
                //         useDownloadManager: true,
                //         notification: true,
                //         path: imagePath,
                //         description: 'File',
                //     },
                // },
            });
            console.log("configOptions: ", configOptions)
            // const response = await RNFetchBlob.config(configOptions).fetch('GET', url);

            // Return the path to the downloaded file
            return response;
        } catch (error) {
            console.error(error);
            return null;
        }

    }

    isLeapYear(year) {
        console.log("year  "+year)
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    DownloadStatement() {

        const startDate = moment(this.state.startDate);
        const endDate = moment(this.state.endDate);
        const Year = endDate.year();
        const daysDifference = endDate.diff(startDate, 'days');

        console.log("days diff-" + daysDifference);

        if (daysDifference <= 365  || daysDifference <= 366 && this.isLeapYear(Year)) {
            this.DownloadStatementApi();
        }
        else {
            Snackbar.show({ text: 'Maximum of one year is allowed', duration: Snackbar.LENGTH_SHORT, backgroundColor: 'orange' });

        }

    }


    DownloadStatementApi() {


        console.log(this.state.startDate)
        console.log(this.state.endDate)

        if (this.state.startDate > this.state.endDate) {
            Snackbar.show({
                text: 'Please Select Valid From Date',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'red'
            });
        }
        else {

            const Headers = APIUrlConstants.Headers("ACCSTATREQ");

            const Body =
            {
                PARACNT: "11",
                PARA1_TYP: "STR",
                PARA1_VAL: Constants.GMST_CODE,
                PARA2_TYP: "STR",
                PARA2_VAL: this.UserAccountNo,
                PARA3_TYP: "STR",
                PARA3_VAL: this.UserACMASTCODE,
                PARA4_TYP: "STR",
                PARA4_VAL: this.BRANCHCODE,
                PARA5_TYP: "STR",
                PARA5_VAL: Constants.Name,
                PARA6_TYP: "STR",
                PARA6_VAL: "0",
                PARA7_TYP: "STR",
                PARA7_VAL: moment(this.state.startDate).format("DD-MMM-YYYY"),
                PARA8_TYP: "STR",
                PARA8_VAL: moment(this.state.endDate).format("DD-MMM-YYYY"),
                PARA9_TYP: "STR",
                PARA9_VAL: "PDF",
                PARA10_TYP: "STR",
                PARA10_VAL: Constants.BankCode,
                PARA11_TYP: "STR",
                PARA11_VAL: Constants.SecretKey,
            }

            console.log("Download Statement URL:- " + APIUrlConstants.BASE_URL);
            console.log("");
            console.log("Download Statement Body:- " + JSON.stringify(Body));
            console.log("");

            sendData(this,
                'post',
                APIUrlConstants.BASE_URL,
                Headers,
                JSON.stringify(Body),
                this.DownloadStatementApiCallback)

        }
    }


    DownloadStatementApiCallback = async (obj, response) => {

        //console.log("Download Statement Response:- " + JSON.stringify(response));

        let res = response.SUCCESS

        if (res === "FALSE") {
            return okDialog(this, "Hellos")
        }
        else if (res === "TRUE") {
            console.log("Success TRUE");
            if (Platform.OS === 'ios') {
                Snackbar.show({
                    text: 'Statement Generated successfully please saved file',
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'green'
                });
            }
            else {
                Snackbar.show({
                    text: 'Statement Downloaded successfully',
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: 'green'
                });
            }

            const currentDate = new Date();

            // Format the date and time to use in the file name
            const formattedDate = currentDate.toISOString().slice(0, 10); // YYYY-MM-DD
            const formattedTime = currentDate.toTimeString().slice(0, 8).replace(/:/g, ''); // HHMMSS


            var RESULTT = "data:application/pdf;base64," + response.RESULT
            try {


                if (Platform.OS === 'ios') {
                    const { config, fs } = RNFetchBlob;
                    const cacheDir = fs.dirs.DocumentDir;
                    const base64Data = RESULTT.replace('data:application/pdf;base64,', '')
                    const filename = `Statement${formattedDate}_${formattedTime}.pdf`;
                    const imagePath = `${cacheDir}/${filename}`;
                    console.log("PDF file saved to : ", imagePath)
                    const myData1 = RNFetchBlob.fs.writeStream(
                        imagePath,
                        'base64',
                        true)
                        .then((ofstream) => {
                            ofstream.write('foo')
                            ofstream.write('bar')
                            ofstream.close()
                        })
                    const myData = RNFS.writeFile(imagePath, base64Data, 'base64');
                    // console.log("myData: ", myData)
                    FileViewer.open(imagePath)
                }
                else {
                    const base64Data = RESULTT.replace('data:application/pdf;base64,', '')
                    const filename = `Statement${formattedDate}_${formattedTime}.pdf`;
                    const path = RNFS.DownloadDirectoryPath + '/' + filename;
                    RNFS.writeFile(path, base64Data, 'base64');
                    console.log('PDF file saved to ', path)

                    RNFS.exists(path).then((res) => {
                        if (res) {
                            console.log('Open PDF File', res)
                            FileViewer.open(path)
                        }
                    });
                }
            } catch (error) {
                console.error('Error:', error);
            }

        }
        else {
            console.log("Success FALSE");
        }


    }




    SelectedDateDuration = (verifyType) => {
        switch (verifyType) {
            case '1 Month':
                this.state.startDate = new Date().setMonth(new Date().getMonth() - 1)
                this.state.endDate = new Date()
                break;

            case '3 Month':
                this.state.startDate = new Date().setMonth(new Date().getMonth() - 3)
                this.state.endDate = new Date()
                break;

            case '6 Month':
                this.state.startDate = new Date().setMonth(new Date().getMonth() - 6)
                this.state.endDate = new Date()
                break;
            case '12 Month':
                this.state.startDate = new Date().setMonth(new Date().getMonth() - 12)
                this.state.endDate = new Date()
                break;

            case strings.custom:
                return <CardView
                    cardElevation={3}
                    cardMaxElevation={3}
                    cornerRadius={6}
                    style={{
                        // flex: 1,
                        height: 45,
                        backgroundColor: 'white',
                        width: width - 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 10,
                        flexDirection: 'row',
                    }}
                >
                    <View style={{
                        height: 40,
                        flex: 0.5,
                        justifyContent: 'center',
                    }}
                    >
                        <TouchableOpacity
                            onPress={
                                () => this.setState({ startShowDatePicker: true, endShowDatePicker: false })
                            }
                            style={{
                                height: 40,
                                // backgroundColor: 'red',
                                justifyContent: 'center',
                                // alignItems: 'flex-start',
                                alignItems: 'center',
                                flexDirection: 'row'

                            }}
                        >
                            <View
                                style={{}}
                            >
                                {this.state.startDate ?
                                    <Text
                                        style={{ fontSize: 10, fontFamily: strings.fontRegular, color: this.props.textColor }}
                                    > {strings.fromDate} </Text> : <Text style={{ fontSize: 0 }}
                                    ></Text>}
                                {this.state.startDate ?
                                    <Text style={{
                                        fontSize: 12,
                                        color: this.props.textColor, fontFamily: strings.fontRegular,
                                        marginRight: 5,
                                    }}> {moment(this.state.startDate).format("DD MMM YYYY")} </Text>
                                    :
                                    <Text style={{
                                        fontSize: 12,
                                        //  paddingLeft: 15,
                                        color: this.props.textColor,
                                        fontFamily: strings.fontRegular,
                                        marginRight: 5,
                                    }}>{strings.fromDate}</Text>
                                }
                            </View>
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 2
                                // marginHorizontal: 10
                            }} >
                                <Arrowdown height={12} width={12} />
                            </View>


                        </TouchableOpacity>
                    </View>

                    {/* devider   */}
                    <View
                        style={{
                            height: 40,
                            width: 1,
                            backgroundColor: '#ced1df',
                        }}
                    />

                    {/* end Date */}
                    <View style={{
                        height: 40,
                        flex: 0.5,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}

                    >
                        <TouchableOpacity
                            onPress={
                                () => {
                                    this.setState({ endShowDatePicker: true, startShowDatePicker: false })

                                    console.log("start Date------------", this.state.startShowDatePicker)
                                }
                            }
                            // disabled={this.state.initialDate ? true : false}
                            style={{
                                height: 40,
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'row'
                            }}
                        >
                            <View>
                                {this.state.endDate ?
                                    <Text
                                        style={{ fontSize: 10, fontFamily: strings.fontRegular, color: this.props.textColor }}
                                    >{strings.ToDate}</Text> : <Text style={{ fontSize: 0 }}
                                    ></Text>}
                                {this.state.endDate ?
                                    <Text style={{
                                        fontSize: 12,
                                        color: this.props.textColor,
                                        fontFamily: strings.fontRegular,
                                        marginRight: 5
                                    }}>{moment(this.state.endDate).format("DD MMM YYYY")} </Text>
                                    :
                                    <Text style={{
                                        fontSize: 12,
                                        color: this.props.textColor,
                                        fontFamily: strings.fontRegular,
                                        marginRight: 5
                                    }}>{strings.ToDate}</Text>
                                }
                            </View>
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 2
                                // marginHorizontal: 10
                            }} >
                                <Arrowdown height={12} width={12} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </CardView >

                break;
        }
    };

    base64ToBinary(base64) {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);

        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        return bytes.buffer;
    }

    binaryToBlob(binaryData) {
        return new Blob([binaryData], { type: 'application/pdf' });
    }

    downloadPDF(blob, fileName) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
                            }}>{strings.downloadStatemant}
                            </Text>

                            <Text style={{
                                fontSize: 15,
                                color: 'black',
                                textAlign: 'left',
                                fontFamily: strings.fontMedium,
                                color: colors.white,
                            }}>{strings.mpassSubStr}
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


                        {/*UI-TAG Profile Card */}
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
                                    // justifyContent: 'space-between',
                                    alignItems: 'center',
                                    height: 140,
                                    width: width - 60,
                                    flexDirection: 'row',
                                }}
                                >
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
                                            >{strings.fullName}</Text>
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
                                            >{strings.AccNumber}</Text>
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
                                            >{strings.AvailBal}</Text>
                                            <Text
                                                style={{
                                                    color: 'white',
                                                    fontFamily: strings.fontRegular,
                                                    fontSize: 15
                                                }}
                                            >{this.UserBalance.startsWith('-') ? ("₹ " + this.UserBalance.replace('-', '') + " Cr") : ("₹ " + this.UserBalance + " Dr")}
                                            </Text>
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
                                            >{strings.accType}</Text>
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


                        {/*UI_TAG select Months */}
                        <View
                            style={{
                                marginTop: 15,
                                height: 48,
                                width: width - 50,
                                backgroundColor: colors.white,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 8,
                                borderWidth: 1,
                                borderColor: '#DFE1E8',
                                marginBottom: 10
                            }}

                        >
                            <TouchableOpacity style={{

                                flexDirection: 'row',
                                alignItems: 'center',

                            }}
                                onPress={() => this.setState({ isVerify: true, labelText: 'Select Period' })}
                            >

                                <View style={{ flex: 1, }}>
                                    <Text style={{
                                        color: colors.accTextColor + '80',
                                        marginLeft: 15,
                                        fontSize: 10,
                                        fontFamily: strings.fontMedium
                                    }}>
                                        {strings.selectPeriod}
                                    </Text>


                                    <Text style={{
                                        color: colors.accTextColor,
                                        marginLeft: 15,
                                        fontSize: 15,
                                        fontFamily: strings.fontMedium
                                    }}>
                                        {this.state.verifyType}
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


                        </View>

                        {
                            selectAccount(
                                this.state.isVerify,
                                this.selectPeriod,
                                this.onSelectVerify,
                                this.state.labelText,
                                this.state.verifyType,
                                "ListTypeDesign"
                            )
                        }



                        {/*UI-TAG for custom date - Added Design in switch case */}
                        {this.SelectedDateDuration(this.state.verifyType)}




                        <View
                            style={{
                                padding: 15,
                                flex: 1,
                                justifyContent: 'flex-end',
                                alignItems: 'center'
                            }}>



                            {/*UI-TAG Download Statement */}
                            <CardView
                                cardElevation={this.state.verifyType == 'Select your statement month' ? 0 : 3}
                                cardMaxElevation={3}
                                cornerRadius={12}
                                style={{
                                    backgroundColor: 'gray',
                                    justifyContent: 'center',
                                    marginVertical: 15,
                                    // marginBottom : 15,
                                }}
                            >

                                <TouchableOpacity
                                    style={{
                                        padding: 15,
                                        width: width - 45,
                                        backgroundColor: this.state.verifyType == 'Select your statement month' ? colors.btnDisable : this.props.themeColor,
                                        justifyContent: 'center',
                                        borderRadius: 12,
                                        alignItems: 'center',
                                    }}
                                    disabled={this.state.verifyType == 'Select your statement month' ? true : false}
                                    onPress={() => { this.DownloadStatement() }}
                                >
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',

                                        }}
                                    >



                                        <Download width={15} height={15} fill={colors.white} />
                                        <Text style={{
                                            marginLeft: 7,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontFamily: strings.fontMedium,
                                            fontSize: 15
                                        }}>
                                            {strings.downloadStatemant}
                                        </Text>


                                    </View>
                                </TouchableOpacity>
                            </CardView>

                            {/*UI-TAG My Account */}
                            <TouchableOpacity
                                style={{
                                    // marginVertical: 10,
                                }}

                                onPress={() => this.toMyaccount()}
                            >

                                <Text style={{
                                    fontSize: 15,
                                    color: 'black',
                                    textAlign: 'left',
                                    fontFamily: strings.fontMedium,
                                    color: this.props.SecondaryColor,
                                }}>{strings.myAcc}
                                </Text>
                            </TouchableOpacity>


                        </View>

                    </View >

                </ImageBackground >


                <DateTimePickerModal
                    isVisible={this.state.startShowDatePicker}
                    mode="date"
                    date={new Date()}
                    isDarkModeEnabled={false}
                    maximumDate={new Date()}
                    themeVariant={"light"}
                    onConfirm={this._onDateSelectedForStartDate}
                    onCancel={this._startHideDatePicker}
                    format="DD-MMM-YYYY"
                    // minimumDate={new Date()}
                    display={Platform.OS === "ios" ? "inline" : "default"}
                // timeZoneOffsetInMinutes={2 * 60}
                />
                <DateTimePickerModal
                    isVisible={this.state.endShowDatePicker}
                    mode="date"
                    minimumDate={new Date(this.state.startDate)}
                    maximumDate={new Date()}
                    date={new Date()}
                    isDarkModeEnabled={false}
                    themeVariant={"light"}
                    onConfirm={this._onDateSelectedForEndDate}
                    onCancel={this._endHideDatePicker}
                    display={Platform.OS === "ios" ? "inline" : "default"}
                // timeZoneOffsetInMinutes={2 * 60}
                />
            </View >


        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountDownloadStatement);
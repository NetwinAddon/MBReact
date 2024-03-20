import React, { Component, useRef } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    ImageBackground,
    StyleSheet,
    BackHandler,
    TouchableOpacity,
    Clipboard,

} from 'react-native'
import {
    colors,
    strings,
    assets,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    width,
    navigation,
    themeImage,
    appThemeConfiguration,
    config,
    sendData,
} from '../../App';

import TrasnsperantFixedHeader from '../../components/TrasnperantFixedHeader';
import Constants from '../../common/Constants.js';
import APIUrlConstants from '../../common/APIUrlConstants.js';
import Snackbar from 'react-native-snackbar';
import { _toEncrypt, decryptData } from '../../common/util.js';
import { RFValue } from "react-native-responsive-fontsize";
import CopyIcon from '../../assets/icons/copy.svg';
import Footer from '../../assets/icons/footer.svg';
import CardView from 'react-native-cardview';
import PhonePay from '../../assets/icons/UpiOperator/ic_PhonePay.svg'
import Paytm from '../../assets/icons/UpiOperator/ic_Paytm.svg'
import Gpay from '../../assets/icons/UpiOperator/ic_Gpay.svg'
import Falcon from '../../assets/icons/UpiOperator/ic_Falcon.svg'
import Sbi from '../../assets/icons/UpiOperator/ic_Sbi.svg'
import Hdfc from '../../assets/icons/UpiOperator/ic_Hdfc.svg'
import Icic from '../../assets/icons/UpiOperator/ic_icici.svg'
import Download from '../../assets/icons/fi-rr-download.svg'
import Share from '../../assets/icons/ic_share.svg'


import ViewShot from 'react-native-view-shot';
import { PermissionsAndroid, Platform } from 'react-native';


class QRCodeDisplay extends Component {

    constructor(props) {
        super(props);
        this.state =
        {
            UserName: Constants.Name,
            AccDetails: props.route.params.AccDetails,
            QRCODE: props.route.params.QRCODE,
            Upi_Id: props.route.params.Upi_Id,
            UPIMERSRNO: props.route.params.UPIMERSRNO,
            STRTBLSRNO: props.route.params.STRTBLSRNO,
            STRTERSRNO: props.route.params.STRTERSRNO,
            UPIMode: props.route.params.UPIMode,
        }
        this.viewShotRef = React.createRef();

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);

    }

    componentDidMount() {

        // this.GetQRCode(this.state.AccDetails.AC_NO, this.state.AccDetails.ACMASTCODE, this.state.AccDetails.ACTYPE)

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

    async requestStoragePermission() {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission',
                        message: 'App needs access to your storage to download the image.',
                        buttonPositive: 'OK',
                    },
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    return true;
                } else {
                    console.log('Storage permission denied');
                    return false;
                }
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else {
            return true;
        }
    }

    async captureAndSaveView() {
        const hasPermission = await this.requestStoragePermission();
        if (hasPermission) {
            try {
                const uri = await this.viewShotRef.current.capture();
                // Use uri to save the image or perform other actions
                console.log('Image saved:', uri);
            } catch (error) {
                console.error('Error capturing view:', error);
            }
        } else {
            console.log('Permission denied, cannot save image');
        }
    }








    CopyUpiId = async () => {

        try {
            await Clipboard.setString(this.state.Upi_Id);

            Snackbar.show({
                text: 'UPI ID Copied !!',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: 'green'
            });

        } catch (error) {
            console.error('Error copying text: ', error);
        }
    };

    ShareQR() {

    }


    DownloadQR = async () => {


        const Headers = APIUrlConstants.Headers("GETUPIQRCD");

        const jsonReq =
        {
            customerId: Constants.GMST_CODE,
            CALLFROM: 'PRINT',
            CALLFROM_2: 'PRINT',
            MER_NO_2: this.state.UPIMERSRNO,
            STORE_NO_2: this.state.STRTBLSRNO,
            TER_ID_2: this.state.STRTERSRNO,
            divId: this.props.DeviceId,
            secKey: Constants.SecretKey,
            UPI_MODE_2: this.state.UPIMode,
        }

        console.log("DownloadQR call--" + JSON.stringify(jsonReq))

        let jsonValue = await _toEncrypt(JSON.stringify(jsonReq));

        const Body =
        {
            PARACNT: "1",
            PARA1_TYP: "STR",
            PARA1_VAL: JSON.stringify(jsonValue),

        }


        console.log("DownloadQR Body--" + JSON.stringify(Body))

        sendData(this,
            'post',
            APIUrlConstants.BASE_URL,
            Headers,
            JSON.stringify(Body),
            async (obj, response) => {
                var responseData = await decryptData(response)
                var newRes = responseData.slice(16)
                var finalRes = JSON.parse(newRes)

                console.log("GetQRCode Resp--" + JSON.stringify(finalRes))

                let res = finalRes.SUCCESS
                if (res === "FALSE") {
                    const ErrorMsg = finalRes.RESULT
                    Snackbar.show({ text: ErrorMsg, duration: Snackbar.LENGTH_SHORT, backgroundColor: 'red' });


                }
                else if (res === "TRUE") {


                }

            })

    }





    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg2


    render() {

        return (

            <View style={styles.flexOne}>

                <ImageBackground style={styles.flexOne}
                    source={this.bgImage}
                    resizeMode='cover'>


                    <View style={{ flex: 1, flexDirection: 'column' }}>


                        <View style={styles.HeaderBg}>
                            <TrasnsperantFixedHeader
                                backAction={() => this.onBackAction()}
                            />

                            <Text style={styles.HeaderText}>Scan & Pay</Text>



                            <View style={[styles.ProfileCircle, { backgroundColor: this.props.SecondaryColor, }]}>
                                <Text style={styles.userNameText}>{this.state.UserName.charAt(0).toUpperCase()}</Text>
                            </View>

                            <Text style={styles.userNameTextValue}>{this.state.UserName}</Text>


                            <TouchableOpacity style={styles.UpiTDViewStyle}
                                onPress={this.CopyUpiId}
                            >


                                <Text style={styles.UpiIDTextStyle}>{this.state.Upi_Id}</Text>

                                <CopyIcon height={15} width={15} color={'#FFF'} />


                            </TouchableOpacity>




                        </View>


                        <View style={styles.MainCurve}>


                            <View style={styles.ScrollViewView}>

                                <ViewShot ref={this.viewShotRef} options={{ format: 'jpg', quality: 0.9 }}>
                                    <CardView
                                        cardElevation={1}
                                        cardMaxElevation={1}
                                        cornerRadius={12}
                                        style={styles.CardStyle}

                                    >

                                        <View style={styles.CardViewStyle}>


                                            <View style={styles.QRViewBG}>

                                                <Image source={{ uri: this.state.QRCODE }} style={styles.QRStyle} />


                                            </View>


                                            <View style={styles.dashedLine}></View>


                                            <Text style={[styles.NormalText, { color: this.props.PrimaryColor, }]}>From any UPI app</Text>


                                            <View style={styles.UPIIconView}>

                                                <PhonePay height={25} width={25} />
                                                <Paytm height={25} width={30} />
                                                <Gpay height={25} width={25} />
                                                <Falcon height={25} width={25} />
                                                <Sbi height={25} width={25} />
                                                <Hdfc height={25} width={25} />
                                                <Icic height={25} width={25} />

                                            </View>


                                        </View>

                                    </CardView>
                                </ViewShot>


                                <View style={styles.ProcessView}>


                                    <TouchableOpacity style={[styles.DownloadViewBg, { backgroundColor: this.props.SecondaryColor + '1A', }]}
                                        // onPress={this.ShareQR}
                                        onPress={() => this.captureAndSaveView()}
                                    >

                                        <Share height={17} width={17} color={this.props.SecondaryColor} />

                                        <Text style={[styles.NormalText, { marginLeft: 5, color: this.props.PrimaryColor, }]}>Share QR</Text>

                                    </TouchableOpacity>


                                    <TouchableOpacity style={[styles.DownloadViewBg, { backgroundColor: this.props.SecondaryColor + '1A', }]}
                                        onPress={this.DownloadQR}
                                    >

                                        <Download height={15} width={15} fill={this.props.SecondaryColor} />

                                        <Text style={[styles.NormalText, { marginLeft: 5, color: this.props.PrimaryColor, }]}>Download QR</Text>

                                    </TouchableOpacity>


                                </View>


                            </View>

                            <View style={styles.FooterStyle}>
                                <Footer height={70} width={300} />
                            </View>


                        </View>

                    </View>

                </ImageBackground>


            </View>

        )
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(QRCodeDisplay);


const styles = StyleSheet.create({

    flexOne:
    {
        flex: 1,
    },


    HeaderText:
    {
        color: 'white',
        fontSize: RFValue(20),
        fontFamily: strings.fontBold,
        alignSelf: 'center',
        marginTop: -42,

    },

    HeaderSubText:
    {
        marginLeft: 25,
        color: 'white',
        fontSize: RFValue(13),
        fontFamily: strings.fontRegular
    },

    HeaderBg:
    {
        flex: 0.45,
        justifyContent: 'flex-start'
    },

    MainCurve:
    {
        flex: 0.55,
        alignItems: 'center',
        backgroundColor: '#fbfcfc',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flexDirection: 'column',
    },

    ScrollViewView:
    {
        flex: 1,
        marginTop: 20,
    },

    HolderName:
    {
        color: '#929CAC',
        fontSize: RFValue(13),
        fontFamily: strings.fontRegular,
        marginTop: 30,
        marginLeft: 10,
    },

    userNameText:
    {
        color: 'white',
        fontSize: RFValue(30),
        fontFamily: strings.fontMedium
    },
    ProfileCircle:
    {
        width: 60,
        height: 60,
        borderRadius: 60 / 2,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 25,
    },

    userNameTextValue:
    {
        fontSize: RFValue(15),
        textAlign: 'left',
        fontFamily: strings.fontBold,
        color: 'white',
        alignSelf: 'center',
        marginTop: 10,
    },

    UpiIDTextStyle:
    {
        color: 'white',
        alignSelf: 'center',
        fontSize: RFValue(12),
        marginRight: 5,
    },

    UpiTDViewStyle:
    {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 3,
        paddingHorizontal: 10,
        marginTop: 5,
        borderRadius: 15,
        flexWrap: 'wrap',
        alignSelf: 'center'

    },
    FooterStyle:
    {
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    CardStyle:
    {
        backgroundColor: 'white',
        marginTop: -120,
        marginBottom: 5,
        marginHorizontal: '15%',
        padding: 20,
    },
    CardViewStyle:
    {
        borderColor: '#cdcdce',
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    QRStyle: {
        width: '100%', // 90% of the container width
        height: '100%', // 90% of the container height
        resizeMode: "cover"
    },

    QRViewBG: {
        width: '100%',
        height: 210,
        overflow: 'hidden',
        elevation: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },

    dashedLine: {
        width: '100%',
        borderWidth: 1,
        borderHight: 1,
        borderStyle: 'dashed',
        borderColor: '#C7C7C7',
        marginVertical: 20,
    },

    NormalText:
    {
        fontSize: RFValue(11),
        fontFamily: strings.fontMedium,
        alignSelf: 'center',
        alignItems: 'center'
    },

    UPIIconView:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 15
    },

    DownloadViewBg:
    {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        flex: 1,
        marginHorizontal: '2%',
        height: 40,

    },

    ProcessView:
    {
        // backgroundColor: '#6788',
        flexDirection: 'row',
        marginVertical: 20,
        flex: 1,
        justifyContent: 'space-evenly',
        marginHorizontal: '15%',
    }

})
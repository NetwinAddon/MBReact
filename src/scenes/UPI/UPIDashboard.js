import React, { Component } from 'react';

import {
    View,
    Text,
    ScrollView,
    ImageBackground,
    BackHandler,
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
} from '../../App';
import { TouchableOpacity } from 'react-native-gesture-handler';

import TrasnsperantFixedHeader from '../../components/TrasnperantFixedHeader';
import QRCodeIcon from '../../assets/icons/dashboardIcons/ico-qr-scan.svg';
import DropDown from '../../assets/icons/fi-rr-angle-right.svg';
import CardView from 'react-native-cardview'
import Colors from '../../common/Colors';
import Footer from '../../assets/icons/footer.svg';
import Time from '../../assets/icons/dashboardIcons/ico-history.svg';
import Registration from '../../assets/icons/ic_regi_tick.svg';
import People from '../../assets/icons/ic_user_double.svg';
import Scan from '../../assets/icons/ic_scan_dash.svg'

class UPIDashboard extends Component {

    constructor(props) {
        super(props);

        this.state =
        {
            accounList: props.route.params.accList,
        }


        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentDidMount() {

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


    PTM_QRCODE() {
        navigation.navigate(this, 'UPI_PTwoM', { accList: this.state.accounList,})
    }

    PTM_REGISTRATION() {
        navigation.navigate(this, 'PTPM_RegAcList', { accList: this.state.accounList, Type: 'P2M' })
    }

    PTP_QRCODE() {
        navigation.navigate(this, 'UPI_PTwoP', { accList: this.state.accounList,})
    }

    PTP_REGISTRATION() {
        navigation.navigate(this, 'PTPM_RegAcList', { accList: this.state.accounList, Type: 'P2P' })
    }



    bgImage = appThemeConfiguration(this.props.AppThemeSet).bgImg3


    render() {

        return (
            <View style={styles.flexOne}>

                <ImageBackground style={styles.flexOne}
                    source={this.bgImage}
                    resizeMode='cover'>

                    <View style={styles.HeaderBg}>
                        <TrasnsperantFixedHeader
                            backAction={() => this.onBackAction()}
                        />

                        <Text style={styles.HeaderText}>UPI</Text>

                        <Text style={styles.HeaderSubText}>Manage Your UPI Terminals</Text>


                    </View>

                    <View style={styles.MainCurve}>

                        <View style={styles.ScrollViewView}>


                            <ScrollView
                                style={styles.flexOne}
                                contentContainerStyle={styles.ScrollViewContailerStyle}
                                showsVerticalScrollIndicator={false}
                            >

                                <View>


                                    <CardView
                                        cardElevation={1}
                                        cardMaxElevation={1}
                                        cornerRadius={12}
                                        style={styles.CardStyle}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.PTP_REGISTRATION()
                                            }}>
                                            <View style={styles.Touchablestyle}>

                                                <View style={styles.CardInternalContentStyle} >

                                                    <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A', }]} >
                                                        <People height={25} width={25} color={this.props.SecondaryColor} />
                                                    </View>

                                                    <Text style={[styles.MainTextStyle, { color: this.props.PrimaryColor, }]}> P2P Registration </Text>
                                                </View>

                                                <View>
                                                    <DropDown width={20} height={20} />
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </CardView>

                                    <CardView
                                        cardElevation={1}
                                        cardMaxElevation={1}
                                        cornerRadius={12}
                                        style={styles.CardStyle}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.PTM_REGISTRATION()
                                            }}>
                                            <View style={styles.Touchablestyle}>

                                                <View style={styles.CardInternalContentStyle} >

                                                    <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A', }]} >
                                                        <Registration height={25} width={25} color={this.props.SecondaryColor} />
                                                    </View>

                                                    <Text style={[styles.MainTextStyle, { color: this.props.PrimaryColor, }]}> P2M Registration </Text>
                                                </View>

                                                <View>
                                                    <DropDown width={20} height={20} />
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </CardView>

                                    <CardView
                                        cardElevation={1}
                                        cardMaxElevation={1}
                                        cornerRadius={12}
                                        style={styles.CardStyle}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.PTP_QRCODE()
                                            }}>
                                            <View style={styles.Touchablestyle}>

                                                <View style={styles.CardInternalContentStyle} >

                                                    <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A', }]} >
                                                        <QRCodeIcon height={25} width={25} color={this.props.SecondaryColor} />
                                                    </View>

                                                    <Text style={[styles.MainTextStyle, { color: this.props.PrimaryColor, }]}> P2P QRCODE </Text>
                                                </View>

                                                <View>
                                                    <DropDown width={20} height={20} />
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </CardView>

                                    <CardView
                                        cardElevation={1}
                                        cardMaxElevation={1}
                                        cornerRadius={12}
                                        style={styles.CardStyle}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.PTM_QRCODE();
                                            }}>
                                            <View style={styles.Touchablestyle}>

                                                <View style={styles.CardInternalContentStyle} >

                                                    <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A', }]} >
                                                        <QRCodeIcon height={25} width={25} color={this.props.SecondaryColor} />
                                                    </View>

                                                    <Text style={[styles.MainTextStyle, { color: this.props.PrimaryColor, }]}> P2M QRCODE </Text>
                                                </View>

                                                <View>
                                                    <DropDown width={20} height={20} />
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </CardView>

                                    <CardView
                                        cardElevation={1}
                                        cardMaxElevation={1}
                                        cornerRadius={12}
                                        style={styles.CardStyle}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {

                                            }}>
                                            <View style={styles.Touchablestyle}>

                                                <View style={styles.CardInternalContentStyle} >

                                                    <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A', }]} >
                                                        <Scan height={25} width={25} color={this.props.SecondaryColor} />
                                                    </View>

                                                    <Text style={[styles.MainTextStyle, { color: this.props.PrimaryColor, }]}> Scan & Pay </Text>
                                                </View>

                                                <View>
                                                    <DropDown width={20} height={20} />
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </CardView>


                                    <CardView
                                        cardElevation={1}
                                        cardMaxElevation={1}
                                        cornerRadius={12}
                                        style={styles.CardStyle}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {

                                            }}>
                                            <View style={styles.Touchablestyle}>

                                                <View style={styles.CardInternalContentStyle} >

                                                    <View style={[styles.IconBgStyle, { backgroundColor: this.props.SecondaryColor + '1A', }]} >
                                                        <Time height={25} width={25} color={this.props.SecondaryColor} />
                                                    </View>

                                                    <Text style={[styles.MainTextStyle, { color: this.props.PrimaryColor, }]}> UPI Pay Status </Text>
                                                </View>

                                                <View>
                                                    <DropDown width={20} height={20} />
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </CardView>








                                </View>


                            </ScrollView>


                        </View>

                        <View style={styles.FooterStyle}>
                            <Footer height={70} width={300} />
                        </View>

                    </View>




                </ImageBackground>


            </View>

        );
    }

}


const styles =
{
    flexOne:
    {
        flex: 1,
    },

    HeaderBg:
    {
        flex: 0.25,
        justifyContent: 'flex-start'
    },

    HeaderText:
    {
        marginLeft: 25,
        color: 'white',
        fontSize: 24,
        fontFamily: strings.fontBold,

    },

    HeaderSubText:
    {
        marginLeft: 25,
        color: 'white',
        fontSize: 15,
        fontFamily: strings.fontRegular
    },

    MainCurve:
    {
        flex: 0.75,
        alignItems: 'center',
        backgroundColor: '#fbfcfc',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flexDirection: 'column',

    },

    ScrollViewView:
    {
        flex: 1,
        marginTop: 20
    },

    ScrollViewContailerStyle:
    {
        alignItems: 'center',
        paddingBottom: 40,
    },

    CardStyle:
    {
        backgroundColor: 'white',
        marginTop: 15,
        width: width - 40,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    Touchablestyle:
    {

        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 15,
        alignItems: 'center',
        width: width - 40,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10,
        borderColor: '#cdcdce',
        borderRadius: 12,

    },

    CardInternalContentStyle:
    {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    IconBgStyle:
    {
        height: 50,
        width: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5,
    },
    MainTextStyle:
    {
        fontSize: 15,
        includeFontPadding: false,
        fontFamily: strings.fontMedium,
        marginLeft: 15,
    },
    FooterStyle:
    {
        alignItems: 'center',
        justifyContent: 'flex-end'
    },

}

export default connect(mapStateToProps, mapDispatchToProps)(UPIDashboard);

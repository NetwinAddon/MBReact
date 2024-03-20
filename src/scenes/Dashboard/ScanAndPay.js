import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {
    strings,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    width,
    navigation,
    RenderLoader,
    appThemeConfiguration,
    colors
} from '../../App';
import { RFValue } from "react-native-responsive-fontsize";
import FixedHeader from '../../components/FixedHeader';
import ScanPayIcon from '../../assets/icons/ScanAndPay-icon.svg'

class ScanAndPay extends Component {
    constructor(props) {
        super(props);
        var userData = props.route.params.customData
        this.state = {
            selectedValue: 'option1',
            isFocus: false,
            isSearchButtonClick: false,
            userName: userData.NAME,
            totalAmount: 0,
            positionNo: 0,
            perVal: [],
            colors: [],
            data4: [],
            labels4: [],
            combinedData: [],
            myTempData: [],
            ACNO: '',
            accountTypeBalances: {},
            doubleBackToExitPressedOnce: false,
            SelectedeAccountList: [],
            isYesNoModalVisible: false,
            searchTerm: '',
            bgImage: appThemeConfiguration(this.props.AppThemeSet).bgImg, //HRP task No 107295
        };
    }

    onBackArrow = () => {
        navigation.goBack(this)
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <View style={styles.innerContainer}>
                    <FixedHeader
                        backAction={() => this.onBackArrow()}
                        color={'#1F3C66'} />
                    <View style={styles.scanPayContainer}>
                        <Text style={styles.scanPayText}> Scan & Pay</Text>
                    </View>
                    <View style={styles.scanPayIconContainer}>
                        <View style={styles.scanPayIconInnerContainer}>
                            <ScanPayIcon height={400}
                                width={400}></ScanPayIcon>
                        </View>
                        <View style={styles.scanPayFeatureTextContainer}>
                            <Text style={styles.scanPayFeatureText}>Scan and Pay feature, enhancing your Mobile Banking experience, is
                            </Text>
                        </View>
                        <Text style={styles.comingSoonText}>{'COMING\nSOON!'}</Text>
                    </View>
                </View>
                <RenderLoader />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    MainHeading:
    {
        fontSize: 25,
        textAlign: 'left',
        marginLeft: 10,
        fontFamily: strings.fontBold,
    },
    mainContainer:
    {
        flex: 1,
        backgroundColor: colors.white
    },
    innerContainer:
    {
        flex: 1,
        alignItems: 'center',
        width: width,
    },
    scanPayContainer:
    {
        marginTop: -40,
    },
    scanPayText:
    {
        fontSize: RFValue(23),
        fontFamily: strings.fontBold,
        color: "#1f3c66",
        textAlign: 'center',
        includeFontPadding: false,
        fontWeight: "700",
        fontFamily: "SF UI Display",
    },
    scanPayIconContainer:
    {
        flex: 0.92,
        justifyContent: 'center',
        alignItems: 'center'
    },
    scanPayIconInnerContainer:
    {
        marginHorizontal: 19,
        alignItems: 'center'
    },
    scanPayFeatureTextContainer:
    {
        width: width - 60
    },
    scanPayFeatureText:
    {
        fontSize: RFValue(16),
        fontWeight: "600",
        fontFamily: "SF UI Display",
        color: "#1f3c66",
    },
    comingSoonText:
    {
        fontSize: RFValue(30),
        fontFamily: strings.fontMedium,
        color: "#EB5757",
        fontWeight: "900",
        textShadowColor: 'rgba(128, 0, 0, 0.5)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
        marginTop: 5,
        width: width - 60
    },

})




export default connect(mapStateToProps, mapDispatchToProps)(ScanAndPay);

import React from 'react';
import Modal from 'react-native-modal'
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import CardView from 'react-native-cardview';
import { colors, strings, width } from '../App';
import Warning from '../assets/icons/triangle_warning.svg'
import { check } from 'react-native-permissions';
export function DialogAddBeneficiaryConfirmPopup(isVisible, isNo, isYes, beneficiaryAccTypeValue, benificiaryAccTitle, benificiaryAcc, checked, from, amount) {
    return (
        <Modal
            isVisible={isVisible}
            backdropOpacity={0.8}
            animationIn={'fadeIn'}
            animationInTiming={500}
            animationOut={'fadeOut'}
            animationOutTiming={100}>
            <View>
                <View>
                    <View>
                        <CardView
                            style={styles.mainCard}
                            cardElevation={2}
                            cardMaxElevation={2}
                            cornerRadius={8}>
                            {
                                from === 'Add Beneficiary' ?
                                    <View style={styles.confirmBenficiaryView}>
                                        <Text
                                            style={styles.confirmBenficiaryAccountText}>
                                            Please Confirm The Beneficiary Account!
                                        </Text>
                                        <Text
                                            style={styles.confirmBenficiaryAccountTextValue}>
                                            {beneficiaryAccTypeValue}
                                        </Text>
                                        <Text
                                            style={styles.benificiaryAccNameNo}>
                                            {benificiaryAccTitle + ' | ' + benificiaryAcc}
                                        </Text>
                                    </View>
                                    : from === 'IMPS Transfer' ?
                                        <View style={styles.confirmBenficiaryView}>
                                            <Text
                                                style={styles.benificiaryAccNameNo}>
                                                {'Account No.: ' + benificiaryAcc + ' ' + benificiaryAccTitle}
                                            </Text>
                                            <Text
                                                style={styles.benificiaryAccNameNo}>
                                                {'Amount: ' + checked}
                                            </Text>
                                            <Text
                                                style={styles.benificiaryAccNameNo}>
                                                {'Service Charge: ' + beneficiaryAccTypeValue}
                                            </Text>
                                        </View>
                                        : from === 'IMPS Charges Confirm' ?
                                            <View style={styles.confirmBenficiaryView}>
                                                <Text
                                                    style={styles.benificiaryAccNameNo}>
                                                    {'Account No.: ' + benificiaryAcc + ' ' + benificiaryAccTitle}
                                                </Text>
                                                <Text
                                                    style={styles.benificiaryAccNameNo}>
                                                    {'Amount: ' +
                                                        amount}
                                                </Text>
                                                <Text
                                                    style={styles.benificiaryAccNameNo}>
                                                    {'Service Charge: ' + beneficiaryAccTypeValue}
                                                </Text>
                                            </View> : 
                                            from === 'NEFT Charges Confirm' ?
                                            <View style={styles.confirmBenficiaryView}>
                                            <Text style={styles.benificiaryAccNameNo}>
                                                {"Account No.: " + benificiaryAcc}
                                            </Text>
                                            <Text style={styles.benificiaryAccNameNo}>
                                                {"Amount: " + amount}
                                            </Text>
                                            <Text style={styles.benificiaryAccNameNo}>
                                                {"Service Charge: " +checked}
                                            </Text>
                                        </View> : 
                                            from === 'IMPS Edit Beneficiary' ?
                                                <View style={styles.warningImgView}>
                                                    <View style={styles.warningImgSubView}>
                                                        <Warning height={50} width={50} />
                                                    </View>
                                                    <Text style={styles.closeBeneAcText}>
                                                        Are you sure you want to close the beneficiary account?
                                                    </Text>
                                                    <Text style={styles.closeBeneAccTitle}>
                                                        {benificiaryAccTitle}
                                                    </Text>
                                                    <View style={styles.closeBeneAccView}>
                                                        <Text style={styles.closeBeneAccNoText}> {"A/c No. " + benificiaryAcc}
                                                        </Text>
                                                    </View>
                                                </View> :
                                                from === 'IMPS Add Beneficiary' ?
                                                    <View>
                                                        <View style={styles.confirmBenficiaryView}>
                                                            <Text style={styles.confirmBenficiaryAccountText}>
                                                                Please Confirm The Beneficiary Account!
                                                            </Text>
                                                            <Text style={styles.confirmBenficiaryAccountTextValue}>
                                                                {"Bank Name: " + beneficiaryAccTypeValue}
                                                            </Text>
                                                            <Text style={styles.ifscCodeText}>
                                                                {"IFSC Code: " + benificiaryAccTitle}
                                                            </Text>
                                                            <View style={styles.ifscCodeMainView}>
                                                                <Text style={styles.ifscbenAcNo}>
                                                                    {"A/c No. " + benificiaryAcc}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    </View> :
                                                    from === 'NEFT Close Beneficiary' ?
                                                            <View>
                                                                <View>
                                                                        <View style={styles.confirmBenficiaryView}>
                                                                            <View style={styles.warningImgView}>
                                                                                <Warning height={28} width={28} />
                                                                            </View>
                                                                            <Text style={styles.closeBenetext}>
                                                                                Are you sure you want to close the beneficiary account?
                                                                            </Text>
                                                                            <Text style={styles.closeBenetextTitle}>
                                                                                {benificiaryAccTitle + " | " + benificiaryAcc}
                                                                            </Text>
                                                                        </View>
                                                            </View>
                                                        </View> :
                                                        <View style={styles.modifyPopupMainView}>
                                                            <Text
                                                                style={styles.pleaseConfirmBenficiaryAccountText}>
                                                                Please Confirm The Beneficiary Account!
                                                            </Text>
                                                            <Text
                                                                style={styles.beneficiaryStatus}>
                                                                {'Beneficiary A/c Name: ' + benificiaryAccTitle}
                                                            </Text>
                                                            <Text
                                                                style={styles.beneficiaryStatus}>
                                                                {'A/c No: ' + benificiaryAcc}
                                                            </Text>
                                                           
                                                            {checked ?  null : (
                                                                <Text
                                                                    style={styles.beneficiaryStatus}>
                                                                    {'Transaction Limit: ' + strings.rupee + beneficiaryAccTypeValue}
                                                                </Text>
                                                              ) }
                                                           

                                                            {checked ? (
                                                                <View style={styles.beneficiaryRow}>
                                                                    <Text
                                                                        style={styles.beneficiaryStatus}>
                                                                        Beneficiary Status:
                                                                    </Text>
                                                                    <Text
                                                                        style={styles.requestCloseText}>
                                                                       {' Request for close beneficiary'}
                                                                    </Text>

                                                                    
                                                                </View>
                                                            ) : null}
                                                        </View>
                            }
                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    style={styles.cancelButtonTouchable}
                                    onPress={() => isNo()}>
                                    <Text
                                        style={styles.cancelButtonText}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.confirmButtonTouchable}
                                    onPress={() => {
                                        isYes()
                                    }}>
                                    <Text
                                        style={styles.confirmButtonText}>
                                        Confirm
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </CardView>
                    </View>
                </View>
            </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
    mainCard:
    {
        width: '100%',
        borderRadius: 8,
        backgroundColor: colors.white,
    },
    confirmBenficiaryView:
    {
        marginTop: 27,
        marginHorizontal: 19
    },
    confirmBenficiaryAccountText:
    {
        color: '#555555',
        fontSize: 11,
        fontFamily: strings.fontMedium,
    },
    confirmBenficiaryAccountTextValue:
    {
        color: '#555555',
        marginTop: 15,
        fontSize: 11,
        fontFamily: strings.fontMedium,
    },
    benificiaryAccNameNo:
    {
        color: '#555555',
        marginTop: 15,
        fontSize: 14,
        fontFamily: strings.fontMedium,
    },
    buttonRow:
    {

        flexDirection: 'row',
        marginTop: 20,
        paddingBottom: 20,
        marginHorizontal: 19

    },
    cancelButtonTouchable:
    {
        width: width - 50,
        borderColor: colors.btnColor,
        justifyContent: 'center',
        borderRadius: 12,
        flex: 1,
        marginRight: 9,
        borderWidth: 1,
        height: 45,
    },
    cancelButtonText:
    {
        alignSelf: 'center',
        color: colors.btnColor,
        fontFamily: strings.fontBold,
        fontSize: 15,
    },
    confirmButtonTouchable:
    {
        width: width - 50,
        backgroundColor: colors.btnColor,
        justifyContent: 'center',
        borderRadius: 12,
        flex: 1,
        marginLeft: 9,
        height: 45,
    },
    confirmButtonText:
    {
        color: 'white',
        alignSelf: 'center',
        fontFamily: strings.fontBold,
        fontSize: 15,
    },
    requestCloseText:
    {
        color: 'red',
        marginTop: 15,
        fontSize: 14,
        fontFamily: strings.fontMedium,
    },
    beneficiaryStatus:
    {
        color: '#555555',
        marginTop: 15,
        fontSize: 14,
        fontFamily: strings.fontMedium,
    },
    beneficiaryRow:
    {
        flexDirection: 'row'
    },
    pleaseConfirmBenficiaryAccountText:
    {
        color: '#555555',
        fontSize: 11,
        fontFamily: strings.fontMedium,
    },
    modifyPopupMainView:
    {
        marginTop: 27,
        marginHorizontal: 19
    },
    flatListItemAcNo:
    {
        color: '#252525',
        padding: 10, fontFamily: strings.fontMedium,
        fontSize: 12
    },
    flatListItemAcNoView:
    {
        borderColor: 'black',
        borderTopWidth: 1,
        width: 215,
        height: 1,
        opacity: 0.1,
        borderStyle: 'solid',
    },
    warningImgView:
    {
        marginTop: 6,
        marginHorizontal: 19,
        alignItems: 'center'
    },
    warningImgSubView:
    {
        alignSelf: 'center',
        justifyContent: 'center',
        height: 33,
        width: 33,
        backgroundColor: '#FFEBEB',
        alignItems: 'center',
        borderRadius: 16.5,
        marginTop: 15,
    },
    closeBeneAcText:
    {
        color: '#252525',
        fontSize: 15,
        fontFamily: strings.fontMedium,
        fontWeight: '500',
        textAlign: 'center',
        marginTop: 10
    },
    closeBeneAccTitle:
    {
        color: '#1F3C66',
        marginTop: 18,
        fontSize: 16,
        fontFamily: strings.fontBold,
        fontWeight: '700'
    },
    closeBeneAccView:
    {
        borderRadius: 15,
        backgroundColor: '#FFEBEB',
        height: 40,
        marginTop: 7,
        alignItems: 'center',
        justifyContent: 'center'
    },
    closeBeneAccNoText:
    {
        color: '#EB5757',
        fontSize: 15,
        fontFamily: strings.fontMedium,
        textAlign: 'center',
        alignSelf: 'center',
        fontWeight: '500',
        paddingHorizontal: 10,
    },
    impsAddBeneView:
    {
        padding: 10,
        backgroundColor: '#F3F3F3',
        borderRadius: 8
    },
    impsCardView:
    {
        borderRadius: 8,
        backgroundColor: colors.white,
    },
    ifscCodeText:
    {
        color: '#1F3C66',
        marginTop: 15,
        fontSize: 14,
        fontFamily: strings.fontMedium
    },
    ifscCodeMainView:
    {
        borderRadius: 15,
        backgroundColor: '#B7F3CF',
        height: 40,
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },
    ifscbenAcNo:
    {
        color: '#252525',
        fontSize: 14,
        fontFamily: strings.fontMedium,
        textAlign: 'center',
        alignSelf: 'center'
    },
    closeBenetext:
    {
        color: '#252525',
        fontSize: 12,
        fontFamily: strings.fontMedium,
        fontWeight: '500',
        textAlign: 'center',
        marginTop: 18
    },
    closeBenetextTitle:
    {
        color: '#EB5757',
        marginTop: 18,
        fontSize: 14,
        fontFamily: strings.fontMedium,
        fontWeight: '500',
        textAlign: 'center',
    }
});
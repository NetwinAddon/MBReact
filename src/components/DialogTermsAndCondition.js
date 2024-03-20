import React from 'react';
import Modal from 'react-native-modal'
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from "react-native";
import CardView from 'react-native-cardview';
import { colors, strings, width } from '../App';

export function DialogTermsAndCondition(isVisible, isNO, isYes, termsAndConditionText, from) {
    const SubmitButtonClick = () => {
        if (from === 'QuickPayOwnAccountTransfer') {
            isYes()
        }
        else if (from === 'QuickPayOwnAccountTransferDetail') {
            isYes()
        }
        else if (from === 'WithinOtherAccountTransferDetail') {
            isYes()
        }
        else if (from === 'IMPS Transfer') {
            isYes()
        }
        else if (from === 'NEFT Transfer') {
            isYes()
        }
        else {

        }
    }
    return (
        <Modal isVisible={isVisible}
            backdropOpacity={0.8}
            animationIn={'fadeIn'}
            animationInTiming={500}
            animationOut={'fadeOut'}
            animationOutTiming={100}>
            <View style={styles.mainView}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Terms & Conditions</Text>
                    <ScrollView showsHorizontalScrollIndicator={true}>
                        {termsAndConditionText.map((item, index) => (
                            <View key={index} style={styles.bullet}>
                                <Text
                                    style={styles.bulletIconColor}
                                >{`\u2022 `}</Text>
                                <Text style={styles.bulletText}>{item}</Text>
                            </View>
                        ))}
                    </ScrollView>
                    <CardView
                        cardElevation={3}
                        cardMaxElevation={3}
                        cornerRadius={12}
                        style={styles.submitButtonCard}>
                        <TouchableOpacity
                            style={styles.submitTouchable}
                            onPress={() => {
                                SubmitButtonClick()
                            }}
                        ><Text style={styles.submitButtonText}>
                                {strings.submit}
                            </Text>
                        </TouchableOpacity>
                    </CardView>
                </View>
            </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
    mainView:
    {
        marginVertical: 70,
        alignItems: 'center',
        alignSelf: 'center'
    },
    modalContent: {
        margin: 20,
        backgroundColor: '#F3F3F3',
        padding: 16,
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: 'white',
        elevation: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#1F3C66',
        fontFamily: strings.fontMedium
    },
    bullet: {
       
        flexDirection: 'row',
        marginBottom: 8,
    },
    bulletText: {
        marginLeft: 5,
        color: '#252525',
        fontFamily: strings.fontRegular,
        paddingRight:18
    },
    bulletIconColor:
    {
        color: '#252525'
    },
    submitTouchable:
    {
        padding: 15,
        width: width - 120,
        backgroundColor: colors.btnColor,
        backgroundColor: colors.btnColor,
        justifyContent: 'center',
        borderRadius: 12,
    },
    submitButtonText:
    {
        alignSelf: 'center',
        color: colors.white,
        fontFamily: strings.fontRegular,
        fontSize: 15
    },
    submitButtonCard:
    {
        backgroundColor: 'white',
        justifyContent: 'center',
        marginVertical: 10,
    },
});
import React from 'react';
import Modal from 'react-native-modal'
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { colors, strings } from '../App';

export function DialogYesNoModal(isVisible, isNO, isYes, okDialogText, themecolor) {
    const color = themecolor;
    return (
        <Modal
            isVisible={isVisible}
            backdropOpacity={0.8}
            animationIn={'fadeIn'}
            animationInTiming={500}
            animationOut={'fadeOut'}
            animationOutTiming={100}>
            <View style={styles.mainView}>
                <Text
                    style={[styles.okDialogText,{ backgroundColor: color}]}>
                    {strings.okdialogHeader}
                </Text>
                <Text
                    style={styles.okDialogValue}>
                    {okDialogText}
                </Text>
                <View style={styles.yesTextView}>
                    <TouchableOpacity
                        style={styles.yesTextTouchableOpacity}
                        onPress={() => {
                            isYes()
                        }}>
                        <Text style={styles.yesText}>
                            {strings.yes}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.noTextTouchable}
                        onPress={() => {
                            isNO()
                        }}>
                        <Text style={styles.yesText}>
                            {strings.no}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
    mainView:
    {
        backgroundColor: 'white'
    },
    okDialogText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 10,
    },
    okDialogValue:
    {
        textAlign: 'center',
        paddingVertical: 16,
        paddingHorizontal: 15,
        color: colors.black,
    },
    yesTextView:
    {
        flexDirection: 'row'
    },
    yesTextTouchableOpacity:
    {
        borderTopColor: colors.themeColor,
        borderTopWidth: 1,
        paddingVertical: 12,
        flex: 1,
    },
    yesText:
    {
        textAlign: 'center',
        color: colors.black
    },
    noTextTouchable:
    {
        borderTopColor: colors.themeColor,
        borderTopWidth: 1,
        paddingVertical: 12,
        flex: 1,
        borderLeftWidth: 1,
        borderLeftColor: colors.themeColor,
    },

});
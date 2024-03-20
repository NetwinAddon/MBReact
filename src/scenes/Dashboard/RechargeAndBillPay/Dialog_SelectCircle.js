import React from 'react';
import Modal from 'react-native-modal'

import { FlatList, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import CardView from 'react-native-cardview';
import Arrowdown from '../../../assets/icons//dashboardIcons/arrow_down.svg'
import { colors, strings } from '../../../App';


export function Dialog_SelectCircle(isVisible, accTypes, onSelectAccount, labelValue) {
    return (
        <Modal isVisible={isVisible}
            backdropOpacity={0.8}
            onBackdropPress={() => onSelectAccount(labelValue)}
            onBackButtonPress={() => onSelectAccount(labelValue)}
            animationIn={'fadeIn'}
            animationInTiming={500}
            animationOut={'fadeOut'}
            animationOutTiming={100}>

            <View
                style={styles.mainContainer}>
                <CardView
                    style={styles.cardStyle}
                    cardElevation={2}
                    cardMaxElevation={2}
                    cornerRadius={8}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={styles.mainInnerContainer}>
                            <Text style={styles.MainText}> Select Circle </Text>
                        </View>
                        <View style={styles.IconStyle} >
                            <Arrowdown height={15} width={15} />
                        </View>
                    </View>
                </CardView>
                <FlatList
                    data={accTypes}
                    ItemSeparatorComponent={() => {
                        return (
                            <View
                                style={styles.ItemSepraterr} />);
                    }}
                    style={styles.FlatListStyle}
                    renderItem={({ item }) =>
                        <TouchableOpacity
                            onPress={() => {
                                onSelectAccount(item)
                            }}>
                            <View style={styles.circleNameView}>
                                <View style={styles.mainInnerContainer}>
                                    <Text style={styles.circleNameText}>
                                        {item.circle_name}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    }
                />
            </View>
        </Modal>
    );

}

const styles = StyleSheet.create({
    cardStyle:
    {
        height: 45,
        width: '100%',
        borderRadius: 8,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    MainText:
    {
        color: '#252525',
        marginLeft: 15,
        fontSize: 15,
        fontFamily: strings.fontMedium
    },
    IconStyle:
    {
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        marginHorizontal: 10
    },
    ItemSepraterr:
    {
        height: 0.5,
        width: '90%',
        backgroundColor: colors.backgroundColor,
        alignSelf: 'center'
    },
    FlatListStyle:
    {
        backgroundColor: colors.white,
        borderRadius: 8,
        paddingLeft: 10,
        paddingRight: 10,
        margin: 10
    },
    mainContainer:
    {
        borderRadius: 8,
         backgroundColor: "#DCDCDC80", 
         marginVertical: 40
    },
    mainInnerContainer:
    {
        flex:1
    },
    circleNameView:
    {
        flexDirection: 'row'
    },
    circleNameText:
    {
        color: '#252525',
         padding: 10 
    }

})
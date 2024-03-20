import React from 'react';
import Modal from 'react-native-modal'
import { FlatList, View, TouchableOpacity, Text, StyleSheet } from "react-native";
import CardView from 'react-native-cardview';
import Arrowdown from '../assets/icons//dashboardIcons/arrow_down.svg'
import { colors, strings } from '../App';

export function BeneficairyAccTypeCustomPopup(isVisible, accTypes, onSelectAccount, labelText, labelValue) {
    return (
        <Modal isVisible={isVisible}
            backdropOpacity={0.8}
            onBackdropPress={() => onSelectAccount(labelValue)}
            onBackButtonPress={() => onSelectAccount(labelValue)}
            animationIn={'fadeIn'}
            animationInTiming={500}
            animationOut={'fadeOut'}
            animationOutTiming={100}>
            <View style={styles.mainCard}>
                <CardView style={styles.cardStyle}
                    cardElevation={2}
                    cardMaxElevation={2}
                    cornerRadius={8}>
                    <View style={styles.innerContainer}>
                        <View style={{ flex: 1, }}>
                            <Text style={{
                                color: '#25252580',
                                marginLeft: 15,
                                fontSize: 10,
                                fontFamily: strings.fontMedium
                            }}>
                                Account Type
                            </Text>
                            <Text style={{
                                color: '#252525',
                                marginLeft: 15,
                                fontSize: 15,
                                fontFamily: strings.fontMedium
                            }}>
                                Select Beneficiary A/c Type
                            </Text>
                        </View>
                        <View style={{
                            alignItems: 'center',
                            alignContent: 'center',
                            justifyContent: 'center',
                            marginHorizontal: 10
                        }} >
                            <Arrowdown height={15} width={15} />
                        </View>
                    </View>
                </CardView>
                
                <View style={{
                            backgroundColor: colors.white,
                            justifyContent: 'center',
                            marginHorizontal: 10,
                            paddingBottom:10,
                            borderRadius: 8,
                            borderWidth: 1,
                            borderColor: colors.white,
                            marginTop:10
                        }}>
                <FlatList
                    data={accTypes}
                    renderItem={({ item, index }) => 
                    <View>
                        <TouchableOpacity
                            onPress={() => {
                                console.log(item.title+" "+item.id)
                                onSelectAccount(item.id, item.title)
                            }}>

                            <View>
                                <Text style={{ color: '#252525', padding: 10, fontFamily: strings.fontBold, fontSize: 12, }}>
                                    {item.title}
                                </Text>
                                <View style={{
                                    borderColor: 'black',
                                    borderTopWidth: 1,
                                    marginHorizontal:10,
                                    height: 1,
                                    opacity: 0.1,
                                    borderStyle: "solid",
                                    
                                }} />
                            </View>
                        </TouchableOpacity>
                    </View>}
                />
                </View>
            </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
    mainCard:
    {
        borderRadius: 8,
        backgroundColor: "#f3f3f3",
        paddingBottom: 10
    },
    cardStyle:
    {
        height: 45,
                        width: '100%',
                        borderRadius: 8,
                        backgroundColor: colors.white,
                        justifyContent: 'center',
                        alignItems: 'center',
    },
    innerContainer:
    {
        flexDirection: 'row',
        alignItems: 'center'
    },
    
});
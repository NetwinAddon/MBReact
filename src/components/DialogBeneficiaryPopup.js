import React from 'react';
import Modal from 'react-native-modal'
import { View, TouchableOpacity, Text, StyleSheet, TextInput, FlatList } from "react-native";
import CardView from 'react-native-cardview';
import { colors, strings, width } from '../App';
import Arrowdown from '../assets/icons/dashboardIcons/arrow_down.svg';
import SearchIcon from '../assets/icons/Vector.svg';
import CircleIcon from '../assets/icons/angle-circle-right.svg';
export function DialogBeneficiaryPopup(isVisible, isNo, isYes, filteredData, SecondaryColor, handleSearch, searchTerm, handleSearchIcon, from) {
    return (
        <Modal
            isVisible={isVisible}
            backdropOpacity={0.8}
            onBackdropPress={() => isNo()}
            onBackButtonPress={() => isNo()}
            animationIn={'fadeIn'}
            animationInTiming={500}
            animationOut={'fadeOut'}
            animationOutTiming={100}>
            <View
                style={styles.mainView}>
                <CardView
                    style={styles.mainCardView}
                    cardElevation={2}
                    cardMaxElevation={2}
                    cornerRadius={8}>
                    <View
                        style={styles.horzontalLabelCard}>
                        <View style={styles.mainCard}>
                            <Text
                                style={styles.beneficiaryAccText}>
                                Beneficiary A/c
                            </Text>
                            <Text
                                style={styles.searchOrSelectBeneficiaryText}>
                                Search Or Select Beneficiary A/c
                            </Text>
                        </View>

                        <View
                            style={styles.arrowDownView}>
                            <Arrowdown height={15} width={15} />
                        </View>
                    </View>
                </CardView>
                <View
                    style={styles.searchMainView}>
                    <CardView
                        cardElevation={3}
                        cardMaxElevation={3}
                        cornerRadius={6}
                        style={styles.searchCard}>
                        <TextInput
                            style={[styles.searchTextInput,{color : '#000000'}]}
                            onChangeText={(text) => handleSearch(text)}
                            value={searchTerm}
                            placeholder='Search Beneficiary'
                            placeholderTextColor= '#808080'
                        />
                        <TouchableOpacity onPress={() =>{
                            if(from === 'Within Other A/c AddBeneficiary')
                            {
                                handleSearchIcon() 
                            }
                          
                        }}
                            style={[styles.searchIconTouchable, { backgroundColor: SecondaryColor }]}>
                            <SearchIcon height={20} width={20} color={'#ffffff'} />
                        </TouchableOpacity>
                    </CardView>
                </View>
                <FlatList
                    data={filteredData}
                    renderItem={({ item, index }) => (
                        <View
                            style={styles.flatListMainView}>
                            <TouchableOpacity
                                onPress={() => {
                                isYes( item, 'isClick')}}>
                                <View>
                                    <View
                                        style={styles.flatListRowData}>
                                        <View style={styles.flatListColumnData}>
                                            <Text
                                                style={styles.flatListItemTitle}>
                                                {from === 'Within Other Verify Beneficiary' ? "Bnf Id: "+item.BNFID : from === 'IMPS Beneficiary' ? item.BENF009 : item.NAME}
                                            </Text>
                                            <View
                                                 style={styles.flatListItemAcNoView}/>
                                            <Text
                                                 style={styles.flatListItemAcNo}>
                                                A/c No: {from === 'Within Other A/c AddBeneficiary' ? item.AADHAR_REFNO : from === 'Within Other A/c AddBeneficiary' ? item.BAADHAR_REFNO : from === 'IMPS Beneficiary' ? item.BENF008 : item.BAC_NO}
                                            </Text>
                                        </View>
                                        <CircleIcon height={20} width={20} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
        </Modal>
    );
}
const styles = StyleSheet.create({
    mainView:
    {
        borderRadius: 8,
        backgroundColor: '#f3f3f3',
        paddingBottom: 10,
        marginVertical:100
    },
    mainCardView:
    {
        height: 45,
        width: '100%',
        borderRadius: 8,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    horzontalLabelCard:
    {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mainCard:
    {
        flex: 1
    },
    beneficiaryAccText:
    {
        color: '#25252580',
        marginLeft: 15,
        fontSize: 10,
        fontFamily: strings.fontMedium,
    },
    searchOrSelectBeneficiaryText:
    {
        color: '#252525',
        marginLeft: 15,
        fontSize: 15,
        fontFamily: strings.fontMedium,
    },
    arrowDownView:
    {

        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,

    },
    searchMainView:
    {
        marginTop: 10,
        height: 64,
        width: width - 50,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 8,
        marginBottom: 10,
        borderRadius: 8,
    },
    searchCard:
    {
        height: 48,
        backgroundColor: 'white',
        width: width - 70,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    searchTextInput:
    {
        paddingLeft: 10,
        flex: 0.85,
        backgroundColor: 'white',
        fontFamily: strings.fontMedium,
        fontSize: 14,
    },
    searchIconTouchable:
    {
        flex: 0.15,
        height: 45,
        margin: 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    flatListMainView:
    {
        backgroundColor: colors.white,
        justifyContent: 'center',
        marginHorizontal: 10,
        marginTop: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.white,
    },
    flatListRowData:
    {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 12,
    },
    flatListColumnData:
    {
        flexDirection: 'column',
        flex: 1
    },
    flatListItemTitle:
    {
        color: '#252525',
        padding: 10,
        fontFamily: strings.fontBold,
        fontSize: 12
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
});
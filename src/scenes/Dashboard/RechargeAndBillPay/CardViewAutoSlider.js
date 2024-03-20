import React from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import {
    strings,
    width,
} from '../../../App';
import Swiper from 'react-native-swiper';
import CardView from 'react-native-cardview';
import Airtel from '../../../assets/icons/Airtel.svg';
import Jio from '../../../assets/icons/Jio.svg';
import { useNavigation } from '@react-navigation/native';

const CardViewAutoSlider = ({ CardType }) => {
    const navigation = useNavigation();
    const slides = [
        {
            username: 'Poonam Jadhav',
            mobileNumber: '1234567890',
            simCompany: 'Airtel',
            validity: '4',
            rechargeAmount: '299'
        },
        {
            username: 'Raju Shinde',
            mobileNumber: '9876543210',
            simCompany: 'Jio',
            validity: '4',
            rechargeAmount: '99',

        },
        {
            username: 'Santosh Yande',
            mobileNumber: '9876543210',
            simCompany: 'Airtel',
            validity: '14',
            rechargeAmount: '699'
        },
        {
            username: 'Raju Shinde',
            mobileNumber: '9876543210',
            simCompany: 'Jio',
            validity: '29',
            rechargeAmount: '499'
        },
        {
            username: 'Shreyas Tarwate',
            mobileNumber: '9856543210',
            simCompany: 'Jio',
            validity: '60',
            rechargeAmount: '199'
        },

    ];

    return (
        <View style={styles.mainView}>
            <Swiper
                autoplay={true}
                autoplayTimeout={4}
                showsPagination={true}
                dot={<View style={styles.paginationDot} />}
                activeDot={<View style={styles.activePaginationDot} />}
                loop={true}
                style={styles.swiperStyle}>
                {slides.map((slide, index) => (
                    <View key={index}>
                        <View style={styles.innerMainView}>
                            <CardView
                                cardElevation={10}
                                cardMaxElevation={10}
                                cornerRadius={15}
                                style={styles.innerMainCard}>
                                <View style={styles.innerCardView}>
                                    <View style={styles.iconContainer}>
                                        <View style={styles.simIcon}>
                                            {slide.simCompany === 'Airtel' ? <Airtel height={26} width={26} style={{ marginLeft: 11, marginTop: 13 }} /> : slide.simCompany === 'Jio' ? <Jio height={36} width={36} style={{ marginLeft: 8, marginTop: 8 }} /> : null}
                                        </View>
                                    </View>

                                    <View style={styles.textContainer}>
                                        <Text style={styles.username} numberOfLines={1} ellipsizeMode="tail">
                                            {slide.username}
                                        </Text>
                                        <Text style={styles.mobileNumber}>{slide.mobileNumber}</Text>
                                    </View>
                                    <View style={{}}>
                                        <Text style={styles.rechargeAmountText}>{strings.rupee + slide.rechargeAmount}</Text>
                                    </View>
                                </View>
                                <View style={styles.lastRechargeView}>
                                    <View style={styles.lastRechargeInnerView}>
                                        {CardType == 'Prepaid' ?
                                            <Text style={styles.lastRechargeText}>
                                                {'Last recharge: 2nd Aug, 2023,\nIt will '}
                                                <Text style={[styles.expiredInText, { fontSize: 12 }]}>expire in {slide.validity} days</Text>.
                                            </Text>
                                            :
                                            <Text style={{ fontSize: 13 }}>
                                                {'Postpaid Phone Bill '}
                                                <Text style={[styles.expiredInText, { fontSize: 13 }]}>Due in {slide.validity} days</Text>.
                                            </Text>
                                        }
                                    </View>
                                    <View style={styles.payBillView}>
                                        <TouchableOpacity
                                            style={styles.payBillTouchable}
                                            onPress={() => CardType === 'Prepaid' ?
                                                navigation.navigate('rechargePay', {
                                                    RechargeAmount: '100',
                                                    UserName: slide.username,
                                                    MobileNumber: slide.mobileNumber
                                                }) :
                                                null
                                            }>
                                            <Text style={styles.payBillText}>{CardType == 'Prepaid' ? 'Recharge Now' : 'Pay Bill'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </CardView >
                        </View >
                    </View >
                ))}
            </Swiper >
        </View >
    );
};

export default CardViewAutoSlider

const styles = StyleSheet.create({
    paginationDot: {
        marginBottom: -18,
        width: 7,
        height: 7,
        borderRadius: 4,
        margin: 4,
        backgroundColor: 'rgba(217, 217, 217, 1)',
    },
    activePaginationDot: {
        marginBottom: -19,
        width: 7,
        height: 7,
        borderRadius: 4,
        margin: 3,
        backgroundColor: 'rgba(255, 89, 54, 1)',
    },
    iconContainer: {
        width: 50,
        marginRight: 15
    },
    simIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 0.5,
        elevation: 2,
    },
    textContainer: {
        flex: 2,
        marginRight: 10
    },
    username: {
        fontSize: 18,
        fontWeight: '500',
        color: '#000'
    },
    mobileNumber: {
        fontSize: 16,
    },
    mainView:
    {
        height: 170
    },
    swiperStyle:
    {
        borderWidth: 1
    },
    innerMainView:
    {
        alignItems: 'center'
    },
    innerMainCard:
    {
        height: 125,
        backgroundColor: '#fff',
        width: width - 50,
        marginTop: 10,
    },
    innerCardView:
    {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems: 'center',
        marginBottom: 10,
    },
    rechargeAmountText:
    {
        fontSize: 25,
        fontWeight: "700",
        fontFamily: "SF UI Display",
        color: "#1f3c66",
        textAlign: "center",
    },
    lastRechargeView:
    {
        flexDirection: 'row',
        paddingLeft: 10,
        alignItems: 'center',
        width: width - 50,
    },
    lastRechargeInnerView:
    {
        flex: 1.9,
        paddingRight: 10,
        justifyContent: 'center'
    },
    expiredInText:
    {
        fontWeight: 'bold',
        color: '#ff5936',
    },
    lastRechargeText:
    {
        fontSize: 12
    },
    payBillView:
    {
        flex: 1.2,
        justifyContent: 'flex-end'
    },
    payBillTouchable:
    {
        borderRadius: 50,
        backgroundColor: "#ff5936",
        width: 100,
        height: 28,
        justifyContent: 'center'
    },
    payBillText:
    {
        fontSize: 12,
        fontWeight: "500",
        fontFamily: "SF UI Display",
        color: "#fff",
        textAlign: "center"
    }
});


//  RGP

import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    StyleSheet
} from 'react-native';
import Footer from '../../../assets/icons/footer.svg';
import {
    colors,
    strings,
    assets,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    width,
    navigation,
} from '../../../App';
import CardView from 'react-native-cardview';
import FixedHeader from '../../../components/FixedHeader';

class PrepaidRechargeSuccess extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.screenWidth = Dimensions.get("window").width;
    }

    render() {
        return (
            <View style={[styles.mainContainer, { backgroundColor: 'white' }]}>
                <FixedHeader />
                <View style={[styles.mainContainer, { alignItems: 'center' }]}>
                    <View style={[styles.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                        <Image
                            source={assets.success}
                            style={styles.imageStyle} />
                        <Text style={[styles.congratulationText, { color: this.props.textColor, }]}>Congratulations!</Text><Text
                            style={[styles.succesfullText, { color: this.props.textColor, }]}>Prepaid Recharge Successfully Done.</Text>
                    </View>
                    <View style={[styles.mainContainer, { justifyContent: 'flex-end' }]}>
                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={12}
                            style={styles.cardStyle}>
                            <TouchableOpacity style={styles.cardTouchable}
                            ><Text style={styles.backTo}>Back to Menu</Text>
                            </TouchableOpacity>
                        </CardView>
                        <View>
                            <Footer height={70} width={300} />
                        </View>
                    </View>
                </View>
            </View>

        );
    }
}


const styles = StyleSheet.create({
    mainContainer:
    {
        flex: 1
    },
    imageStyle:
    {
        height: 106,
        width: 106,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    congratulationText:
    {
        alignItems: 'flex-end',
        textAlign: 'center',
        fontFamily: strings.fontMedium,
        marginTop: 20,
        fontSize: 26,
        width: 250
    },
    succesfullText:
    {
        width: width - 45,
        textAlign: 'center',
        fontFamily: strings.fontMedium,
        marginTop: 15,
        fontSize: 15,
    },
    cardStyle:
    {
        backgroundColor: 'gray',
        justifyContent: 'center',
        marginVertical: 10
    },
    cardTouchable:
    {
        padding: 15,
        width: width - 45,
        backgroundColor: colors.btnColor,
        justifyContent: 'center',
        borderRadius: 12,
    },
    backTo:
    {
        alignSelf: 'center',
        color: 'white',
        fontFamily: strings.fontRegular,
        fontSize: 15
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(PrepaidRechargeSuccess);

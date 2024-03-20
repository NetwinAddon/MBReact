import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    StyleSheet,
} from 'react-native';
import {
    colors,
    strings,
    assets,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    width,
} from '../../App';
import Footer from '../../assets/icons/footer.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CardView from 'react-native-cardview'
import FixedHeader from '../../components/FixedHeader';

class ExistingUserLoginSuccess extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        setTimeout(() => {
            this.props.navigation.replace('createMpin')
        }, 1000);
    }

    render() {
        return (
            <View style={[styles.mainContainer, { backgroundColor: 'white' }]}>
                <FixedHeader />
                <View style={[styles.mainContainer, { alignItems: 'center' }]}>
                    <View style={[styles.mainContainer, { justifyContent: 'center', alignItems: 'center' }]}>
                        <Image
                            source={assets.success}
                            style={styles.imgContainer} />
                        <Text style={[styles.congratulationsText, { color: this.props.textColor }]}>
                            {strings.congratulations}</Text>
                        <Text style={[styles.redirectionText, { color: this.props.textColor }]}>
                            {strings.redirectionText}</Text>
                    </View>
                    <CardView
                        cardElevation={3}
                        cardMaxElevation={3}
                        cornerRadius={12}
                        style={styles.mPinCard}>
                        <TouchableOpacity
                            style={styles.mPinTouchable}>
                            <Text style={styles.createMpinText}>{strings.createMpin}</Text>
                        </TouchableOpacity>
                    </CardView>
                    <View style={styles.footerView}>
                        <Footer height={70} width={300} />
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
    imgContainer:
    {
        height: 106,
        width: 106,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    congratulationsText:
    {
        alignItems: 'flex-end',
        textAlign: 'center',
        fontFamily: strings.fontMedium,
        marginTop: 30,
        fontSize: 26
    },
    redirectionText:
    {
        width: width - 45,
        textAlign: 'center',
        fontFamily: strings.fontMedium,
        marginTop: 5,
        fontSize: 13,
    },
    mPinCard:
    {
        backgroundColor: 'gray',
        justifyContent: 'center',
        marginVertical: 15
    },
    mPinTouchable:
    {
        padding: 15,
        width: width - 45,
        backgroundColor: colors.btnColor,
        justifyContent: 'center',
        borderRadius: 12,
    },
    createMpinText:
    {
        alignSelf: 'center',
        color: 'white',
        fontFamily: strings.fontRegular,
        fontSize: 15
    },
    footerView:
    {
        justifyContent: 'flex-end',
        marginTop: 20
    }

});



export default connect(mapStateToProps, mapDispatchToProps)(ExistingUserLoginSuccess);

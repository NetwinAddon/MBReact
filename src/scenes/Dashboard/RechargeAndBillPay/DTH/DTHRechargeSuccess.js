import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    Dimensions,
    StyleSheet
} from 'react-native';
import Footer from '../../../../assets/icons/footer.svg';


import {
    colors,
    strings,
    assets,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    width,
    navigation,
} from '../../../../App';
import CardView from 'react-native-cardview';
import FixedHeader from '../../../../components/FixedHeader';


class DTHRechargeSuccess extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.screenWidth = Dimensions.get("window").width;


    }
    componentDidMount() {

        setTimeout(() => {

            this.submit();

        }, 1500);
    }

    submit() {
        this.props.navigation.navigate('DTHHomeScreen')
        navigation.goBack(this)
    }


    render() {
        return (
            <View style={styles.MainView}>

                <FixedHeader />

                <View style={styles.SubView}>

                    <View style={styles.ImageView}>
                        <Image
                            source={assets.success}
                            style={styles.ImageStyle} />

                        <Text style={[styles.MainText, { color: this.props.textColor, }]}> Congratulations!</Text>

                        <Text style={[styles.SubText, { color: this.props.textColor, }]}> DTH Recharge Successfully Done</Text>

                    </View>

                    <View
                        style={styles.CardViewStyle}>

                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={12}
                            style={styles.CardStyle}>

                            <TouchableOpacity
                                style={styles.BtnTouchableStyle}
                                onPress={() => this.submit()} >
                                <Text style={styles.BtnBackStyle}> Back to Menu </Text>
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


    MainView:
    {
        flex: 1,
        backgroundColor: 'white'
    },

    SubView:
    {
        flex: 1,
        alignItems: 'center',
    },

    ImageView:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    ImageStyle:
    {
        height: 106,
        width: 106,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },

    MainText:
    {
        alignItems: 'flex-end',
        textAlign: 'center',
        fontFamily: strings.fontMedium,
        marginTop: 20,
        fontSize: 26,
        width: 250
    },

    SubText:
    {
        width: width - 45,
        textAlign: 'center',
        fontFamily: strings.fontMedium,
        marginTop: 15,
        fontSize: 15,
    },

    CardViewStyle:
    {
        flex: 1,
        justifyContent: 'flex-end'
    },

    CardStyle:
    {
        backgroundColor: 'gray',
        justifyContent: 'center',
        marginVertical: 10
    },
    BtnTouchableStyle:
    {
        padding: 15,
        width: width - 45,
        backgroundColor: colors.btnColor,
        justifyContent: 'center',
        borderRadius: 12,
    },

    BtnBackStyle:
    {
        alignSelf: 'center',
        color: 'white',
        fontFamily: strings.fontRegular,
        fontSize: 15
    },

});




export default connect(mapStateToProps, mapDispatchToProps)(DTHRechargeSuccess);

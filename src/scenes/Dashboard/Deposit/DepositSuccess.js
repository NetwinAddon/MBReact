import React, { Component } from 'react';
import {
    Text,
    View,
    StatusBar,
    SafeAreaView,
    Animated,
    Image,
    Button,
    TouchableOpacity,
    Dimensions
} from 'react-native';

import {
    colors,
    strings,
    assets,
    connect,
    mapStateToProps,
    mapDispatchToProps,
    okDialog,
    RenderOkDialog,
    width,
    navigation,
} from '../../../App';
import CardView from 'react-native-cardview';
import FixedHeader from '../../../components/FixedHeader';


class DepositSuccess extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.screenWidth = Dimensions.get("window").width;
        this.data = {
            labels: ["Run"], // optional
            data: [0.8]
        };

    }
    componentDidMount() {
        console.log('props', this.props)

        // navigation.replace(this,'loginTypeSelectScreen')
        // console.log('props', this.props)
        // this.props.navigation.navigate("loginTypeSelectScreen")
        // setTimeout(() => {

        //   }, 2000);
    }

    toMainMenu(){
        navigation.navigate(this, 'bottomNavigator')
    }
    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: 'white'
            }}>

                <FixedHeader
                // backAction={() => this.onBackAction()}
                // color = {colors.textColor}
                />
                <View style={{
                    flex: 1,
                    alignItems: 'center',
                }}>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        // backgroundColor: 'red',
                        alignItems: 'center'
                    }}>
                        <Image
                            source={assets.success}
                            style={{
                                height: 106,
                                width: 106,
                                justifyContent: 'center',
                                alignItems: 'center',

                                marginVertical: 20,
                                // backgroundColor: 'blue'


                            }}
                        />
                        <Text style={{
                            color: this.props.textColor,
                            alignItems: 'flex-end',
                            textAlign: 'center',
                            fontFamily: strings.fontMedium,
                            marginTop: 20,
                            fontSize: 26,
                            width: width-80,
                            fontWeight: '800'
                        }}>
                            New Deposit Account Opened Successfully</Text>
                        <Text
                            style={{
                                width: width - 45,
                                color: this.props.textColor,
                                // alignItems: 'flex-end',
                                textAlign: 'center',
                                fontFamily: strings.fontMedium,
                                marginTop: 15,
                                fontSize: 15,

                            }}>
                            Receipt Generated Please Download</Text>
                    </View>

                    <View
                        style={{
                            flex: 1,
                            // backgroundColor : 'red',
                            justifyContent : 'flex-end'
                        }}
                    >
                        <CardView
                            cardElevation={3}
                            cardMaxElevation={3}
                            cornerRadius={12}
                            style={{
                                backgroundColor: 'gray',
                                justifyContent: 'center',
                                marginVertical: 15
                            }}
                        >
                            <TouchableOpacity
                                style={{
                                    padding: 15,
                                    width: width - 45,
                                    backgroundColor:'#FF5936',
                                    justifyContent: 'center',
                                    borderRadius: 12,
                                }}
                            // onPress={() => this.props.onSubmit()}
                            ><Text style={{
                                alignSelf: 'center',
                                color: 'white',
                                fontFamily: strings.fontRegular,
                                fontSize: 15
                            }}>
                                    Download Receipt
                                </Text>
                            </TouchableOpacity>
                        </CardView>

                        <TouchableOpacity style={{
                            justifyContent: 'flex-end',
                            marginBottom: 20
                        }}
                        onPress={() => this.toMainMenu()}
                        >
                            <Text
                                style={{
                                    // width: width - 45,
                                    color: this.props.textColor,
                                    // alignItems: 'flex-end',
                                    textAlign: 'center',
                                    fontFamily: strings.fontMedium,
                                    // padding : 15,
                                    fontSize: 15,
                                }}
                            >Back To Main Menu</Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </View>

        );
    }
}

const styles = {

    itemContainer: {
        alignItems: 'center',
        borderRadius: 5,
        height: 160,
    },

    itemCode: {
        fontWeight: '600',
        fontSize: 12,
        color: '#fff',
    },

    tabBarStyle: {
        paddingHorizontal: 10,
        height: Platform.OS === 'ios' ? 100 : 70,
        justifyContent: 'center',
        alignContent: 'center',
        borderTopColor: 'rgba(0,0,0,0.2)',
    },
    tabStyle: {
        width: 70,
        height: 60,
        // backgroundColor:'gray',
        borderRadius: 15,
        alignSelf: 'center',
        marginVertical: 15,
        // paddingTop: 5,
        paddingBottom: 10,
        // paddingHorizontal: 13,
    },
    imagetext: {
        fontSize: 12,
        color: 'white',
        width: '100%',
        position: 'absolute',
        textAlign: 'left',
        bottom: 0,
        padding: 5,
        backgroundColor: '#00000050'
    },
    item: {
        // height: 120,
        width: '100%',
        backgroundColor: '#4e4e5e',
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 10,
        marginRight: 5,
    },
    image: {
        height: 120,
        width: 200,
        borderRadius: 5,
    },
    bottomItem: {
        height: 200,
        width: 120,
        backgroundColor: '#4e4e5e',
        marginTop: 8,
        marginBottom: 15,
        marginLeft: 5,
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,

    },
    iconStyle: {
        width: 20,
        height: 20,
        backgroundColor: 'black'
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    dropdown: {
        width: '75%',
        borderColor: 'gray',
        marginTop: -45,
        borderRadius: 5,
        borderWidth: 0.2,
        paddingHorizontal: 8,
        backgroundColor: 'white',
        height: 40,
        paddingLeft: 15,

    },
}


export default connect(mapStateToProps, mapDispatchToProps)(DepositSuccess);

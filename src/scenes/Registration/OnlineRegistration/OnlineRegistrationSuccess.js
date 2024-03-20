import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    Dimensions,
    StyleSheet,
} from 'react-native';
import Footer from '../../../assets/icons/footer.svg';


import {
    colors,
    strings,
    assets,
    connect,
    mapStateToProps,
    mapDispatchToProps,

} from '../../../App';



class OnlineRegistrationSuccess extends Component {
    constructor(props) {
        super(props);

        this.state = {};
        this.screenWidth = Dimensions.get("window").width;
        this.data = {

        };

    }
    componentDidMount() {
        console.log('success props', this.props)

    }
    render() {
        return (
            <View style={styles.MainView}>

                <View style={styles.MainSubView}>

                    <Image
                        source={assets.success}
                        style={styles.ImageStyles}
                    />
                    <Text style={[styles.TextStyle, { color: this.props.PrimaryColor, }]}>Registration Successful</Text>
                </View>

                <View style={styles.FooterStyle}>
                    <Footer height={70} width={300} />
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({

    MainView:
    {
        flex: 1,
        alignItems: 'center',
    },
    MainSubView:
    {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    ImageStyles:
    {
        height: 106,
        width: 106,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    TextStyle:
    {

        alignItems: 'flex-end',
        textAlign: 'center',
        fontFamily: strings.fontBold,
        marginTop: 30,
        fontSize: 26

    },
    FooterStyle:
    {
        justifyContent: 'space-between',
        marginTop: 20
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(OnlineRegistrationSuccess);

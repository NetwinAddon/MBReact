import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    Dimensions
} from 'react-native';
import Footer from '../../../assets/icons/footer.svg';

import {
    strings,
    assets,
    connect,
    mapStateToProps,
    mapDispatchToProps,

} from '../../../App';



class OfflineRegistrationSuccess extends Component {
    constructor(props) {
        super(props);

        this.state = {
            status: this.props.status
        }


    }
    componentDidMount() {


    }
    render() {
        return (
            <View style={styles.MainView}>

                <View style={styles.ImageViewStyle}>
                    <Image
                        source={this.props.status ? assets.success : assets.Error}
                        style={styles.ImageStyle} />

                    <Text style={[styles.MainTextStyle, { color: this.props.PrimaryColor, }]}>

                        {this.props.status ? "Offline Registration \nSuccessful" : "Offline Registration \nFailed"}

                    </Text>

                </View>

                <View style={styles.FooterStyle}>
                    <Footer height={70} width={300} />
                </View>
            </View>

        );
    }
}

const styles = {

    MainView:
    {
        flex: 1,
        alignItems: 'center',
    },

    ImageViewStyle:
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

    MainTextStyle:
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
}


export default connect(mapStateToProps, mapDispatchToProps)(OfflineRegistrationSuccess);

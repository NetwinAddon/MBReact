import React, {Component} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {
  Modal,
  Portal,
  Text,
  ActivityIndicator,
  Colors,
} from 'react-native-paper';

import {connect, mapDispatchToProps, mapStateToProps} from '../redux';
import colors from '../common/Colors';
import strings from '../common/Strings';

class RenderLoader extends Component {
  constructor(props) {
    super(props);

  }

  hideModal = () => this.props.setOkDialogShown(false);
  render() {
    {console.log("loader==========", this.props.loaderShown)}
    return (
      <Portal>
        <Modal
          visible={this.props.loaderShown}
          onDismiss={() => this.hideModal()}
          contentContainerStyle={{ backgroundColor: 'transperent' }}>
          <View style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'space-around',
            backgroundColor: '#00000040',
          }}>
            <View style={{
              backgroundColor: '#FFFFFF',
              height: 80,
              width: 80,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
              <ActivityIndicator
                animating={this.props.loaderShown}
                color={this.props.SecondaryColor}
                size="small"
              />
            </View>
          </View>
        </Modal>
      </Portal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RenderLoader);

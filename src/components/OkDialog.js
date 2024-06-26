import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import {Modal, Portal, Text} from 'react-native-paper';
import {connect, mapDispatchToProps, mapStateToProps} from '../redux';
import colors from '../common/Colors';
import strings from '../common/Strings';
import translate from '../common/translator';

class RenderOkDialog extends Component {
  constructor(props) {
    super(props);
  }

  hideModal = () => this.props.setOkDialogShown(false);
  render() {
    return (
      <Portal>
        <Modal
          visible={this.props.okDialogShown}
          onDismiss={() => this.hideModal()}
          contentContainerStyle={{
            backgroundColor: 'white',
            marginHorizontal: 17,
            borderRadius: 13,
          }}>
          <Text
            style={{
              backgroundColor: colors.themeColorOrange,
              color: 'white',
              fontWeight: 'bold',
              textAlign: 'center',
              paddingVertical: 10,
              // overflow :'visible'
              borderTopRightRadius : 13,
              borderTopLeftRadius : 13,

            }}>
            {strings.okdialogHeader}
          </Text>
          <Text
            style={{
              textAlign: 'center',
              paddingVertical: 16,
              paddingHorizontal: 15,
              color: colors.black,
              // backgroundColor : 'black'
            }}>
            {translate(this.props.okDialogText)}
          </Text>

          <TouchableOpacity
            style={{
              borderTopColor: colors.themeColor,
              borderTopWidth: 1,
              paddingVertical: 12,
            }}
            onPress={() => this.hideModal()}>
            <Text style={{textAlign: 'center', color: colors.black}}>
              {strings.okdialogOkText}
            </Text>
          </TouchableOpacity>
        </Modal>
      </Portal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RenderOkDialog);

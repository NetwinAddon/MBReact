import React, {useEffect} from 'react';
import {Text, View, Image, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import CardView from 'react-native-cardview';
import FixedHeader from '../../../components/FixedHeader';
import {
 strings,
 assets,
 width,
 mapStateToProps,
 mapDispatchToProps,
 navigation,
 colors,
} from '../../../App';
const screenWidth = Dimensions.get('screen').width;
const StandingInstructionsSuccess = (props) => {
 return (
  <View style={[styles.itemContainer, {backgroundColor: 'white'}]}>
   <FixedHeader />
   <View style={[styles.itemContainer, {alignItems: 'center'}]}>
    <View style={[styles.itemContainer, {justifyContent: 'center', alignItems: 'center'}]}>
     <Image source={assets.success} style={styles.imgStyle} />
     <Text style={styles.textStyle}>New Standing Instructions Created Successfully</Text>
     <Text style={styles.subText}>Receipt Generated Please Download</Text>
    </View>

    <View style={[styles.itemContainer, {justifyContent: 'flex-end'}]}>
     <CardView cardElevation={3} cardMaxElevation={3} cornerRadius={12} style={styles.cardStyle}>
      <TouchableOpacity style={styles.btnStyle}>
       <Text style={styles.downloadBtnStyle}>Download Receipt</Text>
      </TouchableOpacity>
     </CardView>

     <TouchableOpacity
      style={{justifyContent: 'flex-end', marginBottom: 20}}
      onPress={() => {
    //    navigation.navigate(props, 'bottomNavigator');
      }}
     >
      <Text style={styles.backBtn}>Back To Main Menu</Text>
     </TouchableOpacity>
    </View>
   </View>
  </View>
 );
};

const styles = StyleSheet.create({
 imgStyle: {
  height: 106,
  width: 106,
  justifyContent: 'center',
  alignItems: 'center',
  marginVertical: 20,
 },
 itemContainer: {
  flex: 1,
 },
 cardStyle: {backgroundColor: 'gray', justifyContent: 'center', marginVertical: 15},
 textStyle: {
  color: colors.inActiveIcon,
  alignItems: 'flex-end',
  textAlign: 'center',
  fontFamily: strings.fontMedium,
  marginTop: 20,
  fontSize: 26,
  width: screenWidth - 80,
  fontWeight: '800',
 },
 backBtn: {
  color: colors.inActiveIcon,
  textAlign: 'center',
  fontFamily: strings.fontBold,
  fontSize: 15,
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
 subText: {
  width: screenWidth - 45,
  color: colors.inActiveIcon,
  textAlign: 'center',
  fontFamily: strings.fontMedium,
  marginTop: 15,
  fontSize: 15,
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
 btnStyle: {
  padding: 15,
  width: screenWidth - 45,
  backgroundColor: '#FF5936',
  justifyContent: 'center',
  borderRadius: 12,
 },
 downloadBtnStyle: {
  alignSelf: 'center',
  color: 'white',
  fontFamily: strings.fontRegular,
  fontSize: 15,
 },
});

export default connect(mapStateToProps, mapDispatchToProps)(StandingInstructionsSuccess);

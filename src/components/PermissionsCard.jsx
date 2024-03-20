import React from "react";
import { TouchableOpacity, Text, StyleSheet ,View} from "react-native";
import { colors, strings,width } from "../App";
import CardView from 'react-native-cardview'
import IcoAllow from '../assets/icons/icoAllow.svg'
const PermissionsCard = ({  onPressNo, onPressAllow, color }) => {
  return (
    <React.Fragment>
      <CardView
        cardElevation={3}
        cardMaxElevation={3}
        cornerRadius={12}
        style={styles.cardStyles}
      >
        <TouchableOpacity
          style={[styles.btnStyles, { backgroundColor: color }]}
          onPress={onPressAllow}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: 'red'
              //   marginEnd :10
            }}
          >
            <IcoAllow width={17} height={17} color={"white"} />
            <Text
              style={styles.btnTextStyles}
            >
              Allow
            </Text>
          </View>
        </TouchableOpacity>
      </CardView>
      <TouchableOpacity
        style={{ marginBottom: 20, padding: 5 }}
        onPress={onPressNo}
      >
        <Text
          style={styles.noBtn}
        >
          No Thanks
        </Text>
      </TouchableOpacity>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
 cardStyles:{
    backgroundColor: "gray",
    justifyContent: "center",
    marginVertical: 15,
  },
  btnStyles:{
    padding: 15,
    width: width - 45,
    justifyContent: "center",
    borderRadius: 12,
    alignItems: "center",
  },
  btnTextStyles:{
    marginLeft: 7,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontFamily: strings.fontMedium,
    fontSize: 17,
  },
  noBtn:{
    fontFamily: strings.fontMedium,
    fontSize: 15,
    color: colors.PrimaryColor_one,
  }
});

export default PermissionsCard;

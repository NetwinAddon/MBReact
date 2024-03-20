import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
    Extrapolate,
    interpolate,
    interpolateColor,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    runOnJS,
} from 'react-native-reanimated';
import { useState } from 'react';
import { colors, strings } from '../App';


const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BUTTON_WIDTH = SCREEN_WIDTH - 50;
const BUTTON_HEIGHT = 54;
const BUTTON_PADDING = 5;
const SWIPEABLE_DIMENSIONS = 50;

const H_WAVE_RANGE = SWIPEABLE_DIMENSIONS + 2 * BUTTON_PADDING;
const H_SWIPE_RANGE = BUTTON_WIDTH - 2 * BUTTON_PADDING - SWIPEABLE_DIMENSIONS;


const SwipeButton = ({ onToggle, onPressNo, onPressAllow, btnColor }) => {
    const sharedValue = useSharedValue(0);
    const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
    const [toggled, setToggled] = useState(false);

    const handleComplete = (isToggled) => {
        if (isToggled !== toggled) {
            setToggled(isToggled);
            onPressAllow()
            console.log("Completed")
            setTimeout(() => {
                sharedValue.value = 0;
                setToggled(false);
            }, 1000);
        }
    };

    const animatedGestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            ctx.completed = toggled;
        },
        onActive: (e, ctx) => {
            let newValue;
            if (ctx.completed) {
                newValue = H_SWIPE_RANGE + e.translationX;
            } else {
                newValue = e.translationX;
            }

            if (newValue >= 0 && newValue <= H_SWIPE_RANGE) {
                sharedValue.value = newValue;
            }
        },
        onEnd: () => {
            if (
                sharedValue.value <
                BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS / 2 - 2 * BUTTON_PADDING
            ) {
                sharedValue.value = withSpring(0);
                runOnJS(handleComplete)(false);
            } else {
                sharedValue.value = withSpring(H_SWIPE_RANGE);
                runOnJS(handleComplete)(true);
            }
        },
    });
    const animatedStylesSwipe = useAnimatedStyle(() => ({
        transform: [{ translateX: sharedValue.value }],
        backgroundColor: interpolateColor(
            sharedValue.value,
            [0, H_SWIPE_RANGE],
            [btnColor, '#fff'],
        ),
    }));
    const InterpolateXInput = [0, H_SWIPE_RANGE];
    const animatedStylesText = useAnimatedStyle(() => ({
        opacity: interpolate(
            sharedValue.value,
            InterpolateXInput,
            [0.7, 0],
            Extrapolate.CLAMP,
        ),
        transform: [
            {
                translateX: interpolate(
                    sharedValue.value,
                    InterpolateXInput,
                    [0, BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS],
                    Extrapolate.CLAMP,
                ),
            },
        ],
    }));

    const colorWave = useAnimatedStyle(() => ({
        width: H_WAVE_RANGE + sharedValue.value,
        opacity: interpolate(sharedValue.value, InterpolateXInput, [0, 1]),
    }));
    return (
        <LinearGradient colors={['#F3F8FF', '#D9D9D9']} style={[styles.containerStyle, { borderColor: btnColor }]}>
            <AnimatedLinearGradient colors={[colors.themeColorOrange, colors.themeColorOrange]}
                style={[styles.background, colorWave]} />
            <PanGestureHandler enabled={onToggle} onGestureEvent={animatedGestureHandler}>
                <Animated.View style={[styles.swipeableCircle, animatedStylesSwipe]}>
                    <View style={styles.rupeImgView}>
                        <Image source={require('../assets/icons/rupe.png')} style={{height: 30, width:17, tintColor: toggled ? colors.themeColorOrange : 'white' }} tintColor={toggled ? colors.themeColorOrange : 'white' }  resizeMode='contain'/>
                    </View>
                </Animated.View>
            </PanGestureHandler>
            {/* <View style={[styles.swipeTextView,{ alignSelf: toggled ? 'center' : 'flex-end '}]}> */}
            {toggled ?
                <View style={[styles.swipeTextView,{alignSelf: 'flex-start', marginLeft:20}]}>
                    <Animated.Text style={[styles.swipeText, { color: 'white'}]}>
                        Submitting...
                    </Animated.Text>
                </View>
                :
                <View style={styles.swipeTextView}>
                    <Animated.Text style={[styles.swipeText, { color: btnColor }]}>
                        Swipe to confirm
                    </Animated.Text>
                    <View style={styles.arrowSwipeImg}>
                        <Image source={require('../assets/icons/arrow_swipe.png')} resizeMode='contain' style={{ width:27, tintColor: btnColor}} />
                    </View>
                </View>
            }
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    containerStyle: {
        height: BUTTON_HEIGHT,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        width: '87%',
        backgroundColor: 'white',
        borderWidth: 1

    },
    swipeableCircle: {
        height: SWIPEABLE_DIMENSIONS,
        width: SWIPEABLE_DIMENSIONS,
        borderRadius: 25,
        position: 'absolute',
        zIndex: 3,
        left: BUTTON_PADDING,
    },
    swipeText: {
        fontSize: 14,
        fontWeight: '500',
        zIndex: 2,
        alignSelf: 'center',
        fontFamily: strings.fontMedium,
    },
    background: {
        height: BUTTON_HEIGHT,
        borderRadius: BUTTON_HEIGHT,
        position: 'absolute',
        left: 0,
    },
    rupeImgView:
    {
        justifyContent: 'center',
        alignItems: 'center',
        flex:1
    },
    swipeTextView:
    {
        flexDirection: 'row',
        
    },
    arrowSwipeImg:
    {
       
        marginLeft:14
    }
});

export default SwipeButton;
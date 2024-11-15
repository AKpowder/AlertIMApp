import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming, useAnimatedReaction } from 'react-native-reanimated';

const LoadingLogo = () => {
    const animationTrigger = useSharedValue(0); // Value to trigger the animation loop
    const waterDropOpacity = useSharedValue(0);
    const waterDropPosition = useSharedValue(-50); // Starting above the final position
    const handOpacity = useSharedValue(0);
    const signalOpacity = useSharedValue(0);

    useAnimatedReaction(
        () => animationTrigger.value,
        (trigger) => {
            if (trigger > 0) {
                // Reset values
                waterDropOpacity.value = 0;
                waterDropPosition.value = -100;
                handOpacity.value = 0;
                signalOpacity.value = 0;

                // Start the sequence of animations
                waterDropOpacity.value = withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) });
                waterDropPosition.value = withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) }, () => {
                    handOpacity.value = withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }, () => {
                        signalOpacity.value = withTiming(1, { duration: 500, easing: Easing.inOut(Easing.ease) }, () => {
                            // Restart the animation sequence
                            animationTrigger.value += 1;
                        });
                    });
                });
            }
        }
    );

    useEffect(() => {
        animationTrigger.value = 1; // Start the animation sequence
    }, []);

    const waterDropStyle = useAnimatedStyle(() => {
        return {
            opacity: waterDropOpacity.value,
            transform: [{ translateY: waterDropPosition.value }],
        };
    });

    const handStyle = useAnimatedStyle(() => {
        return {
            opacity: handOpacity.value,
        };
    });

    const signalStyle = useAnimatedStyle(() => {
        return {
            opacity: signalOpacity.value,
        };
    });

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.imageContainer, waterDropStyle]}>
                <Image source={require('../assets/SVG/1x/WaterDrop.png')} style={styles.image} />
            </Animated.View>
            <Animated.View style={[styles.imageContainer, handStyle]}>
                <Image source={require('../assets/SVG/1x/Hand.png')} style={styles.image} />
            </Animated.View>
            <Animated.View style={[styles.imageContainer, signalStyle]}>
                <Image source={require('../assets/SVG/1x/Signal.png')} style={styles.image} />
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        position: 'absolute',
    },
    image: {
        width: 100, // Adjust the width to make the container bigger
        height: 100, // Adjust the height to make the container bigger
    },
});

export default LoadingLogo;

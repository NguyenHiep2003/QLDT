import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet, Text, Dimensions } from "react-native";

const ThumbsUpAnimation = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Tạo hiệu ứng phóng to thu nhỏ
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Tạo hiệu ứng xoay nhẹ
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scaleAnim, rotateAnim]);

  // Nội suy xoay
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "10deg"], // Độ nghiêng nhẹ
  });

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.handIcon,
          {
            transform: [
              { scale: scaleAnim },
              { rotate: rotateInterpolate },
            ],
          },
        ]}
      >
        👍
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  handIcon: {
    fontSize: Dimensions.get("window").width * 0.3,
    color: "#4267B2",
  },
});

export default ThumbsUpAnimation;

import React, { memo, useCallback } from "react";
import { useTabRoot } from "../TabRoot";
import { useTabView } from "../TabView";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { styles } from "../styles";
import { View, type ViewProps } from "react-native";

interface TabBarContainerProps extends ViewProps {}

export const TabBarContainer = memo(function TabBarContainer(
  props: TabBarContainerProps
) {
  const { animatedHeight } = useTabRoot();

  const { label, barHeight, emptyBarHeight, minBarTop } = useTabView();

  const tabBarStyle = useAnimatedStyle(() => {
    return {
      top: -Math.min(animatedHeight.value, minBarTop.value),
    };
  }, [label]);

  const emptyBarStyle = useAnimatedStyle(() => {
    return {
      height: emptyBarHeight.value,
    };
  }, [label]);

  const onLayout = useCallback(
    (e: any) => {
      barHeight.value = e.nativeEvent.layout.height;
      props?.onLayout?.(e);
    },
    [props?.onLayout]
  );

  return (
    <Animated.View style={[styles.bar, tabBarStyle]}>
      <Animated.View style={emptyBarStyle} />
      <View {...props} onLayout={onLayout} />
    </Animated.View>
  );
});

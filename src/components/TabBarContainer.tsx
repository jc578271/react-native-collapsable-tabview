import React, { memo, useCallback } from "react";
import { useTabRoot } from "../TabRoot";
import { useTabView } from "../TabView";
import Animated, {
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
} from "react-native-reanimated";
import { styles } from "../styles";
import { View, type ViewProps } from "react-native";

export interface TabBarContainerProps extends ViewProps {
  /* tag "worklet" before use */
  onCollapse?: (offset: number) => void;
  onBarHeight?: (height: number) => void;
}

export const TabBarContainer = memo(function TabBarContainer({
  onCollapse,
  onBarHeight,
  ...props
}: TabBarContainerProps) {
  const { animatedHeight } = useTabRoot();

  const { barHeight, emptyBarHeight, minBarTop, emptyHeaderHeight } =
    useTabView();

  const tabBarStyle = useAnimatedStyle(() => {
    const top = Math.min(animatedHeight.value, minBarTop.value);
    const isVisible = animatedHeight.value > minBarTop.value;
    const minTop = emptyHeaderHeight.value - emptyBarHeight.value;

    const collapseValue = interpolate(
      top,
      [minTop, minTop, minBarTop.value],
      [0, 0, 1]
    );

    /* on Collapse */
    onCollapse?.(collapseValue);

    return {
      opacity: isVisible ? 1 : 0,
    };
  }, [onCollapse]);

  const tabBarProps: any = useAnimatedProps(() => {
    const isVisible = animatedHeight.value > minBarTop.value;
    return {
      pointerEvents: isVisible ? "auto" : "none",
    };
  }, []);

  const emptyBarStyle = useAnimatedStyle(() => {
    return {
      height: emptyBarHeight.value,
    };
  }, []);

  const onLayout = useCallback(
    (e: any) => {
      barHeight.value = e.nativeEvent.layout.height;
      props?.onLayout?.(e);
      onBarHeight?.(e.nativeEvent.layout.height);
    },
    [props?.onLayout, onBarHeight]
  );

  return (
    <Animated.View
      animatedProps={tabBarProps}
      style={[styles.bar, tabBarStyle]}
    >
      <Animated.View style={emptyBarStyle} />
      <View {...props} onLayout={onLayout} />
    </Animated.View>
  );
});

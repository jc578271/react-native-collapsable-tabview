import React, { memo, useCallback } from "react";
import { useTabRoot } from "../TabRoot";
import { useTabView } from "../TabView";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
} from "react-native-reanimated";
import { styles } from "../styles";
import { View, type ViewProps } from "react-native";

export interface TabBarContainerProps extends ViewProps {
  onCollapse?: (value: number) => void;
}

export const TabBarContainer = memo(function TabBarContainer({
  onCollapse,
  ...props
}: TabBarContainerProps) {
  const { animatedHeight } = useTabRoot();

  const { label, barHeight, emptyBarHeight, minBarTop, emptyHeaderHeight } =
    useTabView();

  const onCollapseJS = useCallback(
    (value: number) => {
      onCollapse?.(value);
    },
    [onCollapse]
  );

  const tabBarStyle = useAnimatedStyle(() => {
    const top = Math.min(animatedHeight.value, minBarTop.value);

    const collapseValue = interpolate(
      top,
      [emptyHeaderHeight.value, emptyHeaderHeight.value, minBarTop.value],
      [0, 0, 1]
    );

    /* on Collapse */
    runOnJS(onCollapseJS)(collapseValue);

    return {
      top: -top,
    };
  }, [label, onCollapse]);

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

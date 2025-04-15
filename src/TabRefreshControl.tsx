import React, { memo } from "react";
import { RefreshControl, type RefreshControlProps } from "react-native";
import { useTabView } from "./TabView";
import Animated, { useAnimatedProps } from "react-native-reanimated";

const AnimatedRefreshControl = Animated.createAnimatedComponent(RefreshControl);

export const TabRefreshControl = memo(function TabRefreshControl(
  props: RefreshControlProps
) {
  const { emptyHeaderHeight } = useTabView();

  const animatedProps = useAnimatedProps(() => ({
    progressViewOffset: emptyHeaderHeight.value,
  }));

  return <AnimatedRefreshControl {...props} />;
});

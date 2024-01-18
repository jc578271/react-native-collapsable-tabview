import React, {
  memo,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
} from "react";
import { View } from "react-native";
import { styles } from "./styles";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useTabView } from "./TabView";
import { useTabRoot } from "./TabRoot";
import {
  TabBarContainer,
  type TabBarContainerProps,
} from "./components/TabBarContainer";

interface HeaderProps extends PropsWithChildren<any> {
  onHeaderHeight?: (height: number) => void;
  isStickyBar?: boolean;
}

export type TabHeaderProps = HeaderProps &
  TabBarContainerProps & {
    HeaderComponent?: ReactNode | undefined;
  };

export const TabHeader = memo(function TabHeader({
  HeaderComponent,
  onHeaderHeight,
  isStickyBar = true,
  ...rest
}: TabHeaderProps) {
  return (
    <>
      <AnimatedTabHeader onHeaderHeight={onHeaderHeight}>
        {HeaderComponent}
        <View {...rest} />
      </AnimatedTabHeader>
      {isStickyBar ? <TabBarContainer {...rest} /> : null}
    </>
  );
});

const AnimatedTabHeader = memo(function AnimatedTabHeader({
  children,
  onHeaderHeight,
}: HeaderProps) {
  const { animatedHeight } = useTabRoot();

  const { headerHeight, emptyHeaderHeight, minBarTop, barHeight } = useTabView();

  const emptyHeaderStyle = useAnimatedStyle(() => {
    return {
      height: emptyHeaderHeight.value,
    };
  }, []);

  const tabHeaderStyle = useAnimatedStyle(() => {
    return {
      top: Math.max(-animatedHeight.value, -minBarTop.value - barHeight.value)
    };
  }, []);

  const onHeaderLayout = useCallback(
    (e: any) => {
      headerHeight.value = e.nativeEvent.layout.height;
      onHeaderHeight?.(e.nativeEvent.layout.height);
    },
    [onHeaderHeight]
  );

  return (
    <Animated.View
      pointerEvents={"box-none"}
      style={[styles.header, tabHeaderStyle]}
    >
      <Animated.View pointerEvents={"box-none"} style={emptyHeaderStyle} />
      <Animated.View
        pointerEvents={"box-none"}
        style={{ overflow: "scroll" }}
        onLayout={onHeaderLayout}
      >
        {children}
      </Animated.View>
    </Animated.View>
  );
});

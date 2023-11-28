import React, {
  memo,
  type PropsWithChildren,
  type ReactNode,
  useCallback,
} from "react";
import { styles } from "./styles";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useTabView } from "./TabView";
import { useTabRoot } from "./TabRoot";
import { TabBarContainer } from "./components/TabBarContainer";
import type { ViewProps } from "react-native";

interface TabHeaderProps extends ViewProps {
  HeaderComponent?: ReactNode | undefined;
}

export const TabHeader = memo(function TabHeader({
  HeaderComponent,
  ...rest
}: TabHeaderProps) {
  return (
    <>
      <AnimatedTabHeader>{HeaderComponent}</AnimatedTabHeader>
      <TabBarContainer {...rest} />
    </>
  );
});

const AnimatedTabHeader = memo(function AnimatedTabHeader({
  children,
}: PropsWithChildren<{}>) {
  const { animatedHeight } = useTabRoot();

  const { headerHeight, emptyHeaderHeight } = useTabView();

  const emptyHeaderStyle = useAnimatedStyle(() => {
    return {
      height: emptyHeaderHeight.value,
    };
  }, []);

  const tabHeaderStyle = useAnimatedStyle(() => {
    return {
      top: -animatedHeight.value,
    };
  }, []);

  const onHeaderLayout = useCallback((e: any) => {
    headerHeight.value = e.nativeEvent.layout.height;
  }, []);

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

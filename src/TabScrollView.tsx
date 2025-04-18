import React, { forwardRef, memo } from "react";
import Animated, {
  type AnimateProps,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useTabView } from "./TabView";
import { useAutoScroll } from "./hooks/useAutoScroll";
import { View, type ScrollViewProps } from "react-native";
import type { IOnScroll, IScrollProps } from './types';

export type TabScrollViewProps = Omit<AnimateProps<ScrollViewProps>, "onScroll"> & IOnScroll & IScrollProps

const _TabScrollView = forwardRef<Animated.ScrollView, TabScrollViewProps>(
  function TabScrollView({ children, ...props }, ref) {
    const { emptyHeaderHeight, minBarTop } = useTabView();

    const animatedStyle = useAnimatedStyle(() => {
      return {
        height: emptyHeaderHeight.value,
      };
    }, []);

    const { onScroll, scrollViewRef, listHeight, onListLayout } = useAutoScroll(
      ref as any,
      props
    );

    const containerStyle = useAnimatedStyle(() => {
      const minHeight = listHeight.value + minBarTop.value
      return {
        minHeight: minHeight,
      };
    });

    return (
      <View style={{ flex: 1, overflow: "scroll" }} onLayout={onListLayout}>
        <Animated.ScrollView ref={scrollViewRef} {...props} onScroll={onScroll}>
          <Animated.View style={props.disabledMinHeight ? undefined : containerStyle}>
            {/* <Animated.View style={animatedStyle} /> */}
            {children as any}
          </Animated.View>
        </Animated.ScrollView>
      </View>
    );
  }
);

export const TabScrollView = memo(_TabScrollView);

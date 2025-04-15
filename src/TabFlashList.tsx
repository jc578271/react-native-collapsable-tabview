import React, { forwardRef, memo, useCallback, useMemo } from "react";
import RNFlashList, { type FlashListProps } from "./components/RNFlashList";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useTabView } from "./TabView";
import { useAutoScroll } from "./hooks/useAutoScroll";
import { View } from "react-native";
import { useTabRoot } from "./TabRoot";
import type { IOnScroll, IScrollProps } from "./types";

const AnimatedFlashList =
  Animated.createAnimatedComponent<FlashListProps<any>>(RNFlashList);

export type TabViewFlashListProps = Omit<FlashListProps<any>, "onScroll"> &
  IOnScroll &
  IScrollProps;

const TabViewFlashList = forwardRef<RNFlashList<any>, TabViewFlashListProps>(
  function TabViewFlashList(props, ref) {
    const { emptyHeaderHeight, minBarTop } = useTabView();
    const { velocity } = useTabRoot();

    const animatedStyle = useAnimatedStyle(() => {
      return {
        height: emptyHeaderHeight.value,
      };
    }, []);

    const { onScroll, scrollViewRef, listHeight, onListLayout } = useAutoScroll(
      ref as any,
      props
    );

    const paddingBottom = useMemo(() => {
      if (typeof props.contentContainerStyle?.paddingBottom === "number")
        return props.contentContainerStyle?.paddingBottom;

      if (typeof props.contentContainerStyle?.paddingHorizontal === "number")
        return props.contentContainerStyle?.paddingHorizontal;

      return 0;
    }, [
      props.contentContainerStyle?.paddingBottom,
      props.contentContainerStyle?.paddingHorizontal,
    ]);

    const footerHeight = useSharedValue(0);

    const containerStyle = useAnimatedStyle(() => {
      const minHeight =
        listHeight.value +
        minBarTop.value / velocity -
        paddingBottom -
        footerHeight.value - 16;
      return {
        minHeight: minHeight,
      };
    }, [paddingBottom]);

    return (
      <View style={{ flex: 1, overflow: "scroll" }} onLayout={onListLayout}>
        <AnimatedFlashList
          ref={scrollViewRef}
          {...props}
          onScroll={onScroll}
          // ListHeaderComponent={
          //   <>
          //     <Animated.View style={animatedStyle} />
          //     {props.ListHeaderComponent as any}
          //   </>
          // }
          // ListEmptyComponent={
          //   props.ListEmptyComponent ? (
          //     <EmptyView listHeight={listHeight}>
          //       {props.ListEmptyComponent}
          //     </EmptyView>
          //   ) : null
          // }
          // // ListFooterComponent={
          //   <View
          //     onLayout={useCallback((e: any) => {
          //       footerHeight.value = e.nativeEvent.layout.height;
          //     }, [])}
          //   >
          //     {props.ListFooterComponent as any}
          //   </View>
          // }
          // animatedContentContainerStyle={
          //   props.disabledMinHeight ? undefined : containerStyle
          // }
        />
      </View>
    );
  }
);

const EmptyView = memo(function EmptyView({
  children,
  listHeight,
}: {
  listHeight: SharedValue<number>;
  children: any;
}) {
  const { minBarTop, emptyHeaderHeight } = useTabView();
  const { velocity } = useTabRoot();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      top:
        -listHeight.value -
        minBarTop.value / velocity +
        emptyHeaderHeight.value,
    };
  }, [velocity]);

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          height: 0,
          overflow: "visible",
        },
      ]}
    >
      <View style={{ height: 1000, alignItems: "center" }}>{children}</View>
    </Animated.View>
  );
});

export const TabFlashList = memo(TabViewFlashList);

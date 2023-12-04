import React, { forwardRef, memo } from "react";
import RNFlashList, { type FlashListProps } from "./components/RNFlashList";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useTabView } from "./TabView";
import { useAutoScroll } from "./hooks/useAutoScroll";
import { View } from "react-native";

const AnimatedFlashList =
  Animated.createAnimatedComponent<FlashListProps<any>>(RNFlashList);

const TabViewFlashList = forwardRef<RNFlashList<any>, FlashListProps<any>>(
  function TabViewFlashList(props, ref) {
    const { emptyHeaderHeight, minBarTop } = useTabView();

    const animatedStyle = useAnimatedStyle(() => {
      return {
        height: emptyHeaderHeight.value,
      };
    }, []);

    const { onScroll, scrollViewRef, listHeight, onListLayout } = useAutoScroll(
      ref as any
    );

    const containerStyle = useAnimatedStyle(() => {
      const minHeight = listHeight.value + minBarTop.value;
      return {
        minHeight: minHeight,
      };
    });

    return (
      <View style={{ flex: 1, overflow: "scroll" }} onLayout={onListLayout}>
        <AnimatedFlashList
          ref={scrollViewRef}
          {...props}
          onScroll={onScroll}
          ListHeaderComponent={
            <>
              <Animated.View style={animatedStyle} />
              {props.ListHeaderComponent}
            </>
          }
          ListEmptyComponent={
            props.ListEmptyComponent ? (
              <EmptyView listHeight={listHeight}>
                {props.ListEmptyComponent}
              </EmptyView>
            ) : null
          }
          animatedContentContainerStyle={containerStyle}
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

  const animatedStyle = useAnimatedStyle(() => {
    return {
      top: -listHeight.value - minBarTop.value + emptyHeaderHeight.value,
    };
  }, []);

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

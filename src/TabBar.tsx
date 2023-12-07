import React, { memo, useMemo, useState } from "react";
import Animated, {
  interpolate,
  runOnJS,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import type { ViewStyle } from "react-native";
import { BarItem, type IRenderTabBarItem } from "./components/BarItem";
import type { IItemLayout } from "./types";
import { styles } from "./styles";
import { useWindow } from "./hooks/useWindow";
import { useTabView } from "./TabView";

export interface TabBarProps {
  display?: "sameTabsWidth" | "minWindowWidth" | "default";
  horizontalGap?: number;
  verticalGap?: number;
  underlineStyle?: ViewStyle;
  tabBarStyle?: ViewStyle;
  renderItem: (params: IRenderTabBarItem) => React.ReactElement | null;
  initialTabs?: string[];
}

export const TabBar = memo(function TabBar({
  display,
  horizontalGap,
  verticalGap,
  underlineStyle,
  tabBarStyle,
  renderItem,
  initialTabs,
}: TabBarProps) {
  const { tabs: aTabs, animatedIndex } = useTabView();

  /* set tabs from pager */
  const [tabs, setTabs] = useState(initialTabs || aTabs.value);
  useAnimatedReaction(
    () => aTabs.value,
    (aTabs) => {
      runOnJS(setTabs)(aTabs);
    },
    []
  );

  const barRef = useAnimatedRef<Animated.ScrollView>();
  const itemLayout = useSharedValue<{ [id: string]: IItemLayout }>({});
  const { width: windowWidth } = useWindow();
  const _gap = useMemo(() => horizontalGap || 0, [horizontalGap]);

  /* handle tab width */
  const inputRange = useDerivedValue(
    () => Object.keys(itemLayout.value).map((i) => parseInt(i)),
    [itemLayout]
  );

  const outputLeftRange = useDerivedValue(
    () => Object.values(itemLayout.value).map((i) => i.left + _gap),
    [itemLayout, _gap]
  );

  const outputWidthRange = useDerivedValue(
    () => Object.values(itemLayout.value).map((i) => i.width - 2 * _gap),
    [itemLayout, _gap]
  );

  const outputScrollRange = useDerivedValue(() => {
    return Object.values(itemLayout.value).map((item) => {
      return Math.max(item.left - (windowWidth.value - item.width) / 2, 0);
    });
  }, [itemLayout]);

  /* handle tab scroll */
  useAnimatedReaction(
    () => ({
      aIndex: animatedIndex.value,
      outputScrollRange: outputScrollRange.value,
    }),
    (cur) => {
      const { aIndex, outputScrollRange } = cur;
      if (inputRange.value.length > 1 && outputScrollRange.length > 1) {
        scrollTo(
          barRef,
          interpolate(aIndex, inputRange.value, outputScrollRange),
          0,
          false
        );
      }
    },
    []
  );

  const underlineStyles = useAnimatedStyle(() => {
    return {
      left:
        inputRange.value.length > 1 && outputLeftRange.value.length > 1
          ? interpolate(
              animatedIndex.value,
              inputRange.value,
              outputLeftRange.value
            )
          : 0,
      width:
        inputRange.value.length > 1 && outputWidthRange.value.length > 1
          ? interpolate(
              animatedIndex.value,
              inputRange.value,
              outputWidthRange.value
            )
          : 0,
    };
  }, [horizontalGap]);

  const animatedContainerStyle = useAnimatedStyle(
    () =>
      display === "minWindowWidth"
        ? {
            minWidth: windowWidth.value,
          }
        : {},
    [display]
  );

  const contentContainerStyle = useMemo(
    () => (display === "sameTabsWidth" ? { flex: 1 } : {}),
    [display]
  );

  return (
    <Animated.ScrollView
      showsHorizontalScrollIndicator={false}
      horizontal={true}
      contentContainerStyle={contentContainerStyle}
      ref={barRef as any}
    >
      <Animated.View
        style={[tabBarStyle, styles.contentStyle, animatedContainerStyle]}
      >
        {tabs.map((item, index) => (
          <BarItem
            key={index}
            index={index}
            title={item}
            renderItem={renderItem}
            itemLayout={itemLayout}
          />
        ))}
      </Animated.View>

      {verticalGap ? (
        <Animated.View
          style={[
            styles.underlineWithGap,
            {
              paddingVertical: verticalGap,
            },
            underlineStyles,
          ]}
        >
          <Animated.View
            style={[
              styles.defaultUnderlineWithGap,
              underlineStyle,
              { flex: 1 },
            ]}
          />
        </Animated.View>
      ) : (
        <Animated.View
          style={[styles.underline, underlineStyle, underlineStyles]}
        />
      )}
    </Animated.ScrollView>
  );
});

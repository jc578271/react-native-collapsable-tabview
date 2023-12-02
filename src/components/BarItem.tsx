import React, { memo, useCallback } from "react";
import {
  interpolate,
  runOnUI,
  type SharedValue,
  useDerivedValue,
} from "react-native-reanimated";
import {
  type LayoutChangeEvent,
  type TouchableOpacityProps,
} from "react-native";
import type { IItemLayout } from "../types";
import { useTabView } from "../TabView";
import { useWindow } from "../hooks/useWindow";
import { ROOT_ID } from "../constant";

export type IRenderTabBarItem = {
  item: string;
  index: number;
  active: Readonly<SharedValue<number>>;
  onPress: () => void;
  onLayout: (e: LayoutChangeEvent) => void;
};

export const BarItem = memo(function BarItem({
  title,
  index,
  itemLayout,
  renderItem,
  ...rest
}: {
  title: string;
  index: number;
  itemLayout: SharedValue<{ [id: string]: IItemLayout }>;
  renderItem: (params: IRenderTabBarItem) => React.ReactElement | null;
} & TouchableOpacityProps) {
  const { animatedIndex, tabViewId, pagerViewRef } = useTabView();
  const { width: windowWidth } = useWindow();

  /* onPress item */
  const onTabPress = useCallback(
    (index: number) => {
      if (tabViewId === ROOT_ID) {
        pagerViewRef.current?.setPage(index);
      } else {
        pagerViewRef.current?.scrollTo({
          x: index * windowWidth.value,
          animated: false,
        });
      }
    },
    [pagerViewRef.current]
  );

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      runOnUI((x: number, width: number) => {
        "worklet";
        itemLayout.value = {
          ...itemLayout.value,
          [index.toString()]: {
            left: x,
            width: width,
          },
        };
      })(e.nativeEvent.layout.x, e.nativeEvent.layout.width);
      rest.onLayout?.(e);
    },
    [rest.onLayout]
  );

  const active = useDerivedValue(() => {
    const offset = Math.abs(animatedIndex.value - index);
    if (offset > 1) return 0;
    return interpolate(offset, [1, 0], [0, 1]);
  }, [index]);

  const onPress = useCallback(() => {
    onTabPress(index);
  }, [index]);

  return renderItem({
    item: title,
    index,
    active,
    onPress,
    onLayout,
  });
});

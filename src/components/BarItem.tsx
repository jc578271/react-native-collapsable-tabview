import React, { memo, useCallback } from "react";
import Animated, { runOnUI, type SharedValue } from "react-native-reanimated";
import {
  type LayoutChangeEvent,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from "react-native";
import type { IItemLayout } from "../types";
import { styles } from "../styles";

const ATouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const BarItem = memo(function BarItem({
  title,
  index,
  itemLayout,
  ...rest
}: {
  title: string;
  index: number;
  itemLayout: SharedValue<{ [id: string]: IItemLayout }>;
} & TouchableOpacityProps) {
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

  return (
    <ATouchableOpacity
      {...rest}
      style={[rest.style, styles.barItem]}
      onLayout={onLayout}
    >
      <Text>{title}</Text>
    </ATouchableOpacity>
  );
});

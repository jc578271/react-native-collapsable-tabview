import React, {memo, useCallback} from 'react';
import Animated, {
  measure,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedRef,
} from 'react-native-reanimated';
import type { LayoutChangeEvent } from 'react-native';

export const AnimatedLayoutView = memo(function AnimatedLayoutView({
  value,
  deps = [],
}: {
  value: SharedValue<number>;
  deps?: any[];
}) {
  const ref = useAnimatedRef<Animated.View>();

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    // @ts-ignore
    e.currentTarget.measure((_, __, ___, ____, _____, py) => {
      value.value = py;
    });
  }, deps);

  useAnimatedReaction(
    () => measure(ref),
    measured => {
      if (measured?.pageY) value.value = measured.pageY;
    },
    deps,
  );

  return <Animated.View ref={ref} onLayout={onLayout} />;
});

import React, { memo, useCallback, useEffect, useMemo } from 'react';
import Animated, {
  interpolate,
  runOnUI,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  useWorkletCallback,
} from 'react-native-reanimated';
import { type LayoutChangeEvent, View } from 'react-native';
import { BarItem } from './components/BarItem';
import type { IItemLayout } from './types';
import { styles } from './styles';
import { useWindow } from './hooks/useWindow';
import { useTabView } from './TabView';
import { useProvider } from './TabProvider';
import { useHeader } from './HeaderView';

interface Props {
  tabs: string[];
  isSameWidth?: boolean;
  gap?: number;
}

export const Bar = memo(function TabBar({ tabs, isSameWidth, gap }: Props) {
  const { tabs: aTabs, animatedIndex, pagerViewRef } = useTabView();
  const { headerId } = useHeader();
  const { barHeightMap } = useProvider();

  /* set tabs with provider tabs */
  useEffect(() => {
    aTabs.value = tabs;
  }, [tabs]);

  const _ref = useAnimatedRef<Animated.ScrollView>();
  const itemLayout = useSharedValue<{ [id: string]: IItemLayout }>({});
  const { width: windowWidth } = useWindow();
  const tabLength = useMemo(() => tabs.length, [tabs.length]);
  const _gap = useMemo(() => gap || 0, [gap]);
  const tabWidth = isSameWidth
    ? useDerivedValue(() => windowWidth.value / tabLength, [tabLength])
    : undefined;

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
      _aIndex: animatedIndex.value,
      _outputScrollRange: outputScrollRange.value,
    }),
    (cur) => {
      const { _aIndex, _outputScrollRange } = cur;
      scrollTo(
        _ref,
        inputRange.value.length
          ? interpolate(_aIndex, inputRange.value, _outputScrollRange)
          : 0,
        0,
        false
      );
    },
    []
  );

  const underlineStyles = useAnimatedStyle(() => {
    return {
      left:
        inputRange.value.length > 1
          ? interpolate(
              animatedIndex.value,
              inputRange.value,
              outputLeftRange.value
            )
          : 0,
      width:
        inputRange.value.length > 1
          ? interpolate(
              animatedIndex.value,
              inputRange.value,
              outputWidthRange.value
            )
          : 0,
    };
  }, []);

  /* onPress item */
  const onTabPress = useWorkletCallback(
    (index: number) => () => {
      pagerViewRef.current?.setPage(index);
    },
    [pagerViewRef.current]
  );

  const tabBarLayout = useCallback(
    (e: LayoutChangeEvent) => {
      runOnUI((height: number) => {
        'worklet';
        const barHeight = barHeightMap.value[headerId] || 0;

        if (Math.abs(barHeight - height) > 1) {
          barHeightMap.value = {
            ...barHeightMap.value,
            [headerId]: height,
          };
        }
      })(e.nativeEvent.layout.height);
    },
    [headerId]
  );

  return (
    <Animated.ScrollView
      onLayout={tabBarLayout}
      showsHorizontalScrollIndicator={false}
      horizontal={true}
      ref={_ref as any}
    >
      <View style={styles.contentStyle}>
        {tabs.map((item, index) => (
          <BarItem
            index={index}
            title={item}
            itemLayout={itemLayout}
            onPress={onTabPress(index)}
            tabWidth={tabWidth}
          />
        ))}
      </View>
      <Animated.View style={[styles.underline, underlineStyles]} />
    </Animated.ScrollView>
  );
});

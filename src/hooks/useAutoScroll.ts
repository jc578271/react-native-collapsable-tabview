import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import {useTabRoot} from '../TabRoot';
import {useTabView} from '../TabView';
import { type RefObject, useCallback, useRef} from 'react';
import {FlashList} from '@shopify/flash-list';
import {interactManager} from '../utils/interactManager';
import type { LayoutChangeEvent } from 'react-native';

export const useAutoScroll = (
  ref: RefObject<Animated.ScrollView & FlashList<any>>,
) => {
  const {animatedScrollValue} = useTabRoot();
  const {minBarTop, rootIndex, rootAnimatedIndex, label} = useTabView();
  const scrollViewRef =
    ref || useRef<Animated.ScrollView & FlashList<any>>(null);

  const timeout = useRef<any>(null);
  const currentScrollValue = useSharedValue(0);

  /* scroll handler */
  const onScroll = useAnimatedScrollHandler(
    {
      onScroll: e => {
        currentScrollValue.value = e.contentOffset.y;

        /* only set animatedScrollValue when current index */
        if (rootIndex.value === rootAnimatedIndex.value) {
          animatedScrollValue.value = e.contentOffset.y;
        }
      },
    },
    [label],
  );

  /* auto scroll for other items */
  const autoScroll = useCallback(
    (value: number) => {
      interactManager(
        () => {
          scrollViewRef.current?.scrollToOffset?.({
            offset: value,
            animated: false,
          });
          scrollViewRef.current?.scrollTo?.({y: value, animated: false});
        },
        100,
        timeout,
      );
    },
    [scrollViewRef, label],
  );

  /* get animated height from top of scroll view to top of tab view */
  const animatedHeight = useDerivedValue(() => {
    return Math.max(Math.min(animatedScrollValue.value, minBarTop.value), 0);
  }, []);

  /* handle auto scroll */
  useAnimatedReaction(
    () => animatedScrollValue.value,
    (animatedScrollValue) => {
      /* scroll other scrollView when value is changed */
      if (rootIndex.value !== rootAnimatedIndex.value) {
        if (
          animatedHeight.value >= currentScrollValue.value ||
          currentScrollValue.value <= minBarTop.value ||
          currentScrollValue.value === 0
        ) {
          runOnJS(autoScroll)(Math.min(animatedScrollValue, minBarTop.value));
        } else {
          runOnJS(autoScroll)(
            currentScrollValue.value + animatedHeight.value - minBarTop.value,
          );
        }
      }
    },
    [],
  );

  /* onListLayout */
  const listHeight = useSharedValue(0);

  const onListLayout = useCallback((e: LayoutChangeEvent) => {
    listHeight.value = e.nativeEvent.layout.height;
  }, []);

  return {
    onScroll,
    scrollViewRef,
    listHeight,
    onListLayout
  };
};

import Animated, {
  runOnJS,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { useTabRoot } from "../TabRoot";
import { useTabView } from "../TabView";
import { type RefObject, useCallback, useRef } from "react";
import { FlashList } from "@shopify/flash-list";
import { interactManager } from "../utils/interactManager";
import type { LayoutChangeEvent } from "react-native";
import { reanimatedSpring } from "../utils/reanimatedSpring";
import type { IOnScroll } from "../types";

interface IUseAutoScroll {
  onScroll: (e: any) => void;
  scrollViewRef: RefObject<Animated.ScrollView & FlashList<any>>;
  listHeight: SharedValue<number>;
  onListLayout: (e: LayoutChangeEvent) => void;
}

export function useAutoScroll(
  ref: RefObject<Animated.ScrollView & FlashList<any>>,
  {
    onScroll: pOnScroll,
    onAnimatedMomentumBegin,
    onAnimatedMomentumEnd,
    onAnimatedEndDrag,
    onAnimatedBeginDrag,
  }: IOnScroll
): IUseAutoScroll {
  const { animatedScrollValue, animatedHeight, velocity } = useTabRoot();
  const { minBarTop, rootIndex, rootAnimatedIndex } = useTabView();
  const scrollViewRef =
    ref || useRef<Animated.ScrollView & FlashList<any>>(null);

  const timeout = useRef<any>(null);
  const currentScrollValue = useSharedValue(0);
  const isRunning = useSharedValue(0);

  /* scroll handler */
  const onScroll = useAnimatedScrollHandler(
    {
      onScroll: (e) => {
        pOnScroll?.(e);
        /* only set animatedScrollValue when current index */
        if (rootIndex.value === rootAnimatedIndex.value) {
          animatedScrollValue.value = e.contentOffset.y * velocity;
          currentScrollValue.value = e.contentOffset.y * velocity;

          /* animatedHeight */
          if (isRunning.value !== 0) return;
          const val = Math.max(e.contentOffset.y * velocity, 0);

          if (Math.abs(val - animatedHeight.value) > 30) {
            animatedHeight.value = reanimatedSpring(val);
            isRunning.value = 1;
            isRunning.value = reanimatedSpring(0);
            return;
          }

          animatedHeight.value = val;
        }
      },
      onBeginDrag: onAnimatedBeginDrag,
      onEndDrag: onAnimatedEndDrag,
      onMomentumBegin: onAnimatedMomentumBegin,
      onMomentumEnd: onAnimatedMomentumEnd,
    },
    [
      velocity,
      pOnScroll,
      onAnimatedBeginDrag,
      onAnimatedEndDrag,
      onAnimatedMomentumBegin,
      onAnimatedMomentumEnd,
    ]
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
          scrollViewRef.current?.scrollTo?.({ y: value, animated: false });
        },
        100,
        timeout
      );
    },
    [scrollViewRef]
  );

  /* get animated height from top of scroll view to top of tab view */
  const _animatedHeight = useDerivedValue(() => {
    return Math.max(Math.min(animatedScrollValue.value, minBarTop.value), 0);
  }, []);

  /* handle auto scroll */
  useAnimatedReaction(
    () => animatedScrollValue.value,
    (animatedScrollValue) => {
      /* scroll other scrollView when value is changed */
      if (rootIndex.value !== rootAnimatedIndex.value) {
        if (
          _animatedHeight.value >= currentScrollValue.value ||
          currentScrollValue.value <= minBarTop.value ||
          currentScrollValue.value === 0
        ) {
          runOnJS(autoScroll)(Math.min(animatedScrollValue, minBarTop.value));
        } else {
          runOnJS(autoScroll)(
            currentScrollValue.value + _animatedHeight.value - minBarTop.value
          );
        }
      }
    },
    []
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
    onListLayout,
  };
}

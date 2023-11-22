import React, { forwardRef, memo } from 'react';
import RNFlashList, { type FlashListProps } from './components/RNFlashList';
import Animated from 'react-native-reanimated';

const AnimatedFlashList =
  Animated.createAnimatedComponent<FlashListProps<any>>(RNFlashList);

const TabViewFlashList = forwardRef<RNFlashList<any>, FlashListProps<any>>(
  function TabViewFlashList(props, ref) {
    return (
      <AnimatedFlashList
        ref={ref}
        {...props}
        animatedContentContainerStyle={{}}
      />
    );
  }
);

export const FlashList = memo(TabViewFlashList);

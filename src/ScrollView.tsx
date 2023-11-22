import React, { memo } from 'react';
import { ScrollView as RNScrollView, type ScrollViewProps } from 'react-native';

export const ScrollView = memo(function TabViewScrollView(props: ScrollViewProps) {
  return <RNScrollView {...props}/>
})

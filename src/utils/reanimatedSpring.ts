import { withSpring } from 'react-native-reanimated';

export const reanimatedSpring = (value: number) => {
  "worklet";
  return withSpring(value, {
    damping: 200,
    mass: 1,
    stiffness: 300,
    overshootClamping: true,
    restSpeedThreshold: 100,
    restDisplacementThreshold: 0.5,
  });
};

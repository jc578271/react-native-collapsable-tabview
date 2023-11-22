import React, {
  createContext,
  memo,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { type LayoutChangeEvent, View } from 'react-native';
import { styles } from './styles';
import { useProvider } from './TabProvider';
import { runOnUI } from 'react-native-reanimated';
import { nanoid } from 'nanoid';
import { useTabView } from './TabView';
import { ROOT_ID } from './constant';

export const HeaderView = memo(function TabViewHeader({
  children,
}: PropsWithChildren<{}>) {
  const { label } = useTabView();
  const { headerHeightMap } = useProvider();

  const id = useMemo(() => (label === ROOT_ID ? ROOT_ID : nanoid(3)), [label]);

  const headerLayout = useCallback(
    (e: LayoutChangeEvent) => {
      runOnUI((height: number) => {
        'worklet';
        const headerHeight = headerHeightMap.value[id] || 0;

        if (Math.abs(headerHeight - height) > 1) {
          headerHeightMap.value = {
            ...headerHeightMap.value,
            [id]: height,
          };
        }
      })(e.nativeEvent.layout.height);
    },
    [id]
  );

  return (
    <Context.Provider value={{ headerId: id }}>
      <View pointerEvents={'box-none'} style={styles.header}>
        <View
          pointerEvents={'box-none'}
          style={{ overflow: 'scroll' }}
          onLayout={headerLayout}
        >
          {children}
        </View>
      </View>
    </Context.Provider>
  );
});

interface IHeader {
  headerId: string;
}

const Context = createContext<IHeader | null>(null);

export const useHeader = () => {
  let value = useContext(Context);
  if (value === null) throw new Error('wrap HeaderView before using');
  return value;
};

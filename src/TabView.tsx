import React, {
  createContext,
  memo,
  type PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import type { ITabView, TabViewProps } from './types';
import { useProvider } from './TabProvider';
import { _useTabView } from './hooks/_useTabView';

const Context = createContext<ITabView | null>(null);

export const TabView = memo(function TabViewProvider({
  children,
  ...props
}: PropsWithChildren<TabViewProps>) {
  const value = _useTabView();

  const returnValue = useMemo(
    () => ({
      ...value,
      ...props,
    }),
    [value, props]
  );

  return <Context.Provider value={returnValue}>{children}</Context.Provider>;
});

export const useTabView = () => {
  let value = useContext<ITabView | null>(Context);
  if (value === null) value = useProvider();
  if (value === null) throw new Error('wrap TabView before using');
  return value;
};

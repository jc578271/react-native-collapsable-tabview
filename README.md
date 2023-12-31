# react-native-collapsable-tabview

This is collapsable tabview package

## Installation

#### Dependencies
```sh
yarn add react-native-reanimated react-native-pager-view @shopify/flash-list
```

```sh
yarn add react-native-collapsable-tabview
```

## Basic Usage

```js
import {
  TabRoot,
  TabHeader,
  TabBar,
  TabPager,
  TabView,
  TabFlashList,
  TabScrollView,
  useTabView,
  IRenderTabBarItem,
} from 'react-native-collapsable-tabview';

const TabItem = memo(function TabItem({ item, ...props }: IRenderTabBarItem) {
  return (
    <TouchableOpacity {...props}>
      <Text>{item}</Text>
    </TouchableOpacity>
  );
});

const renderTabItem = (props: IRenderTabBarItem) => {
  return <TabItem {...props} />;
};

export default function App() {
  return (
    <TabRoot>
      <TabHeader>
        <TabBar renderItem={renderTabItem}/>
      </TabHeader>
      <TabPager>
        <TabView label={'Hello'}>
          <TabScrollView>
            <YourScrollView/>
          </TabScrollView>
        </TabView>
        <TabView label={'Hi'}>
          <TabFlashList
            renderItem={_ => <Text>Item</Text>}
            data={[1, 2]}
          />
        </TabView>
      </TabPager>
    </TabRoot>
  )
}
```
## Multiple Tab Bar Usage
```js
<TabRoot>
  <TabHeader>
    <TabBar renderItem={renderTabItem} />
  </TabHeader>
  <TabPager>
    <TabView label={'Hello'}>
      <TabHeader>
        <TabBar renderItem={renderTabItem} />
      </TabHeader>
      <TabPager>
        <TabView label={'Item 1'}>
          <TabScrollView>
            <YourScrollView/>
          </TabScrollView>
        </TabView>
        <TabView label={'Item 2'}>
          <TabScrollView>
            <YourScrollView/>
          </TabScrollView>
        </TabView>
      </TabPager>
    </TabView>
    <TabView label={'Hi'}>
      <TabFlashList
        renderItem={_ => <Text>Item</Text>}
        data={[1, 2]}
      />
    </TabView>
  </TabPager>
</TabRoot>
```


## API

### TabHeader
#### Props
Name            | Type                    | Required | Description                                             |
--------------- |-------------------------|----------|---------------------------------------------------------|
HeaderComponent | Element                 | No       | render Header Element                                   |
onCollapse      | (value: number) => void | No       | listen header collapse  event. tag "worklet" before use |
onHeaderHeight      | (height: number) => void | No       | listen header height  event                             |
onBarHeight      | (height: number) => void | No       | listen bar height  event                                |
...ViewProps    |                         | No       | extends view props                                      |

### TabBar
```ts
type IRenderTabBarItem = {
  item: string;
  index: number;
  active: Readonly<SharedValue<number>>;
  onPress: () => void;
  onLayout: (e: LayoutChangeEvent) => void;
};
```
#### Props
Name            | Type                                          | Required | Description            |
--------------- |-----------------------------------------------|-----|------------------------|
renderItem      | (params: IRenderTabBarItem ) => ReactElement     | Yes             | render tab bar item    |
display         | 'sameTabsWidth', 'minWindowWidth' , 'default' | No  | display Tab Bar        |
horizontalGap   | number                                        | No  | horizontal gap of tabs |
verticalGap     | number                                        | No  | vertical gap of tabs   |
underlineStyle  | ViewStyle                                     | No  | style of underline     |
tabBarStyle     | ViewStyle                                     | No  | style of tab bar       |

### TabPager
#### Methods
Name            | Type                      | Description |
--------------- |---------------------------|-------------|
goToPage         | (index: number) => void  | go to page  |

#### Props
Name                  | Type                            | Required | Description        |
--------------------- |---------------------------------|----------|--------------------|
initialPage           | number, SharedValue\<number\>   | No       | set initial page   |
scrollEnabled         | boolean, SharedValue\<boolean\> | No       | set scroll enabled |
overScrollMode        | "auto", "always", "never"       | No       |                    |
keyboardDismissMode   | "none", "on-drag"               | No       |                    |
onPageChanged         | (index: number) => void         | No       | listen tab changed |

### TabView
#### Props
Name            | Type   | Required | Description       |
--------------- |--------|----------|-------------------|
label   | string | Yes      | label of tab item |


### TabScrollView
#### Props
Name            | Type   | Required | Description         |
--------------- |--------|----------|---------------------|
...ScrollViewProps   |  | no        | props of ScrollView |

### TabFlashList
#### Props
Name            | Type   | Required | Description         |
--------------- |--------|----------|---------------------|
...FlashListProps   |  | no        | props of FlashList |

### TabRefreshControl
#### Props
Name            | Type   | Required | Description         |
--------------- |--------|----------|---------------------|
...RefreshControlProps   |  | no        | props of RefreshControl |

### Hooks
#### useTabView
```js
// wrap <TabView> brefore use this hook
const { status, topScrollPosition } = useTabView();

useAnimatedReaction(
  () => status.value,
  (status) => {
    console.log(status);
  },
  []
);
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

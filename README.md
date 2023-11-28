# react-native-collapsable-tabview

This is collapsable tabview package

## Installation

```sh
npm install react-native-collapsable-tabview
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
  useTabView
} from 'react-native-collapsable-tabview';

export default function App() {
  return (
    <TabRoot>
      <TabHeader>
        <TabBar display={'sameTabsWidth'}/>
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
## API

### TabRoot
#### Methods

### TabHeader
#### Props
Name            | Type     | Required | Description           |
--------------- |----------|----------|-----------------------|
HeaderComponent | Element  | No       | render Header Element |
...ViewProps    |          | No       | extends view props    |

### TabBar
#### Props
Name            | Type                                          | Required | Description            |
--------------- |-----------------------------------------------|----------|------------------------|
display         | 'sameTabsWidth', 'minWindowWidth' , 'default' | No       | display Tab Bar        |
horizontalGap   | number                                        | No       | horizontal gap of tabs |
verticalGap     | number                                        | No       | vertical gap of tabs   |
underlineStyle  | ViewStyle                                     | No       | style of underline     |
tabBarStyle     | ViewStyle                                     | No       | style of tab bar       |

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

import * as React from 'react';

import { StyleSheet, Text, View } from 'react-native';
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
import { memo } from 'react';

export default function App() {
  return (
    <View style={styles.container}>
      <TabRoot>
        <TabHeader
          HeaderComponent={
            <View style={{height: 50, backgroundColor: 'blue'}} />
          }
          style={{flexDirection: 'row', backgroundColor: 'cyan'}}>
          <Text>OKOK</Text>
          <TabBar display={'sameTabsWidth'} />
        </TabHeader>

        <TabPager>
          {/*    /!*---------------------------*!/*/}
          <TabView label={'Hellofefefef'}>
            <TabHeader HeaderComponent={<YourCustomView />}>
              <TabBar />
            </TabHeader>

            <TabPager>
              <TabView label={'Item1'}>
                <TabScrollView>
                  <YourScrollView text={'Your scrollView 1'} />
                </TabScrollView>
              </TabView>
              <TabView label={'Item2'}>
                <TabScrollView>
                  <YourScrollView text={'Your scrollView 2'} />
                </TabScrollView>
              </TabView>
            </TabPager>
          </TabView>
          {/*    /!*---------------------------*!/*/}
          <TabView label={'Hi'}>
            <TabHeader
              HeaderComponent={<YourCustomView height={70} color={'green'} />}>
              <TabBar />
            </TabHeader>
            <TabPager>
              <TabView label={'Item3'}>
                <TabHeader
                  HeaderComponent={
                    <YourCustomView height={100} color={'red'} />
                  }>
                  <TabBar />
                </TabHeader>

                <TabPager>
                  <TabView label={'Item5'}>
                    <MyTabView />
                  </TabView>
                  <TabView label={'Item6'}>
                    <TabFlashList
                      renderItem={_ => <Text>Item</Text>}
                      data={[1, 2]}
                    />
                  </TabView>
                  <TabView label={'Item7'}>
                    <TabFlashList
                      renderItem={_ => <Text>Item</Text>}
                      data={[1, 2]}
                    />
                  </TabView>
                </TabPager>
              </TabView>
              <TabView label={'Item4'}>
                <TabFlashList
                  renderItem={_ => <Text>Item</Text>}
                  data={[1, 2]}
                />
              </TabView>
            </TabPager>
          </TabView>
          {/*    /!*---------------------------*!/*/}
          <TabView label={'HoHo'}>
            <TabFlashList
              ListEmptyComponent={
                <View
                  style={{backgroundColor: 'red', height: 100, width: 100}}
                />
              }
              renderItem={_ => <Text>Item</Text>}
              data={[]}
            />
          </TabView>
        </TabPager>
      </TabRoot>
    </View>
  );
}

const YourCustomView = memo(function YourCustomView({
                                                      height,
                                                      color,
                                                    }: {
  height?: number;
  color?: string;
}) {
  return (
    <View
      style={{
        height: height || 200,
        justifyContent: 'space-between',
        backgroundColor: color || 'yellow',
      }}>
      <Text>Your Custom Header</Text>
      <Text>Your Custom Header</Text>
    </View>
  );
});

const YourScrollView = memo(function YourScrollView({text}: {text: string}) {
  return (
    <View
      style={
        {
          // top: 300,
        }
      }>
      <View>
        <Text>{text}</Text>
      </View>
    </View>
  );
});

const MyTabView = memo(function MyTabView() {
  const {mounted} = useTabView();

  console.log(mounted);

  return (
    <TabFlashList
      ListEmptyComponent={
        <View
          style={{backgroundColor: 'red', height: 100, width: 100, top: 30}}
        />
      }
      renderItem={_ => <Text>ItemHI</Text>}
      data={[]}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});

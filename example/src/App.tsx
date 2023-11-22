import * as React from 'react';

import { StyleSheet, Text, View } from 'react-native';
import {
  Bar,
  PagerView,
  HeaderView,
  TabView,
  ScrollView,
  FlashList,
  TabProvider,
} from 'react-native-collapsable-tabview';
import { memo } from 'react';

export default function App() {
  return (
    <View style={styles.container}>
      <TabProvider>
          <HeaderView>
            <Bar tabs={['Hello', 'Hi']} />
            <YourCustomView />
          </HeaderView>

          <PagerView>
            {/*---------------------------*/}
            <TabView label={'Hello'}>
              <HeaderView>
                <YourCustomView />
                <Bar tabs={['Item1', 'Item2']} />
              </HeaderView>

              <PagerView>
                <TabView label={'Item1'}>
                  <ScrollView />
                </TabView>
                <TabView label={'Item2'}>
                  <ScrollView />
                </TabView>
              </PagerView>
            </TabView>
            {/*---------------------------*/}
            <TabView label={'Hi'}>
              <FlashList renderItem={(_) => null} data={[]} />
            </TabView>
            {/*---------------------------*/}
          </PagerView>
      </TabProvider>
    </View>
  );
}

const YourCustomView = memo(function YourCustomView() {
  return (
    <View>
      <Text>Your Custom View</Text>
    </View>
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

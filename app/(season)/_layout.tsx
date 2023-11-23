import { StyleSheet, useColorScheme } from 'react-native';
import { Tabs } from 'expo-router/tabs';
import { Icon } from 'react-native-paper';
import Colors from '../../constants/Colors';


export default function Season() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getConfig = (title: string, icon: string) => ({
    tabBarLabel: title,
    tabBarIcon: ({focused, size}: { focused: boolean, size: number }) => (
      <Icon
        color={focused ? colors.primary : colors.text} 
        source={icon}
        size={size} />
    ),
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.text,
  } as any);

  return (
    <Tabs screenOptions={{
      headerTitle: 'Season Name'
    }}>
      <Tabs.Screen name="leaderboard" options={getConfig('GC', 'flag-checkered')} />
      <Tabs.Screen name="riders" options={getConfig('My Team', 'bike')} />
      <Tabs.Screen name="stats" options={getConfig('Results', 'chart-bar')} />
    </Tabs>
  );
}

const styles = StyleSheet.create({})
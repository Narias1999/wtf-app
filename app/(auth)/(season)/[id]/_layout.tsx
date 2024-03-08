import { StyleSheet, useColorScheme } from 'react-native';
import { Tabs } from 'expo-router/tabs';
import { Icon } from 'react-native-paper';
import Colors from '../../../../constants/Colors';
import { useRoute } from '@react-navigation/native';
import { useGetRoomByIdQuery, Room } from '../../../../api/rooms';
import { createContext } from 'react';
interface ISeasonContext {
  season: Room | undefined;
  isLoading: boolean;
};

export const SeasonContext = createContext({
  season: undefined,
  isLoading: true,
} as ISeasonContext);

export default function Season() {
  const colorScheme = useColorScheme();
  const route = useRoute();
  const { data: season, isLoading } = useGetRoomByIdQuery(route.params?.id as number);
  const colors = Colors[colorScheme ?? 'light'];

  const getConfig = (title: string, icon: string) => ({
    tabBarLabel: title,
    tabBarIcon: ({ focused, size }: { focused: boolean; size: number }) => (
      <Icon color={focused ? colors.primary : colors.text} source={icon} size={size} />
    ),
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.text,
  } as any);

  return (
    <SeasonContext.Provider value={{
      season: season,
      isLoading
    }}>
      <Tabs screenOptions={{
        headerTitle: season?.name,
      }}>
        <Tabs.Screen name="leaderboard" options={getConfig('GC', 'flag-checkered')} />
        <Tabs.Screen name="riders" options={getConfig('My Team', 'bike')} />
        <Tabs.Screen name="stats" options={getConfig('Results', 'chart-bar')} />
      </Tabs>
    </SeasonContext.Provider>
  );
}

const styles = StyleSheet.create({})
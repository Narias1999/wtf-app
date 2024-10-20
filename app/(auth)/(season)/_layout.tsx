import { useColorScheme } from 'react-native';
import { Tabs } from 'expo-router/tabs';
import { Icon } from 'react-native-paper';
import Colors from '../../../constants/Colors';
import { useRoute } from '@react-navigation/native';
import { useGetRoomByIdQuery, Room } from '../../../api/rooms';
import { createContext, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TeamResult, useGetTeamResultMutation } from '../../../api/results';
interface ISeasonContext {
  season: Room | undefined;
  isLoading: boolean;
};

export const SeasonContext = createContext({
  season: undefined,
  isLoading: true,
} as ISeasonContext);

export default function Season() {
  const navigation = useNavigation();

  const colorScheme = useColorScheme();
  const route = useRoute();
  const [teamsResult, setTeamResult] = useState<TeamResult[] | undefined>()
  const [ getTeamResult ] = useGetTeamResultMutation()
  const { data: season, isLoading } = useGetRoomByIdQuery(route.params?.id as number);
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    navigation.setOptions({ tabBarStyle: { display: 'none' } });
  }, [navigation]);

  const getTeamsResult = async () => {
    const promises = season?.teams.map(team => getTeamResult(team.id))
    const result = await Promise.all(promises ?? [])
    setTeamResult(result.map(result => result.data))
  }

  useFocusEffect(() => {
    AsyncStorage.setItem('activeSeason', route.params?.id as string);
  });

  useEffect(()=> {
    if(!season || isLoading) return
    getTeamsResult()
  }, [season])

  const getConfig = (title: string, icon: string) => ({
    tabBarLabel: title,
    tabBarIcon: ({ focused, size }: { focused: boolean; size: number }) => (
      <Icon color={focused ? colors.primary : colors.text} source={icon} size={size} />
    ),
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.text,
  } as any);

  const seasonData = season && teamsResult ? {
    ...season,
    teams: season?.teams?.map((seasonTeam, idx) => ({
      ...seasonTeam,
      ...teamsResult?.[idx],
    })) ?? []
  } : undefined;

  return (
    <SeasonContext.Provider value={{
      season: seasonData,
      isLoading
    }}>
      <Tabs screenOptions={{
        headerTitle: season?.name,
        headerShown: !!season?.name,
      }}>
        <Tabs.Screen name="[id]/leaderboard" options={getConfig('GC', 'flag-checkered')} />
        <Tabs.Screen name="[id]/riders" options={getConfig('My Team', 'bike')} />
        <Tabs.Screen name="[id]/stats" options={getConfig('Results', 'chart-bar')} />
      </Tabs>
    </SeasonContext.Provider>
  );
}


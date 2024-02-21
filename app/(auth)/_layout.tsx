import { StyleSheet, useColorScheme} from 'react-native'
import { Redirect, Stack, Tabs, router } from 'expo-router'
import { Icon } from 'react-native-paper';
import { IconButton, Text, useTheme, List } from 'react-native-paper'
import { useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';

import { selectUser } from '../../store/features/auth';
import { useGetMyInvitationsQuery } from '../../api/invitations';
import Colors from '../../constants/Colors';
import { View } from '../../components/Themed';

export default function Layout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const theme = useTheme();
  const route = useRoute()
  const user = useSelector(selectUser);
  const { data: invitations, refetch, isLoading } = useGetMyInvitationsQuery('', {
    pollingInterval: 10000
  });
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

  if (!user) {
    return <Redirect href="/login" />
  }

  const colorStyle = { color: theme.colors.inversePrimary };

  const headerOptions = {
    headerShown: true,
    headerStyle: {
      backgroundColor: theme.colors.primary,
    },
    headerShadowVisible: false,
    headerBackTitleVisible: false,
    headerRight: () => (
      <View
        style={styles.notificationsContainer}
      >
        <IconButton
          icon="bell"
          iconColor={theme.colors.inversePrimary}
          size={20}
          onPress={() => router.push('/invitations')}
        />
        {!!invitations?.data?.length && <Text variant="labelSmall" style={styles.notificationsCount}>{invitations.data.length}</Text>}
      </View>
    ),
    headerTitle: () => <Text variant="titleMedium" style={colorStyle}>WTF</Text>,
  }

  if(route.params?.screen === '(season)/[id]') {
    return <Stack screenOptions={headerOptions}>
      <Stack.Screen name='(season)/[id]'/>
    </Stack>
  }

  return (
    <Tabs screenOptions={headerOptions}>
      <Tabs.Screen name="index" options={getConfig('Seasons', 'home')} />
      <Tabs.Screen name="profile" options={getConfig('Profile', 'account')} />
      <Tabs.Screen name="(season)/[id]" options={{ tabBarButton: () => null }} />
      <Tabs.Screen name="newRoom" options={{ tabBarButton: () => null }} />
      <Tabs.Screen name="teamSelection/[id]" options={{ tabBarButton: () => null }} />
      <Tabs.Screen name="invitations" options={{ tabBarButton: () => null }} />

    </Tabs>
  )
}

const styles = StyleSheet.create({
  notificationsCount: {
    backgroundColor: 'red',
    width:15,
    height:15,
    right:10,
    top:10,
    textAlign:"center",
    position:"absolute",
    borderRadius:15,
  },
  notificationsContainer: {
    backgroundColor: "transparent",
  }
})
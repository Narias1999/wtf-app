import { StyleSheet, useColorScheme} from 'react-native'
import React from 'react'
import { Redirect, Tabs } from 'expo-router'
import { Icon } from 'react-native-paper';
import { IconButton, Text, useTheme } from 'react-native-paper'
import { useSelector } from 'react-redux';

import { selectUser } from '../../store/features/auth';
import { useGetMyInvitationsQuery } from '../../api/invitations';
import Colors from '../../constants/Colors';

export default function Layout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const theme = useTheme();
  const user = useSelector(selectUser);
  const { data, isLoading } = useGetMyInvitationsQuery('');

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
    headerRight: () => <IconButton icon="bell" iconColor={theme.colors.inversePrimary} size={20} onPress={() => {}} />,
    headerTitle: () => <Text variant="titleMedium" style={colorStyle}>WTF</Text>,
  }

  return (
    <Tabs screenOptions={headerOptions}>
      <Tabs.Screen name="index" options={getConfig('Seasons', 'home')} />
      <Tabs.Screen name="profile" options={getConfig('Profile', 'account')} />
      <Tabs.Screen name="(season)" options={{ tabBarButton: () => null }} />
      <Tabs.Screen name="newRoom" options={{ tabBarButton: () => null }} />
      <Tabs.Screen name="teamSelection/[id]" options={{ tabBarButton: () => null }} />
    </Tabs>
  )
}

const styles = StyleSheet.create({})
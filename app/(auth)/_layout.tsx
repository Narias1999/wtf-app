import { StyleSheet } from 'react-native'
import React from 'react'
import { Redirect, Stack } from 'expo-router'
import { IconButton, Text, useTheme } from 'react-native-paper'
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/features/auth';

export default function Layout() {
  const theme = useTheme();
  const user = useSelector(selectUser);

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
    headerLeft: () => <IconButton icon="chevron-left" iconColor={theme.colors.inversePrimary} size={20} onPress={() => {}} />,
    headerTitle: () => <Text variant="titleMedium" style={colorStyle}>WTF</Text>,
}

  return (
    <Stack screenOptions={headerOptions} />
  )
}

const styles = StyleSheet.create({})
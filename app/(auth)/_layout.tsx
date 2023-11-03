import { StyleSheet } from 'react-native'
import React from 'react'
import { Slot, Stack } from 'expo-router'
import { View } from '../../components/Themed'
import { IconButton, Text, useTheme } from 'react-native-paper'

export default function Layout() {
  const theme = useTheme();

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
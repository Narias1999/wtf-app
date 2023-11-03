import { useState } from 'react';

import { View, Platform, StatusBar, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Text, TextInput } from 'react-native-paper';
import MembersInvite from '../../components/MemersInvite';
import { useRouter } from 'expo-router';

export default function NewRoom() {
  const statusBarHeight = Platform.OS === 'ios' ? 35 : StatusBar.currentHeight || 0;
  const router = useRouter();

  return (
    <ScrollView>
      <View style={{ paddingTop: statusBarHeight, flex: 1, paddingHorizontal: 10 }}>
        <KeyboardAvoidingView style={styles.container}>
          <View style={styles.titleContainer}>
            <Text variant="titleLarge">Create a new Room</Text>
          </View>
          <TextInput mode="outlined" label="Name" />
          <View style={styles.newMembersSection}>
            <Text variant="titleLarge" style={{ paddingBottom: 20 }}>Invite Members</Text>
            <MembersInvite />
          </View>

          <View style={{ alignItems: 'center', paddingTop: 30 }}>
            <Button mode="elevated" onPress={() => router.push('/teamSelection')}>Create</Button>
          </View>
        </KeyboardAvoidingView>
      </View>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  titleContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  newMembersSection: {
    paddingVertical: 20,
  },
  newMemberContainer: {
    flexDirection: 'row',
  }
});

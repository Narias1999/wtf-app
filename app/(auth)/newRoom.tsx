import { useEffect, useState } from 'react';

import { View, Platform, StatusBar, StyleSheet, KeyboardAvoidingView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, Text, TextInput } from 'react-native-paper';
import MembersInvite from '../../components/MembersInvite';
import { useRouter } from 'expo-router';
import { useCreateRoomMutation } from '../../api/rooms';

type roomForm = {
  name: string,
  invitations: string[]
}

const defaultFormValues = {
  name: '',
  invitations: [],
};

export default function NewRoom() {
  const statusBarHeight = Platform.OS === 'ios' ? 35 : StatusBar.currentHeight || 0;
  const [ form, setForm ] = useState<roomForm>(defaultFormValues)
  const router = useRouter();
  const [createRoom, { data, isError, isSuccess, error: loginError, isLoading }] = useCreateRoomMutation();

  useEffect(() => {
    if(isSuccess) {
      router.push(`/teamSelection/${data?.id}`);
    }
  }, [isSuccess])

  const handleUpdateForm = (key: keyof roomForm) => (value: string | string[]) => {
    setForm({
      ...form,
      [key]: value,
    });
  }

  return (
    <ScrollView>
      <View style={{ paddingTop: statusBarHeight, flex: 1, paddingHorizontal: 10 }}>
        <KeyboardAvoidingView style={styles.container}>
          <View style={styles.titleContainer}>
            <Text variant="titleLarge">Create a new season</Text>
          </View>
          <TextInput mode="outlined" label="Name" onChangeText={handleUpdateForm('name')} />
          <View style={styles.newMembersSection}>
            <Text variant="titleLarge" style={{ paddingBottom: 20 }}>Invite Managers</Text>
            <MembersInvite  value={form.invitations} onChange={handleUpdateForm('invitations')}/>
          </View>

          <View style={{ alignItems: 'center', paddingTop: 30 }}>
            <Button mode="elevated" loading={isLoading} onPress={()=>createRoom(form)}>Create</Button>
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

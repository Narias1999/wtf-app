import { StyleSheet } from 'react-native';
import { Button, Icon, Avatar, Text, Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { logout as logoutAction, selectUser } from '../../store/features/auth';
import { View } from '../../components/Themed';

export default function Rooms() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const initial = user?.username ? user.username[0].toUpperCase() : 'U';

  const logout = () => {
    dispatch(logoutAction());
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.avatarContainer}>
          <Avatar.Text size={68} label={initial} />
          <Text variant="bodyLarge">{user?.username}</Text>
          <Text variant="bodyLarge">{user?.email}</Text>
        </View>
        <Card style={styles.info}>
          <Text variant="headlineSmall" style={{ textAlign: 'center' }}>Manager Info</Text>
          <Text style={{ marginTop: 10 }}>Visionary cycling manager renowned for his strategic brilliance. With a keen eye for talent, he assembles powerhouse teams, devises winning race strategies, and navigates the intricacies of the global cycling scene with finesse. Lefevre's leadership, coupled with tactical acumen, cements his status as a trailblazer in the fiercely competitive world of professional cycling.</Text>
        </Card>
      </View>
      <Button onPress={logout} icon={() => <Icon source="logout" size={32}/>}>
        Log Out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, position: 'relative', flex: 1 },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20
  },
  info: {
    padding: 25,
  }
});

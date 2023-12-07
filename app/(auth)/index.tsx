import { StyleSheet, TouchableOpacity, View as NativeView } from 'react-native';
import { Button, Card, Text, FAB, Chip } from 'react-native-paper';

import { View } from '../../components/Themed';

import rooms from '../../data/mockRooms.json';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';

interface Room {
  members: string[];
  name: string;
  season: number;
}

const EmptyState = ({ onCreateNew }: { onCreateNew: () => void }) => ( <View style={styles.emptyStateContainer}>
  <Text variant="titleMedium" style={styles.noRoomsText}>You are not part of any room yet.</Text>

  <Button mode="elevated" onPress={onCreateNew}>Create one</Button>
</View>);

const RoomCard = ({ members, name, season }: Room) => {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => router.push('/teamSelection')}>
        <Card>
          <Card.Content>
            <NativeView style={styles.cardTitle}>
              <Text variant="titleLarge">{name}</Text>
              <Chip mode="outlined">{season}</Chip>
            </NativeView>
            <NativeView style={styles.membersContainer}>
              {
                members.map(member => (
                  <NativeView style={styles.member} key={member}>
                    <Chip key={member}>{member}</Chip>
                  </NativeView>
                ))
              }
            </NativeView>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </View>
  );
}

export default function Rooms() {
  const router = useRouter();
  const hasRooms = true;

  const handleNewRoom = () => {
    router.push('/newRoom');
  };

  if (hasRooms) {
    return (
      <View style={{ padding: 10, position: 'relative', flex: 1 }}>
        <View style={styles.titleContainer}>
          <Text variant="titleLarge">Seassons</Text>
        </View>
        <View style={styles.cardsContainer}>
          <ScrollView style={{ flex: 1 }}>
            {
              rooms.map((room: Room) => <RoomCard key={room.name} {...room} />)
            }
          </ScrollView>
        </View>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={handleNewRoom}
        />
      </View>
    );
  }
  return <EmptyState onCreateNew={handleNewRoom} />;
}

const styles = StyleSheet.create({
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noRoomsText: {
    marginBottom: 20
  },
  titleContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  cardsContainer: {
    flex: 1
  },
  card: {
    marginBottom: 15
  },
  cardTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  membersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  member: {
    paddingRight: 10,
    paddingTop: 10
  },
  fab: {
    position: 'absolute',
    margin: 30,
    right: 0,
    bottom: 0,
  },
});

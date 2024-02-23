import { StyleSheet, TouchableOpacity, View as NativeView, RefreshControl } from 'react-native';
import { Button, Card, Text, FAB, Chip, ActivityIndicator } from 'react-native-paper';

import { View } from '../../components/Themed';

import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import { Room, useGetMyRoomsQuery } from '../../api/rooms';

const EmptyState = ({ onCreateNew }: { onCreateNew: () => void }) => ( <View style={styles.emptyStateContainer}>
  <Text variant="titleMedium" style={styles.noRoomsText}>You are not part of any room yet.</Text>

  <Button mode="elevated" onPress={onCreateNew}>Create one</Button>
</View>);

const RoomCard = (room: Room) => {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => router.push(room.started_at ? `/${room.id}/leaderboard` : `/teamSelection/${room.id}`)}>
        <Card>
          <Card.Content>
            <NativeView style={styles.cardTitle}>
              <Text variant="titleLarge">{room.name}</Text>
              <Chip mode="outlined">2024</Chip>
            </NativeView>
            <NativeView style={styles.membersContainer}>
              {
                room.teams.map(team => (
                  <NativeView style={styles.member} key={team.id}>
                    <Chip>{team.user.username}</Chip>
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
  const { data: rooms, isLoading, refetch, error } = useGetMyRoomsQuery('');
  const router = useRouter();

  const handleNewRoom = () => {
    router.push('/newRoom');
  };

  if (isLoading) {
    return (
      <View style={styles.emptyStateContainer}>
        <ActivityIndicator />
      </View>
    )
  }

  if (rooms?.length) {
    return (
      <View style={{ padding: 10, position: 'relative', flex: 1 }}>
        <View style={styles.titleContainer}>
          <Text variant="titleLarge">Seassons</Text>
        </View>
        <View style={styles.cardsContainer}>
          <ScrollView
            style={{ flex: 1 }}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={refetch}
              />
            }>
            {
              rooms.map((room) => <RoomCard key={room.id} {...room} />)
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

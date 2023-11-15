import { StyleSheet, ScrollView, Image } from 'react-native'
import { DataTable, Avatar, Card, Text, Divider } from 'react-native-paper'
import leaderboardData from '../../data/leaderboard.json';
import { View } from '../../components/Themed';

interface Manager {
  name: string;
  points: number;
};

const Race = () => (
  <View style={styles.race}>
    <View>
      <Image
        style={styles.raceImage}
        source={{uri: 'https://movistarteam.com/wp-content/uploads/2021/02/004-3-1380x920.jpg'}}
      />
    </View>
    <Divider />
    <View style={{ padding: 10 }}>
      <Text variant='labelLarge'>Tour Down Under</Text>
    </View>
  </View>
)

const RaceBanner = () => {
  return (
    <ScrollView style={styles.racesBanner} horizontal scrollEventThrottle={16}>
      <Race />
      <Race />
      <Race />
      <Race />
    </ScrollView>
  )
}

export default function Leaderboard() {
  return (
   <View style={styles.container}>
    <Card style={styles.gcContainer}>
      <Card.Title
        title="General Classification"
        titleVariant="titleMedium"
        left={() => <Avatar.Icon size={30} icon="flag-checkered" />}
      />
      <DataTable>
        {leaderboardData.map((manager: Manager, index: number) => (
          <DataTable.Row key={manager.name}>
            <DataTable.Cell>{index+1}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 5 }}>{manager.name}</DataTable.Cell>
            <DataTable.Cell numeric>{manager.points}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </Card>
    <View style={styles.upcoming}>
      <Text variant="titleMedium">Upcoming Races</Text>
      <RaceBanner />
    </View>
   </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  gcContainer: {
    padding: 10,
    marginHorizontal: 15,
    marginVertical: 30
  },
  upcoming: {
    marginLeft: 25,
  },
  racesBanner: {
    paddingTop: 15,
    paddingBottom: 10,
  },
  race: {
    width: 190,
    marginLeft: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10
  },
  raceImage: {
    width: '100%',
    height: 100
  }
})
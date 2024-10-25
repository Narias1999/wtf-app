import { StyleSheet, ScrollView, Image } from 'react-native'
import { DataTable, Avatar, Card, Text, Divider, Button } from 'react-native-paper'
import leaderboardData from '../../../../data/leaderboard.json';
import { View } from '../../../../components/Themed';
import { useRoute } from '@react-navigation/native';
import { Team, useGetRoomByIdQuery } from '../../../../api/rooms';
import { useContext, useMemo } from 'react';
import { SeasonContext } from '../_layout';

interface Manager {
  name: string;
  points: number;
};

const Race = ({ image, title }: { image: string, title: string }) => (
  <View style={styles.race}>
    <View>
      <Image
        style={styles.raceImage}
        source={{uri: image}}
      />
    </View>
    <Divider />
    <View style={{ padding: 10 }}>
      <Text variant='labelLarge'>{title}</Text>
    </View>
  </View>
)

const RaceBanner = () => {
  return (
    <ScrollView style={styles.racesBanner} horizontal scrollEventThrottle={16}>
      <Race image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNMrWV6qSBzGiTr_4cpwUpO7dSoT8R3SSjtQ&s" title="Santos Tour Down Under"/>
      <Race image="https://files.slack.com/files-pri/T062E3LL7FE-F07T7U7C7HQ/image.png" title="Cadel Evans Great Ocean Road Race" />
      <Race image="https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/fe/a5/c9/fea5c97e-4b91-4451-9d35-5b082c19884d/AppIcon-0-0-1x_U007emarketing-0-0-0-10-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/1200x600wa.png" title="UAE Tour" />
      <Race image="https://files.slack.com/files-pri/T062E3LL7FE-F07T533MAA1/image.png" title="Omloop Het Nieuwsblad" />
    </ScrollView>
  )
}

export default function Leaderboard() {
  const { season } = useContext(SeasonContext);

  const sortedSeasonByPoints = useMemo(() => {
    const teams = season?.teams ? [...season.teams] : [];
    return teams?.sort((a, b) => (b.totalPoints ?? 0) - (a.totalPoints ?? 0))
  }, [season]);

  return (
   <ScrollView style={styles.container}>
    <Card style={styles.gcContainer}>
      <Card.Title
        title="General Classification"
        titleVariant="titleMedium"
        left={() => <Avatar.Icon size={30} icon="flag-checkered" />}
      />
      <DataTable>
        {sortedSeasonByPoints.map((manager: Team, index: number) => (
          <DataTable.Row key={manager.user.id}>
            <DataTable.Cell>{index+1}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 5 }}>{manager.user.username}</DataTable.Cell>
            <DataTable.Cell numeric>{manager.totalPoints}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </Card>
    <View style={styles.upcoming}>
      <Text variant="titleMedium">Upcoming Races</Text>
      <RaceBanner />
    </View>
   </ScrollView>
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
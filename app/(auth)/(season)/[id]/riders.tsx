import { StyleSheet } from 'react-native';
import { Text, Card, DataTable, Avatar } from 'react-native-paper';
import Flag from "react-native-country-flag";

import myTeamData from '../../../../data/myTeam.json';
import { View } from '../../../../components/Themed';
import { useContext, useMemo } from 'react';
import { Rider } from '../../../../api/rooms';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../store/features/auth';
import { SeasonContext } from '../_layout';
import { ScrollView } from 'react-native-gesture-handler';

interface RiderPoints {
  name: string;
  country: string;
  points: number;
}

export default function News() {
  const user = useSelector(selectUser);
  const { season, isLoading } = useContext(SeasonContext);
  const riderTeam = useMemo(() => {
    if (season?.teams && user) {
      return season?.teams.find(team => team.user.id === user.id)
    }
    return null
  }, [season, user]);

  const sortedRidersByPoints = useMemo(() => {
    const riders = riderTeam?.riders ? [...riderTeam.riders] : [];
    return riders?.sort((a, b) => (b.points ?? 0) - (a.points ?? 0))
  }, [riderTeam]);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.gcContainer}>
        <Card.Title
          title="MyTeam"
          titleVariant="titleMedium"
          left={() => <Avatar.Icon size={30} icon="bike" />}
        />
        {
          isLoading || !riderTeam ? <Text>Loading...</Text> :
          <DataTable>
            {sortedRidersByPoints.map((rider, index: number) => (
              <DataTable.Row key={rider.name}>
                <DataTable.Cell>{index+1}</DataTable.Cell>
                <DataTable.Cell style={{ flex: 5 }}>
                  <View style={styles.riderContainer}>
                    <Flag isoCode={rider.country.toLowerCase()} size={16} />
                    <Text>{rider.name}</Text>
                  </View>
                </DataTable.Cell>
                <DataTable.Cell numeric>{rider.points}</DataTable.Cell>
              </DataTable.Row>
            ))}
            <DataTable.Row>
              <DataTable.Cell>{' '}</DataTable.Cell>
              <DataTable.Cell style={{ flex: 5 }}>Total</DataTable.Cell>
              <DataTable.Cell numeric>{riderTeam?.totalPoints}</DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        }
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 30
  },
  gcContainer: {

  },
  riderContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  }
});

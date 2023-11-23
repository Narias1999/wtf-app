import { StyleSheet } from 'react-native'; 
import { Text, Card, DataTable, Avatar } from 'react-native-paper';
import Flag from 'react-native-flags';

import myTeamData from '../../data/myTeam.json';
import { View } from '../../components/Themed';
import { useMemo } from 'react';

interface RiderPoints {
  name: string;
  country: string;
  points: number;
}

export default function News() {
  const total = useMemo(() => myTeamData.reduce(
    (acc: number, curr: RiderPoints) => acc + curr.points, 0), []
  );

  return (
    <View style={styles.container}>
      <Card style={styles.gcContainer}>
        <Card.Title
          title="MyTeam"
          titleVariant="titleMedium"
          left={() => <Avatar.Icon size={30} icon="bike" />}
        />
        <DataTable>
          {myTeamData.map((rider: RiderPoints, index: number) => (
            <DataTable.Row key={rider.name}>
              <DataTable.Cell>{index+1}</DataTable.Cell>
              <DataTable.Cell style={{ flex: 5 }}>
                <View style={styles.riderContainer}>
                  <Flag code={rider.country} size={24} />
                  <Text>{rider.name}</Text>
                </View>
              </DataTable.Cell>
              <DataTable.Cell numeric>{rider.points}</DataTable.Cell>
            </DataTable.Row>
          ))}
          <DataTable.Row>
            <DataTable.Cell>{' '}</DataTable.Cell>
            <DataTable.Cell style={{ flex: 5 }}>Total</DataTable.Cell>
            <DataTable.Cell numeric>{total}</DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
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

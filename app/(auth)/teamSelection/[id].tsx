import { ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { Button, Chip, Divider, Surface, Switch, Text } from 'react-native-paper';
import Flag from 'react-native-flags';
import { View } from '../../../components/Themed';
import { Fragment, useState } from 'react';
import Colors from '../../../constants/Colors';

import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGetRoomByIdQuery, Team } from '../../../api/rooms';
import { selectUser } from '../../../store/features/auth';
import { useSelector } from 'react-redux';
import { RefreshControl } from 'react-native-gesture-handler';

const RivalTeam = ({ user, riders }: Team) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Surface elevation={1} style={[styles.teamSurface]}>
      <View style={styles.teamContainer}>
        <Text variant="titleMedium">{user?.username}</Text>
      </View>
      <Divider style={{ marginBottom: 20 }} />
      <View style={{ backgroundColor: 'transparent', alignItems: 'flex-start', gap: 10 }}>
        {
          riders?.map((cyclist) => (
            <Chip avatar={<Flag
              code={cyclist.country}
              size={32}
            />} key={cyclist.id}>{cyclist.name}</Chip>
          ))
        }
      </View>
    </Surface>
  )
};

export default function TeamSelection() {
  const { id } = useLocalSearchParams();
  const { data, isLoading, refetch } = useGetRoomByIdQuery(id);
  console.log(data.teams[0]);
  const user = useSelector(selectUser);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [ready, setReady] = useState(false);
  const colors = Colors[colorScheme ?? 'light'];

  const isAdmin = data?.user_admin?.id === user?.id;

  const startSeason = () => {
    router.push('/leaderboard');
  }

  return (
    <View style={{ paddingTop: 20, paddingHorizontal: 20, flex: 1 }}>
      {isAdmin && (
        <Fragment>
          <Text variant="titleLarge" style={{ marginBottom: 10 }}>
            Team selection
          </Text>
          {/* <MembersInvite /> */}
          <Divider style={{ marginVertical: 30 }} />
        </Fragment>
      )}
      <View style={{ flex: 1 }}>
        <Text variant="titleLarge" style={{ marginBottom: 10, textAlign: 'center' }}>Managers</Text>

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
            />
          }
        >
          <View style={{ paddingBottom: 20, paddingHorizontal: 10 }}>
            {
              data?.teams.map((team: Team) => (
                <RivalTeam key={team.id} {...team} />
              ))
            }
          </View>
        </ScrollView>
        {isAdmin && (
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={startSeason}>
              Start Season
            </Button>
          </View>
        )}
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  readyCheckbox: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10
  },
  teamSurface: {
    marginVertical: 15,
    marginHorizontal: 3, 
    padding: 12,
    borderRadius: 10 
  },
  teamContainer: {
    backgroundColor: 'transparent',
    padding: 5,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  buttonContainer: {
    paddingBottom: 30,
  }
})
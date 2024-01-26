import { Fragment, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Touchable, TouchableOpacity, useColorScheme } from 'react-native';
import { Button, Chip, Divider, IconButton, Surface, Text } from 'react-native-paper';
import Flag from 'react-native-flags';
import DropDown from 'react-native-paper-dropdown';

import { View } from '../../../components/Themed';
import Colors from '../../../constants/Colors';

import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGetRoomByIdQuery, Team } from '../../../api/rooms';
import { selectUser } from '../../../store/features/auth';
import { useSelector } from 'react-redux';
import { RefreshControl } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import AutocompleteInput from 'react-native-autocomplete-input';
import { useGetAllRidersQuery } from '../../../api/riders';

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

function AdminSelection({ teams } : { teams: Team[] }) {
  const [showDropDown, setShowDropDown] = useState(false);
  const [activeTeam, setActiveTeam] = useState(null);
  const [riderQuery, setRiderQuery] = useState('');
  const { data: ridersList } = useGetAllRidersQuery('')

  const teamsList = useMemo(() => teams.map((team) => ({ label: team.user?.username, value: team.id })), [teams]);
  const selectedTeam = useMemo(() => teams.find((team) => team.id === activeTeam), [activeTeam]);

  const filteredRidersList = useMemo(() => {
    const items = ridersList?.data ? ridersList.data.map(rider => rider.attributes) : [];
    return items.filter((item) => item.name.toLowerCase().includes(riderQuery.toLowerCase()));
  }, [ridersList, riderQuery]);

  const removeCyclist = (id: number) => {}

  const addCyclist = (cyclist: string) => {
    setRiderQuery('');
  }

  return (
    <Fragment>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text variant="titleLarge">
          Team selection
        </Text>
          <DropDown
            label={"Manager"}
            mode={"outlined"}
            visible={showDropDown}
            showDropDown={() => setShowDropDown(true)}
            onDismiss={() => setShowDropDown(false)}
            value={activeTeam}
            setValue={setActiveTeam}
            list={teamsList}
          />
      </View>
      {!!selectedTeam && (
        <View>
          {
            selectedTeam.riders.map((cyclist) => (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Chip avatar={<Flag
                  code={cyclist.country}
                  size={32}
                />} key={cyclist.id}>{cyclist.name}</Chip>
                  <IconButton mode="contained"  icon="minus" onPress={() => removeCyclist(cyclist.id)} />
              </View>
            ))
          }

          <View style={{ zIndex: 1 }}>
            <AutocompleteInput
              data={filteredRidersList}
              value={riderQuery}
              hideResults={riderQuery.length < 2}
              onChangeText={setRiderQuery}
              flatListProps={{
                keyExtractor: (item) => item.name,
                renderItem: ({ item }) => <TouchableOpacity onPress={() => addCyclist(item.name)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', paddingVertical: 2}}>
                      <Flag
                        code={item.country}
                        size={24}
                      />
                      <Text>{item.name}</Text>
                    </View>
                </TouchableOpacity>
              }}
            />
          </View>

          <Button>Update</Button>
        </View>
      )}
      <Divider style={{ marginVertical: 30 }} />
    </Fragment>
  )
}

export default function TeamSelection() {
  const { id } = useLocalSearchParams();
  const { data, isLoading, refetch } = useGetRoomByIdQuery(id);
  const user = useSelector(selectUser);
  const router = useRouter();

  const isAdmin = data?.user_admin?.id === user?.id;

  console.log(isAdmin, isLoading);

  const startSeason = () => {
    router.push('/leaderboard');
  }

  return (
    <View style={{ paddingTop: 20, paddingHorizontal: 20, flex: 1 }}>
      {isAdmin && !!data?.teams && (
        <AdminSelection teams={data?.teams} />
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
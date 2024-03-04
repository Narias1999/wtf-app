import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from "react-native";
import {
  Button,
  Chip,
  Divider,
  IconButton,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";
import Flag from "react-native-country-flag";
import DropDown from "react-native-paper-dropdown";

import { View } from "../../../components/Themed";
import Colors from "../../../constants/Colors";

import { useRouter, useLocalSearchParams } from "expo-router";
import { useGetRoomByIdQuery, Team, Rider, useStartSeasonMutation } from "../../../api/rooms";
import { selectUser } from "../../../store/features/auth";
import { useSelector } from "react-redux";
import { RefreshControl } from "react-native-gesture-handler";
import { useGetAllRidersQuery } from "../../../api/riders";
import { useUpdateRoomTeamMutation } from "../../../api/roomTeam";
import AutocompleteRiders from "../../../components/AutocompleteRiders";

const RivalTeam = ({ user, riders }: Team) => {
  const colorScheme = useColorScheme();
  const currentUser = useSelector(selectUser);
  const colors = Colors[colorScheme ?? "light"];

  return (
    <Surface elevation={1} style={[styles.teamSurface]}>
      <View style={styles.teamContainer}>
        <Text variant="titleMedium">{user?.username}</Text>
        { currentUser?.id === user.id && <Text style={{ color: colors.success, fontWeight: '600' }}>(You)</Text> }
      </View>
      <Divider style={{ marginBottom: 20 }} />
      <View
        style={{
          backgroundColor: "transparent",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        {
          !riders?.length && (
            <Text style={{ textAlign: "center" }}>No riders selected</Text>
          )
        }
        {riders?.map((cyclist) => (
          <Chip
            avatar={<Flag isoCode={cyclist.country.toLowerCase()} size={32} />}
            key={cyclist.id}
          >
            {cyclist.name}
          </Chip>
        ))}
      </View>
    </Surface>
  );
};

function AdminSelection({ teams, refetch }: { teams: Team[], refetch: Function, }) {
  const [showDropDown, setShowDropDown] = useState(false);
  const [activeTeam, setActiveTeam] = useState(null);
  const [selectedRiders, setSelectedRiders] = useState<Rider[]>([]);
  const [updateRoomTeam, { isLoading }] = useUpdateRoomTeamMutation();

  useEffect(() => {
    setSelectedRiders(selectedTeam?.riders ?? []);
  }, [activeTeam, teams]);

  const theme = useTheme();

  const teamsList = useMemo(
    () => teams.map((team) => ({ label: team.user?.username, value: team.id })),
    [teams]
  );
  const selectedTeam = useMemo(
    () => teams.find((team) => team.id === activeTeam),
    [activeTeam]
  );

  const removeCyclist = (id: number) => {
    let updatedRiders = [...selectedRiders];
    const riderIndex = updatedRiders.findIndex((rider) => rider.id == id);
    updatedRiders.splice(riderIndex, 1);
    setSelectedRiders(updatedRiders);
  };

  const addCyclist = (cyclist: Rider) => {
    console.log(cyclist)
    if(selectedRiders.some(item => item.id == cyclist.id)) return
    setSelectedRiders([...selectedRiders, cyclist]);
  };

  const updateRiders = async () => {
    await updateRoomTeam({
      id: selectedTeam?.id,
      data: {
        riders: selectedRiders.map(rider => rider.id)
      }
    })
    setActiveTeam(null)
    refetch()
  };

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 1000
        }}
      >
        <Text variant="titleLarge">Team selection</Text>
        <DropDown
          label={"Manager"}
          mode={"outlined"}
          visible={showDropDown}
          showDropDown={() => setShowDropDown(true)}
          onDismiss={() => setShowDropDown(false)}
          dropDownItemTextStyle={{
            color: theme.colors.secondary,
          }}
          inputProps={{
            style: {
              height: 40,
            },
          }}
          value={activeTeam}
          setValue={setActiveTeam}
          list={teamsList}
        />
      </View>
      {!!selectedTeam && (
        <>
          <View style={{ paddingTop: 20 }}>
            <AutocompleteRiders onSelect={addCyclist}/>
          </View>
          <View style={{ zIndex: -1 }}>
            {selectedRiders.map((cyclist) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 0
                }}
                key={cyclist.id}
              >
                <Chip
                  avatar={<Flag isoCode={cyclist.country.toLowerCase()} size={32} />}
                  key={cyclist.id}
                >
                  {cyclist?.name}
                </Chip>
                <IconButton
                  mode="contained"
                  icon="minus"
                  onPress={() => removeCyclist(cyclist.id)}
                />
              </View>
            ))}


            <Button onPress={updateRiders} loading={isLoading}>
              Update
            </Button>
          </View>
        </>
      )}
      <Divider style={{ marginVertical: 30, zIndex: -1 }} />
    </>
  );
}

export default function TeamSelection() {
  const { id } = useLocalSearchParams();
  const { data, isLoading, refetch } = useGetRoomByIdQuery(id);
  const [startSeasonCall, { isSuccess: succesfullyStarted, isLoading: isLoadingStartSeason, error  }] = useStartSeasonMutation();
  const user = useSelector(selectUser);
  const router = useRouter();

  useEffect(() => {
    if (succesfullyStarted) router.push(`/${id}/leaderboard`);
  }, [succesfullyStarted, error]);

  const isAdmin = data?.user_admin?.id === user?.id;

  const startSeason = () => {
    const teamRiders = data?.teams.map(team => team.riders.length) || [];
    if (teamRiders.includes(0)) {
      Alert.alert('Not quite yet', 'All teams must have at least one rider. You can\'t make changes to the teams once the season starts', [{ text: 'OK' }]);
    } else {
      startSeasonCall(Number(id));
    }
  };

  return (
    <View style={{ paddingTop: 20, paddingHorizontal: 20, flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        {isAdmin && !!data?.teams && <AdminSelection teams={data?.teams} refetch={refetch} />}
        <View style={{ flex: 1, zIndex: -1 }}>
          <Text
            variant="titleLarge"
            style={{ marginBottom: 10, textAlign: "center" }}
          >
            Teams
          </Text>

            <View style={{ paddingBottom: 20, paddingHorizontal: 10 }}>
              {data?.teams.map((team: Team) => (
                <RivalTeam key={team.id} {...team} />
              ))}
            </View>
          </View>
        </ScrollView>
        {isAdmin && (
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={startSeason} disabled={isLoadingStartSeason}>
              Start Season
            </Button>
          </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  readyCheckbox: {
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
  },
  teamSurface: {
    marginVertical: 15,
    marginHorizontal: 3,
    padding: 12,
    borderRadius: 10,
  },
  teamContainer: {
    backgroundColor: "transparent",
    padding: 5,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonContainer: {
    paddingBottom: 30,
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1,
  },
});

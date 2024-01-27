import { Fragment, useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
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
import { useGetRoomByIdQuery, Team, Rider } from "../../../api/rooms";
import { selectUser } from "../../../store/features/auth";
import { useSelector } from "react-redux";
import { RefreshControl } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import AutocompleteInput from "react-native-autocomplete-input";
import { useGetAllRidersQuery } from "../../../api/riders";
import { useUpdateRoomTeamMutation } from "../../../api/roomTeam";

const RivalTeam = ({ user, riders }: Team) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <Surface elevation={1} style={[styles.teamSurface]}>
      <View style={styles.teamContainer}>
        <Text variant="titleMedium">{user?.username}</Text>
      </View>
      <Divider style={{ marginBottom: 20 }} />
      <View
        style={{
          backgroundColor: "transparent",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
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
  const [riderQuery, setRiderQuery] = useState("");
  const [selectedRiders, setSelectedRiders] = useState<Rider[]>([]);
  const { data: ridersList } = useGetAllRidersQuery("");
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

  const filteredRidersList = useMemo(() => {
    const items = ridersList?.data
      ? ridersList.data.map((rider) => ({ ...rider.attributes, id: rider.id }))
      : [];
    return items.filter((item) =>
      item.name.toLowerCase().includes(riderQuery.toLowerCase())
    );
  }, [ridersList, riderQuery]);

  const removeCyclist = (id: number) => {
    let updatedRiders = [...selectedRiders];
    const riderIndex = updatedRiders.findIndex((rider) => rider.id == id);
    updatedRiders.splice(riderIndex, 1);
    setSelectedRiders(updatedRiders);
  };

  const addCyclist = (cyclist: number) => {
    if(selectedRiders.some(item => item.id == cyclist)) return
    setRiderQuery("");
    const rider = ridersList?.data.find((rider) => rider.id == cyclist);
    const formatedRider: Rider = { ...rider?.attributes!, id: rider?.id! };
    setSelectedRiders([...selectedRiders, formatedRider]);
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
    <Fragment>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
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
        <View>
          {selectedRiders.map((cyclist) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              key={cyclist.id}
            >
              <Chip
                avatar={<Flag isoCode={cyclist.country.toLowerCase()} size={32} />}
                key={cyclist.id}
              >
                {cyclist.name}
              </Chip>
              <IconButton
                mode="contained"
                icon="minus"
                onPress={() => removeCyclist(cyclist.id)}
              />
            </View>
          ))}

          <View style={{ zIndex: 1, position: "relative", height: 50 }}>
            <View style={styles.autocompleteContainer}>
              <AutocompleteInput
                data={filteredRidersList}
                value={riderQuery}
                hideResults={riderQuery.length < 2}
                onChangeText={setRiderQuery}
                flatListProps={{
                  keyExtractor: (item) => item.name,
                  renderItem: ({ item }) => (
                    <TouchableOpacity onPress={() => addCyclist(item.id)}>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: "white",
                          paddingVertical: 2,
                        }}
                      >
                        <Flag isoCode={item.country.toLowerCase()} size={24} />
                        <Text>{item.name}</Text>
                      </View>
                    </TouchableOpacity>
                  ),
                }}
              />
            </View>
          </View>

          <Button onPress={updateRiders} loading={isLoading}>
            Update
          </Button>
        </View>
      )}
      <Divider style={{ marginVertical: 30 }} />
    </Fragment>
  );
}

export default function TeamSelection() {
  const { id } = useLocalSearchParams();
  const { data, isLoading, refetch } = useGetRoomByIdQuery(id);
  const user = useSelector(selectUser);
  const router = useRouter();

  const isAdmin = data?.user_admin?.id === user?.id;

  const startSeason = () => {
    router.push("/leaderboard");
  };

  return (
    <View style={{ paddingTop: 20, paddingHorizontal: 20, flex: 1 }}>
      {isAdmin && !!data?.teams && <AdminSelection teams={data?.teams} refetch={refetch} />}
      <View style={{ flex: 1 }}>
        <Text
          variant="titleLarge"
          style={{ marginBottom: 10, textAlign: "center" }}
        >
          Managers
        </Text>

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
        >
          <View style={{ paddingBottom: 20, paddingHorizontal: 10 }}>
            {data?.teams.map((team: Team) => (
              <RivalTeam key={team.id} {...team} />
            ))}
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

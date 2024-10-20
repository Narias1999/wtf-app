import {
  StyleSheet,
  View as TView,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { Card, Text, Divider, DataTable } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import Flag from "react-native-country-flag";

import { View } from "../../../../components/Themed";

import results from "../../../../data/results.json";
import { useMemo, useState } from "react";
import {
  useGetRaceWithStagesQuery,
  useGetSimpleRacesQuery,
} from "../../../../api/races";
import { Stage } from "../../../../api/stages";
import AutocompleteInput from "react-native-autocomplete-input";

interface StageSelectorProps {
  stages: Stage[];
  stage?: number;
  setStage: (stage: number) => void;
}

function StageSelector({ stages, stage, setStage }: StageSelectorProps) {
  const [showDropDown, setShowDropDown] = useState(false);
  const list = useMemo(
    () =>
      stages.map((stageData, index: number) => {
        let label = `Stage ${stageData.number}`;
        return {
          label,
          value: index,
        };
      }),
    [results]
  );

  return (
    <SafeAreaView>
      <DropDown
        label={"Stage"}
        mode={"outlined"}
        visible={showDropDown}
        showDropDown={() => setShowDropDown(true)}
        onDismiss={() => setShowDropDown(false)}
        value={stage}
        setValue={setStage}
        list={list}
      />
    </SafeAreaView>
  );
}

function RaceResults({ selectedRace }: { selectedRace: number }) {
  const { data } =
    useGetRaceWithStagesQuery(selectedRace);
  const [stage, setStage] = useState<number>(0);
  if (data) {
    return (
      <>
        <View style={styles.resultHeader}>
          <TView style={styles.resultTitle}>
            <Flag isoCode={data.location?.toLowerCase()} size={16} />
            <Text>{data.Name}</Text>
          </TView>
          {data.stages?.length > 1 && (
            <View style={{ width: 150 }}>
              <StageSelector
                stages={data.stages}
                stage={stage}
                setStage={setStage}
              />
            </View>
          )}
        </View>
        <Divider />
        <TView>
          <DataTable>
            {data.stages[stage].results?.map((result, index: number) => {
              const rider = result?.rider;
              return (
                <DataTable.Row key={result?.id}>
                  <DataTable.Cell>{result?.position}</DataTable.Cell>
                  <DataTable.Cell style={{ flex: 5 }}>
                    <View style={styles.riderContainer}>
                      {
                        !!rider?.country && <Flag isoCode={rider?.country} size={16} />
                      }    
                      <Text>{rider?.name}</Text>
                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>{result?.points}</DataTable.Cell>
                </DataTable.Row>
              );
            })}
          </DataTable>
        </TView>
      </>
    );
  }
}

export default function News() {
  const { data } = useGetSimpleRacesQuery("");
  const [raceQuery, setraceQuery] = useState("");
  const [selectedRace, setSelectedRace] = useState<number>();
  const [hideResults, setHideResults] = useState(false);

  const filteredRaces = useMemo(() => {
    if (!data?.data) {
      return [];
    }
    return data?.data.filter((race) =>
      race.attributes.Name.toLowerCase().includes(raceQuery.toLowerCase())
    );
  }, [raceQuery, data]);

  return (
    <View style={{ flex: 1, paddingHorizontal: 8 }}>
      <View style={{ paddingVertical: 6, zIndex: 100 }}>
        <AutocompleteInput
          data={filteredRaces}
          value={raceQuery}
          hideResults={raceQuery.length < 1 || hideResults}
          containerStyle={{ zIndex: 5000 }}
          placeholder="Race"
          onChangeText={(value) => {
            setraceQuery(value);
            setHideResults(false);
          }}
          flatListProps={{
            keyExtractor: (item) => item.attributes.Name,
            style: { maxHeight: 200 },
            renderItem: ({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedRace(item.id);
                  setraceQuery(item.attributes.Name);
                  setHideResults(true);
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 6,
                    gap: 10,
                    padding: 10,
                    zIndex: 500,
                    maxHeight: 200,
                  }}
                >
                  <Flag
                    isoCode={item.attributes.location.toLowerCase()}
                    size={16}
                  />
                  <Text>{item.attributes.Name}</Text>
                </View>
              </TouchableOpacity>
            ),
          }}
        />
      </View>
      {!!selectedRace && (
        <ScrollView style={styles.container}>
          <RaceResults selectedRace={selectedRace} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  riderContainer: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  resultContainer: {
    marginBottom: 30,
  },
  resultHeader: {
    paddingBottom: 2,
    gap: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});

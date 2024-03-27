import { StyleSheet, View as TView, ScrollView, SafeAreaView } from 'react-native'
import { Card, Text, Divider, DataTable } from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import Flag from "react-native-country-flag";

import { View } from '../../../../components/Themed';

import results from '../../../../data/results.json';
import { useMemo, useState } from 'react';
import { Race, useGetRacesQuery } from '../../../../api/races';
import { Stage } from '../../../../api/stages';


interface StageSelectorProps {
  stages: Stage[]
  stage: number;
  setStage: (stage: number) => void
}

function StageSelector({ stages, stage, setStage }: StageSelectorProps) {
  const [showDropDown, setShowDropDown] = useState(false);
  const list = useMemo(() => stages.map((stageData, index: number) => {
    let label = `Stage ${stageData.attributes.number}`;

    // switch (stageData.type) {
    //   case 'stage':
    //     label = `Stage ${index + 1}`;
    //     break;
    //   case 'gc':
    //     label = 'GC';
    //     break;
    //   case 'mountain':
    //     label = 'Mountains';
    //     break;
    //   case 'sprints':
    //     label = 'Sprints';
    //     break;
    // }

    return {
      label,
      value: index,
    }
  }), [results]);

  return (
    <SafeAreaView>
      <DropDown
        label={"Gender"}
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

function Result({ race }: { race: Race }) {
  // const raceType = Number(race.category.split('.')[0]);
  const [stage, setStage] = useState(0);
  return (
    <Card style={styles.resultContainer}>
      <TView style={styles.resultHeader}>
        <TView style={styles.resultTitle}>
          <Flag isoCode={race.attributes.location.toLowerCase()} size={24} />
          <Text>{race.attributes.Name}</Text>
        </TView>
        {
          race.attributes.stages.data.length > 1 ? (
            <StageSelector stages={race.attributes.stages.data} stage={stage} setStage={setStage} />
          ) : <Text>Stage {race.attributes.stages.data[stage].attributes.number}</Text>
        }
      </TView>
      <Divider />
      <TView>
        <DataTable>
            {
              race.attributes.stages.data[stage].attributes.results.data.map((result, index: number) => {
                const rider = result.attributes.rider.data
                return (
                  <DataTable.Row key={result.id}>
                    <DataTable.Cell>{result.attributes.position}</DataTable.Cell>
                    <DataTable.Cell style={{ flex: 5 }}>
                      <View style={styles.riderContainer}>
                        <Flag isoCode={rider.attributes.country.toLowerCase()} size={24} />
                        <Text>{rider.attributes.name}</Text>
                      </View>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>{result.attributes.points}</DataTable.Cell>
                  </DataTable.Row>
                )
              })
            }
        </DataTable>
      </TView>
    </Card>
  )
}

export default function News() {
  const { data, isSuccess, isLoading, refetch } = useGetRacesQuery('')
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {
          data?.data.map((race, index: number) => <Result race={race} key={index} />)
        }
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 10,
    paddingVertical: 20
  },
  riderContainer: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  resultContainer: {
    marginBottom: 30,
  },
  resultHeader: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  }
})
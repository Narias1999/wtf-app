import { StyleSheet, View as TView, ScrollView, SafeAreaView } from 'react-native'
import { Card, Text, Divider, DataTable } from 'react-native-paper';
import DropDown from 'react-native-paper-dropdown';
import Flag from "react-native-country-flag";

import { View } from '../../../components/Themed';

import results from '../../../data/results.json';
import { useMemo, useState } from 'react';

interface IndividualResult {
  type: string;
  name: string,
}
interface Result {
  name: string,
  country: string,
  category: string;
  results: IndividualResult[]
}

interface StageSelectorProps {
  results: IndividualResult[];
  stage: number;
  setStage: (stage: number) => void
}

function StageSelector({ results, stage, setStage }: StageSelectorProps) {
  const [showDropDown, setShowDropDown] = useState(false);
  const list = useMemo(() => results.map((result: IndividualResult, index: number) => {
    let label = '';

    switch (result.type) {
      case 'stage':
        label = `Stage ${index + 1}`;
        break;
      case 'gc':
        label = 'GC';
        break;
      case 'mountain':
        label = 'Mountains';
        break;
      case 'sprints':
        label = 'Sprints';
        break;
    }

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

function Result({ result }: { result: Result }) {
  const raceType = Number(result.category.split('.')[0]);
  const [stage, setStage] = useState(0);
  return (
    <Card style={styles.resultContainer}>
      <TView style={styles.resultHeader}>
        <TView style={styles.resultTitle}>
          <Flag isoCode={result.country.toLowerCase()} size={24} />
          <Text>{result.name}</Text>
        </TView>
        {
          raceType === 2 && (
            <StageSelector results={result.results} stage={stage} setStage={setStage} />
          )
        }
      </TView>
      <Divider />
      <TView>
        <DataTable>
            {
              result.results[stage].results.map((rider: any, index: number) => (
                <DataTable.Row key={rider.name}>
                  <DataTable.Cell>{index+1}</DataTable.Cell>
                  <DataTable.Cell style={{ flex: 5 }}>
                    <View style={styles.riderContainer}>
                      <Flag isoCode={rider.country.toLowerCase()} size={24} />
                      <Text>{rider.name}</Text>
                    </View>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>{rider.points}</DataTable.Cell>
                </DataTable.Row>
              ))
            }
        </DataTable>
      </TView>
    </Card>
  )
}

export default function News() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {
          results.map((result: Result, index: number) => <Result result={result} key={index} />)
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
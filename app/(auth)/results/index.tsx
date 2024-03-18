import { ActivityIndicator, Card, DataTable, Divider } from "react-native-paper";
import { useGetRacesQuery } from "../../../api/races";
import { View, Text } from "../../../components/Themed";
import { ScrollView } from "react-native";
import { useState } from "react";
import DropDown from "react-native-paper-dropdown";
import { useRouter } from "expo-router";

export default function Results() {
  const router = useRouter();
  const { data, isSuccess, isLoading, refetch } = useGetRacesQuery('')
  const [ showDropDown, setShowDropDown ] = useState(false)
  const [ race, setRace ] = useState(0)

  if(isLoading && !data) {
    return <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <ActivityIndicator />
    </View>
  }
  return <ScrollView>
    <Card style={{ padding: 20 }}>
      <View>
        <DropDown
          label={"Stage"}
          mode={"outlined"}
          visible={showDropDown}
          showDropDown={() => setShowDropDown(true)}
          onDismiss={() => setShowDropDown(false)}
          value={race}
          setValue={setRace}
          list={data?.data.map((item, idx) => ({
            label: item.attributes.Name,
            value: idx
          })) ?? []}
        />
      </View>
      <Divider />
      <View>
        <DataTable>
            <DataTable.Header>
              <DataTable.Title>number</DataTable.Title>
              <DataTable.Title>distance</DataTable.Title>
              <DataTable.Title>terrain</DataTable.Title>
            </DataTable.Header>
            {
              data?.data[race].attributes.stages.data.map((stage) => (
                <DataTable.Row key={stage.id} onPress={()=>router.replace(`/results/stage/${stage.id}`)}>
                  <DataTable.Cell>
                      <Text>{stage.attributes.number}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                      <Text>{stage.attributes.distance}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                      <Text>{stage.attributes.terrain}</Text>
                  </DataTable.Cell>
                </DataTable.Row>
              ))
            }
        </DataTable>
      </View>
    </Card>
  </ScrollView>
}
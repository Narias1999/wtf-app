import { ActivityIndicator, DataTable, Divider } from "react-native-paper";
import { useGetRacesQuery } from "../../api/races";
import { View, Text } from "../../components/Themed";
import { ScrollView } from "react-native";
import { useState } from "react";
import DropDown from "react-native-paper-dropdown";
import { useRouter } from "expo-router";
import Flag from "react-native-country-flag";

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
  return <View style={{ flex: 1 }}>
    <ScrollView style={{paddingHorizontal: 10, paddingVertical: 10  }}>
      <View>
        <DropDown
          label={"Race"}
          mode={"outlined"}
          visible={showDropDown}
          showDropDown={() => setShowDropDown(true)}
          onDismiss={() => setShowDropDown(false)}
          value={race}
          setValue={setRace}
          list={data?.data.map((item, idx) => ({
            label: item.attributes.Name,
            value: idx,
            custom: <View style={{ flexDirection: 'row' }}>
              <Flag isoCode={item.attributes.location.toLowerCase()} size={24}/>
              <Text style={{ marginLeft: 10 }}>{item.attributes.Name}</Text>
            </View>
          })) ?? []}
        />
      </View>
      <Divider />
      <View style={{ marginTop: 20 }}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Number</DataTable.Title>
            <DataTable.Title>Distance</DataTable.Title>
            <DataTable.Title style={{ flex: 2 }}>Location</DataTable.Title>
          </DataTable.Header>
          {
            data?.data?.[race]?.attributes?.stages?.data?.map((stage) => (
              <DataTable.Row key={stage.id} onPress={()=>router.replace(`/results/stage/${stage.id}`)}>
                <DataTable.Cell>
                    <Text>{stage.attributes.number}</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                    <Text>{stage.attributes.distance}</Text>
                </DataTable.Cell>
                <DataTable.Cell style={{ flex: 2 }}>
                    <Text>{stage.attributes.start_location} - {stage.attributes.end_location}</Text>
                </DataTable.Cell>
              </DataTable.Row>
            ))
          }
        </DataTable>
      </View>
    </ScrollView>
  </View>
}
import { ActivityIndicator, Button, Card, DataTable, TextInput, useTheme } from "react-native-paper";
import { useGetRacesQuery } from "../../../../api/races";
import { Text } from "../../../../components/Themed";
import { View, ScrollView, useColorScheme } from "react-native";
import AutocompleteRiders from "../../../../components/AutocompleteRiders";
import { useEffect, useMemo, useState } from "react";
import { Rider } from "../../../../api/rooms";
import Colors from "../../../../constants/Colors";
import { Result, useCreateResultMutation } from "../../../../api/results";
import DropDown from "react-native-paper-dropdown";
import { useRoute } from "@react-navigation/native";
import { useGetStageQuery } from "../../../../api/stages";
import Flag from "react-native-country-flag";

export default function Results() {
  const route = useRoute()
  const { data, isSuccess, isLoading, refetch, status } = useGetStageQuery(route.params?.id)
  const [setResult, { isLoading: loadingSubmit } ] = useCreateResultMutation()
  const theme = useTheme();
  const [ resultData, setResultData, ] = useState<{rider?: Rider, position: string}>({rider: undefined, position: ''})
  const sortedResults = useMemo(()=> {
    if(!data?.data?.attributes?.results?.data?.length) return []
    const newResults: Result[] = JSON.parse(JSON.stringify(data?.data?.attributes?.results?.data))
    newResults.sort((a, b)=> a.attributes.position - b.attributes.position)
    return newResults
  }, [data])
  const handleSubmit = async () => {
    if(!resultData.position || !resultData.rider) return
    const result = await setResult({
      position: resultData.position,
      rider: resultData.rider.id,
      stage: route.params?.id
    })
    refetch()
  }

  if((isLoading || status === 'pending') && (!data || data?.data?.id != route.params?.id)) {
    return <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <ActivityIndicator />
    </View>
  }
  return <Card mode="elevated" style={{ margin: 20 }} contentStyle={{ padding: 10 }}>
    <Card.Title titleVariant="titleLarge" title={`${data?.data.attributes.race.data.attributes.Name}: Stage ${data?.data.attributes.number}`}/>
    <View style={{ zIndex: 10 }}>
      <View style={{flexDirection: 'row',  marginVertical: 10, zIndex: 1000}}>
        <AutocompleteRiders
          style={{flex:1, marginRight: 10}}
          saveSelection
          onSelect={(rider)=> setResultData({...resultData, rider})}/>
        <TextInput style={{ height:40}} placeholder="Position" value={resultData.position} onChangeText={(value) => setResultData({...resultData, position: value})} />
      </View>
      <Button style={{ borderRadius: 10, marginLeft: 10, zIndex: -2 }} mode="contained" compact onPress={handleSubmit} loading={isLoading || loadingSubmit || status === 'pending'}>Submit</Button>
    </View>
    <View style={{ marginTop: 10, backgroundColor: 'white' }}>
      <ScrollView>
        <DataTable>
            <DataTable.Header>
              <DataTable.Title>Position</DataTable.Title>
              <DataTable.Title style={{ flex: 2}}>Rider</DataTable.Title>
              <DataTable.Title style={{ justifyContent: 'flex-end' }}>Points</DataTable.Title>
            </DataTable.Header>
            {
              sortedResults.map((result) => {
                const rider = result.attributes.rider.data.attributes
                return (
                  <DataTable.Row key={result.id}>
                    <DataTable.Cell>
                        <Text>{result.attributes.position}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 2 }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Flag isoCode={rider.country.toLowerCase()} size={24} style={{ marginRight: 10 }}/>
                        <Text>{rider.name}</Text>
                      </View>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                        <Text>{result.attributes.points}</Text>
                    </DataTable.Cell>
                  </DataTable.Row>
                )
              })
            }
        </DataTable>
      </ScrollView>
    </View>
  </Card>
}
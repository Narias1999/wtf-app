import { Button, List, TextInput, useTheme } from "react-native-paper";
import { useGetRacesQuery } from "../../api/races";
import { View, Text } from "../../components/Themed";
import { ScrollView, useColorScheme } from "react-native";
import AutocompleteRiders from "../../components/AutocompleteRiders";
import { useState } from "react";
import { Rider } from "../../api/rooms";
import Colors from "../../constants/Colors";
import { useCreateResultMutation } from "../../api/results";

export default function Results() {
  const { data, isSuccess, isLoading, refetch } = useGetRacesQuery('')
  const [setResult ] = useCreateResultMutation()
  const theme = useTheme();
  const [ resultData, setResultData ] = useState<{rider?: Rider, position: string}>({rider: undefined, position: ''})
  const handleSubmit = async (stageId: number) => {
    if(!resultData.position || !resultData.rider) return
    await setResult({
      position: resultData.position,
      rider: resultData.rider.id,
      stage: stageId
    })
    refetch()
  }
  return <ScrollView>
      <List.Section>
        <List.AccordionGroup>
          {data?.data.map((race) =>
            <List.Accordion title={race.attributes.Name} id={race.id}>
              <List.AccordionGroup>
                {race.attributes.stages.data?.map(stage =>
                  <List.Accordion style={{backgroundColor: theme.colors.inverseOnSurface}} id={stage.id} title={`${stage.attributes.start_location} - ${stage.attributes.end_location}`}>
                    <List.Item title={<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent:'space-between',  width:'100%', maxWidth:600}}>
                      <AutocompleteRiders onSelect={(value) => setResultData({...resultData, rider: value})}/>
                      <TextInput style={{ height: 45}} placeholder="Position" keyboardType="numeric" onChangeText={value => setResultData({...resultData, position: value})}/>
                      <Button mode="contained" onPress={()=> handleSubmit(stage.id)}>Submit</Button>
                    </View>}/>
                    {stage.attributes.results?.data.map(result => <List.Item title={`{}`}/>)}
                  </List.Accordion>
                )}
              </List.AccordionGroup>
            </List.Accordion>
          )}
        </List.AccordionGroup>
    </List.Section>
  </ScrollView>
}
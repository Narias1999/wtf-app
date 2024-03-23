import { useMemo, useState } from "react";
import {
  StyleProp,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import {
  Text,
} from "react-native-paper";

import Flag from "react-native-country-flag";
import AutocompleteInput from "react-native-autocomplete-input";

import { View } from "./Themed";
import { useGetAllRidersQuery } from "../api/riders";
import { Rider } from "../api/rooms";

interface Props {
  onSelect: (rider: Rider)=>void,
  saveSelection?: boolean,
  style?: StyleProp<ViewStyle>
}

export default function AutocompleteRiders ({ onSelect, saveSelection, style }: Props) {
  const [riderQuery, setRiderQuery] = useState("");
  const [hideResults, setHideResults] = useState(false)
  const { data: ridersList } = useGetAllRidersQuery('');
  const filteredRidersList = useMemo(() => {
    const items = ridersList?.data
      ? ridersList.data.map((rider) => ({ ...rider.attributes, id: rider.id }))
      : [];
    return items.filter((item) =>
      item.name.toLowerCase().includes(riderQuery.toLowerCase())
    );
  }, [ridersList, riderQuery]);

  return (
    <View style={[{ zIndex: 10 }, style]}>
      <AutocompleteInput
        data={filteredRidersList}
        value={riderQuery}
        containerStyle={{ zIndex: 5000 }}
        hideResults={riderQuery.length < 1 || hideResults}
        placeholder="Rider"
        onChangeText={(value)=>{
          setRiderQuery(value)
          setHideResults(false)
        }}
        flatListProps={{
          keyExtractor: (item) => item.name,
          style: {maxHeight: 300, zIndex: 5000},
          renderItem: ({ item }) => (
            <TouchableOpacity onPress={() => {
              onSelect(item)
              if(saveSelection) {
                setRiderQuery(item.name)
                setHideResults(true)
              } else {
                setRiderQuery('')
              }
            }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "white",
                  paddingVertical: 6,
                  gap: 10,
                  padding: 10,
                  zIndex: 500,
                  maxHeight: 200
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
  )
}
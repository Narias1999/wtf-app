import { useMemo, useState } from "react";
import {
  TouchableOpacity,
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
  onSelect: (rider: Rider)=>void
}

export default function AutocompleteRiders ({ onSelect }: Props) {
  const [riderQuery, setRiderQuery] = useState("");
  const { data: ridersList } = useGetAllRidersQuery('', {
    skip: true
  });
  const filteredRidersList = useMemo(() => {
    const items = ridersList?.data
      ? ridersList.data.map((rider) => ({ ...rider.attributes, id: rider.id }))
      : [];
    return items.filter((item) =>
      item.name.toLowerCase().includes(riderQuery.toLowerCase())
    );
  }, [, riderQuery]);

  return (
    <AutocompleteInput
      data={filteredRidersList}
      value={riderQuery}
      hideResults={riderQuery.length < 1}
      placeholder="Rider"
      onChangeText={setRiderQuery}
      flatListProps={{
        style: { maxHeight: 200, zIndex: 500 },
        keyExtractor: (item) => item.name,
        renderItem: ({ item }) => (
          <TouchableOpacity onPress={() => onSelect(item)}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "white",
                paddingVertical: 6,
                gap: 10,
                padding: 10,
                zIndex: 50
              }}
            >
              <Flag isoCode={item.country.toLowerCase()} size={24} />
              <Text>{item.name}</Text>
            </View>
          </TouchableOpacity>
        ),
      }}
    />
  )
}
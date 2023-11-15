import { ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { Button, Chip, Divider, Surface, Switch, Text } from 'react-native-paper';
import Flag from 'react-native-flags';
import { View } from '../../components/Themed';
import MembersInvite from '../../components/MemersInvite';
import { useState } from 'react';
import Colors from '../../constants/Colors';

import roomData from '../../data/mockRoomData.json';
import { useRouter } from 'expo-router';

interface Cyclist {
  name: string;
  country: string;
}

interface Team {
  owner: string;
  team: Cyclist[];
  ready: boolean;
}

const RivalTeam = ({ owner, team, ready }: Team) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Surface elevation={1} style={[styles.teamSurface]}>
      <View style={styles.teamContainer}>
        <Text variant="titleMedium">{owner}</Text>

        {
          !ready && (
            <Text variant="titleSmall" style={{ color: colors.error }}>Not Ready</Text>
          )
        }
      </View>
      <Divider style={{ marginBottom: 20 }} />
      <View style={{ backgroundColor: 'transparent', alignItems: 'flex-start', gap: 10 }}>
        {
          team.map((cyclist: Cyclist) => (
            <Chip avatar={<Flag
            
              code={cyclist.country}
              size={32}
            />} key={cyclist.name}>{cyclist.name}</Chip>
          ))
        }
      </View>
    </Surface>
  )
};

export default function TeamSelection() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [ready, setReady] = useState(false);
  const colors = Colors[colorScheme ?? 'light'];

  const startSeason = () => {
    router.push('/leaderboard');
  }

  return (
    <View style={{ paddingTop: 20, paddingHorizontal: 20, flex: 1 }}>
      <Text variant="titleLarge" style={{ marginBottom: 10 }}>Choose Your team</Text>
      <MembersInvite />
      <View style={styles.readyCheckbox}>
        <Text variant="titleMedium">Ready</Text>
        <Switch value={ready} onValueChange={() => setReady(!ready)} color={colors.success} />
      </View>
      <Divider style={{ marginVertical: 30 }} />
      <View style={{ flex: 1 }}>
        <Text variant="titleLarge" style={{ marginBottom: 10, textAlign: 'center' }}>Managers</Text>

        <ScrollView>
          <View style={{ paddingBottom: 20, paddingHorizontal: 10 }}>
            {
              roomData.teams.map((team: Team) => (
                <RivalTeam key={team.owner} owner={team.owner} team={team.team} ready={team.ready} />
              ))
            }
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={startSeason}>Start Season</Button>
        </View>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  readyCheckbox: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10
  },
  teamSurface: {
    marginVertical: 15,
    marginHorizontal: 3, 
    padding: 12,
    borderRadius: 10 
  },
  teamContainer: {
    backgroundColor: 'transparent',
    padding: 5,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  buttonContainer: {
    paddingBottom: 30,
  }
})
import { StyleSheet, TouchableOpacity, View as NativeView } from "react-native";
import { Button, Card, Text, Icon, useTheme } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";

import { View } from "../../components/Themed";

import {
  selectInvitations,
  setInvitations,
} from "../../store/features/inivitations";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { Invitation, useUpdateInvitationMutation } from "../../api/invitations";
import { isLoading } from "expo-font";

const EmptyState = () => (
  <View style={styles.emptyStateContainer}>
    <Icon source="bell" size={250} color="#FFF3" />
    <Text variant="titleMedium">You Don't have notifications</Text>
  </View>
);

type changeInvitation = (value: boolean, id: number) => void;

interface invitationCardProps {
  invitation: Invitation;
  onChangeInvitation: changeInvitation;
  isLoading: boolean;
}

const InvitationCard = ({
  invitation,
  onChangeInvitation,
  isLoading
}: invitationCardProps) => {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={styles.card}>
      <Card>
        <Card.Content>
          <NativeView style={styles.cardTitle}>
            <Text variant="titleLarge">{invitation.room.name}</Text>
            <Text variant="titleLarge">
              {invitation.room.user_admin?.username}
            </Text>
          </NativeView>
        </Card.Content>
        <Card.Actions>
          <NativeView style={styles.cardActions}>
            <Button
              loading={isLoading}
              buttonColor={theme.colors.inversePrimary}
              onPress={() => onChangeInvitation(true, invitation.id)}
            >
             {!isLoading && "Accept"}
            </Button>
            <Button
              loading={isLoading}
              buttonColor={theme.colors.inversePrimary}
              onPress={() => onChangeInvitation(false, invitation.id)}
            >
              {!isLoading && "Cancel"}
            </Button>
          </NativeView>
        </Card.Actions>
      </Card>
    </View>
  );
};

export default function Invitations() {
  const [updateInvitation, { isLoading }] = useUpdateInvitationMutation();
  const invitations = useSelector(selectInvitations);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleChangeInvitation: changeInvitation = async (accept, id) => {
    await updateInvitation({ id, accept });
    const invitationIndex = invitations.findIndex(
      (invitation) => invitation.id === id
    );
    let newInvitations = JSON.parse(JSON.stringify(invitations));
    const invitation: Invitation[] = newInvitations.slice(invitationIndex, 1);
    dispatch(setInvitations(newInvitations));
    if (accept) {
      router.push(`/teamSelection/${invitation[0].room.id}`);
    }
  };

  if (invitations?.length) {
    return (
      <View style={{ padding: 10, position: "relative", flex: 1 }}>
        <View style={styles.titleContainer}>
          <Text variant="titleLarge">Invitations</Text>
        </View>
        <View style={styles.cardsContainer}>
          <ScrollView style={{ flex: 1 }}>
            {invitations.map((invitation) => (
              <InvitationCard
                key={invitation.id}
                invitation={invitation}
                onChangeInvitation={handleChangeInvitation}
                isLoading={isLoading}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }
  return <EmptyState />;
}

const styles = StyleSheet.create({
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noRoomsText: {
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  cardsContainer: {
    flex: 1,
  },
  card: {
    marginBottom: 15,
  },
  cardActions: {
    width: 150,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  membersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  member: {
    paddingRight: 10,
    paddingTop: 10,
  },
  fab: {
    position: "absolute",
    margin: 30,
    right: 0,
    bottom: 0,
  },
});

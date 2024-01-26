import { StyleSheet, View as NativeView } from "react-native";
import { Button, Card, Text, Icon, useTheme } from "react-native-paper";

import { View } from "../../components/Themed";

import { useRouter } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { Invitation, useGetMyInvitationsQuery, useUpdateInvitationMutation } from "../../api/invitations";
import { useGetMyRoomsQuery } from "../../api/rooms";

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
  const { data: invitations, refetch } = useGetMyInvitationsQuery('');
  const { refetch: refetchRooms } = useGetMyRoomsQuery('');

  const router = useRouter();

  const handleChangeInvitation: changeInvitation = async (accept, id) => {
    if (!invitations) return;
    await updateInvitation({ id, accept });
    const invitation = invitations.data.find((invitation) => invitation.id === id);
    if (accept && invitation) {
      router.push(`/teamSelection/${invitation.room.id}`);
    }
    await refetch();
    await refetchRooms();
  };

  if (invitations?.data?.length) {
    return (
      <View style={{ padding: 10, position: "relative", flex: 1 }}>
        <View style={styles.titleContainer}>
          <Text variant="titleLarge">Invitations</Text>
        </View>
        <View style={styles.cardsContainer}>
          <ScrollView style={{ flex: 1 }}>
            {invitations.data.map((invitation) => (
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
    paddingBottom: 50
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

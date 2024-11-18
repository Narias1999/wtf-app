import { Portal, Dialog, Text, Button, Card, List, DataTable } from 'react-native-paper';
import { ScrollView, StyleSheet, View } from 'react-native';

interface InfoDialogProps {
  visible: boolean;
  hideDialog: () => void;
  type?: 'auction' | 'budget';
}

export default function InfoDialog({ visible, hideDialog, type }: InfoDialogProps) {
  const auctionContent = (
    <>
      <Text variant="titleMedium" style={styles.sectionTitle}>Auction Model Rules</Text>
      
      <View>
        <Text variant="titleLarge" style={styles.mainTitle}>The Auction Model in World Tour Fantasy</Text>
        <Text style={styles.subtitle}>A dynamic way to build your cycling team. Here's how it works:</Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>Starting Your Budget</Text>
        <Text style={styles.paragraph}>
          Each manager kicks off the auction with a budget of <Text style={styles.highlight}>30 million dollars</Text>. This budget will be used strategically to bid on riders throughout the auction process.
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>The Auction Process</Text>
        <Text style={styles.paragraph}>The auction can happen in two ways:</Text>
        
        <Card style={styles.card}>
          <Card.Title title="Live Auction" />
          <Card.Content>
            <Text>
              In this format, the auction takes place outside the app, where managers gather (physically or virtually) and bid in real-time. Afterward, an admin uploads the final teams into the app, updating each manager's roster and remaining budget.
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="In-App Auction" />
          <Card.Content>
            <Text>
              In this mode, the app itself runs the auction. A rider is randomly highlighted each day, and managers have a 24-hour window to bid on that rider or pass. Bidding is competitive, with a <Text style={styles.highlight}>minimum bid of 0.5 million</Text> per rider. At the end of the bidding period, the highest bidder wins the rider, and the app then highlights a new rider for the next round of bidding.
            </Text>
          </Card.Content>
        </Card>

        <Text variant="titleMedium" style={styles.sectionTitle}>Selecting Your Riders</Text>
        <Text style={styles.paragraph}>The total pool of riders varies depending on the number of managers:</Text>
        
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Managers</DataTable.Title>
            <DataTable.Title numeric>Riders in Pool</DataTable.Title>
          </DataTable.Header>
          <DataTable.Row>
            <DataTable.Cell>4 managers</DataTable.Cell>
            <DataTable.Cell numeric>35 riders</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>5 managers</DataTable.Cell>
            <DataTable.Cell numeric>45 riders</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>6 managers</DataTable.Cell>
            <DataTable.Cell numeric>55 riders</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>7 managers</DataTable.Cell>
            <DataTable.Cell numeric>65 riders</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>8 managers</DataTable.Cell>
            <DataTable.Cell numeric>75 riders</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>9 managers</DataTable.Cell>
            <DataTable.Cell numeric>85 riders</DataTable.Cell>
          </DataTable.Row>
          <DataTable.Row>
            <DataTable.Cell>10 managers</DataTable.Cell>
            <DataTable.Cell numeric>95 riders</DataTable.Cell>
          </DataTable.Row>
        </DataTable>

        <Text style={styles.paragraph}>
          In all cases, an additional <Text style={styles.highlight}>10 wild card riders</Text> are included, giving managers extra choices outside the primary selection list.
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>Building Your Team</Text>
        <Text style={styles.paragraph}>
          By the end of the auction, each manager will have a unique lineup of riders. The goal is to assemble a team of <Text style={styles.highlight}>7 to 12 riders</Text> on average, depending on your bidding strategy and budget. Throughout the cycling season, your riders will earn points based on their performance in various races, with higher-ranked races like the Tour de France yielding more points.
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>Tips for Auction Success</Text>
        <List.Section>
          <List.Item
            title="Know Your Riders"
            description="Familiarize yourself with top riders and wild cards, so you can decide who's worth your budget."
            left={props => <List.Icon {...props} icon="account-group" />}
          />
          <List.Item
            title="Balance Your Budget"
            description="Aim to save some budget for high-value riders but don't miss out on hidden gems among lower-cost riders."
            left={props => <List.Icon {...props} icon="cash" />}
          />
          <List.Item
            title="Track Competitors"
            description="Observing other managers' bids can give you insight into their strategies and help you adjust your bids accordingly."
            left={props => <List.Icon {...props} icon="eye" />}
          />
        </List.Section>

        <Text style={[styles.paragraph, styles.conclusion]}>
          The Auction Model creates a competitive and strategic experience, making each season unique and engaging. As you bid, remember that every dollar and rider selection can make a difference in your journey to victory!
        </Text>
      </View>

    </>
  );

  const budgetContent = (
    <>
      <View>
        <Text style={styles.paragraph}>
          The Budget Model in World Tour Fantasy gives each manager a set budget to carefully build their team for the cycling season. Here's a step-by-step guide to how it works:
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>Setting Your Budget</Text>
        <Text style={styles.paragraph}>
          Every manager begins with <Text style={styles.highlight}>30 million dollars</Text> to assemble their team. The budget is critical, as each rider has a unique cost based on their ranking and potential points value.
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>Choosing Your Riders</Text>
        <Text style={styles.paragraph}>
          In the Budget Model, managers select riders from a <Text style={styles.highlight}>predefined pool</Text>. The riders are priced according to their performance, with values ranging from <Text style={styles.highlight}>0.5 million to 15 million</Text>. This system allows managers to mix top-tier, mid-level, and budget riders while staying within their allocated funds.
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>Building Your Team</Text>
        <Text style={styles.paragraph}>
          Within the constraints of the 30-million budget, managers can pick the riders who will maximize their chances of scoring points. Managers can strategize by:
        </Text>
        <List.Section>
          <List.Item
            title="Picking a few high-cost riders who score in major races"
            left={props => <List.Icon {...props} icon="star" />}
          />
          <List.Item
            title="Adding several mid-to-low-cost riders to create a balanced lineup"
            left={props => <List.Icon {...props} icon="scale-balance" />}
          />
        </List.Section>

        <Text style={styles.paragraph}>
          Each manager's team may end up looking similar if they select the same riders, but the choices in lineup balance and rider distribution often bring unique combinations.
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>Earning Points Throughout the Season</Text>
        <Text style={styles.paragraph}>
          As the cycling season progresses, your riders accumulate points based on their race performance. Higher-ranked races yield more points, so managers must consider not just individual rider strengths but also their race schedules and potential point contributions.
        </Text>

        <Text variant="titleMedium" style={styles.sectionTitle}>Tips for Budget Model Success</Text>
        <List.Section>
          <List.Item
            title="Plan Ahead"
            description="Consider each rider's race schedule and their points potential in key events"
            left={props => <List.Icon {...props} icon="calendar" />}
          />
          <List.Item
            title="Budget Wisely"
            description="Avoid overspending on one or two riders, which could leave your team vulnerable"
            left={props => <List.Icon {...props} icon="cash" />}
          />
          <List.Item
            title="Monitor Competitors"
            description="Observing other managers' choices can help you identify unique strategies or spot valuable riders others may overlook"
            left={props => <List.Icon {...props} icon="eye" />}
          />
        </List.Section>

        <Text style={[styles.paragraph, styles.conclusion]}>
          The Budget Model emphasizes strategic financial management and smart selection, allowing managers to create a well-rounded team that competes throughout the cycling season.
        </Text>
      </View>

    </>
  );

  const title = type === 'auction' ? 'How the Auction Model Works' : 'How the Budget Model Works';

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.ScrollArea style={styles.scrollArea}>
          <ScrollView>
            {type === 'auction' ? auctionContent : budgetContent}
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Close</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  scrollArea: {
    paddingHorizontal: 20,
    maxHeight: 400
  },
  sectionTitle: {
    marginBottom: 10
  },
  paragraph: {
    marginBottom: 15,
    lineHeight: 20
  },
  mainTitle: {
    marginBottom: 10
  },
  subtitle: {
    marginBottom: 10
  },
  highlight: {
  },
  conclusion: {
    marginTop: 20
  },
  card: {
    marginBottom: 15
  }
});



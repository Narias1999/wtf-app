import { useState } from "react";
import { StyleSheet, View } from "react-native"
import { Chip, IconButton, TextInput } from "react-native-paper";


export default function MembersInvite() {
  const [emails, setEmails] = useState<string[]>([]);
  const [email, setEmail] = useState('');

  const handleAddMember = () => {
    if (!emails.includes(email)) {
      setEmails([...emails, email]);
    }
    setEmail('');
  }

  const removeMember = (email: string) => {
    setEmails(emails.filter(e => e !== email));
  }

  return (
    <View>
      {
        emails.length > 0 && (
          <View style={styles.membersChipsContainer}>
            {
              emails.map(email => (
                <Chip style={styles.emailItem} key={email} onClose={() => removeMember(email)}>{email}</Chip>
              ))
            }
          </View>
        )
      }
      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          value={email}
          label="Username"
          onChangeText={(text) => setEmail(text)}
          style={{ flex: 1, marginRight: 10 }}
        />
        <IconButton mode="contained"  icon="plus" onPress={handleAddMember} />
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  membersChipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  emailItem: {
    marginRight: 10,
    marginBottom: 10,
  }
});
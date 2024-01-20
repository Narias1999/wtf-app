import { useState } from "react";
import { StyleSheet, View } from "react-native"
import { Chip, IconButton, TextInput } from "react-native-paper";

type Props = {
  value: string[],
  onChange: (value: string[]) => void,
}


export default function MembersInvite({value, onChange}: Props) {
  const [email, setEmail] = useState('');

  const handleAddMember = () => {
    if (!value.includes(email)) {
      onChange([...value, email]);
    }
    setEmail('');
  }

  const removeMember = (email: string) => {
    onChange(value.filter(e => e !== email));
  }

  return (
    <View>
      {
        value.length > 0 && (
          <View style={styles.membersChipsContainer}>
            {
              value.map(email => (
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
          label="Email"
          keyboardType="email-address"
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
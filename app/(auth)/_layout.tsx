import { StyleSheet, useColorScheme } from "react-native";
import { Redirect, Stack, Tabs, router } from "expo-router";
import { Icon } from "react-native-paper";
import { IconButton, Text, useTheme } from "react-native-paper";
import { useSelector, useDispatch } from "react-redux";
import { useRoute } from "@react-navigation/native";

import { logout, selectUser } from "../../store/features/auth";
import { useGetMyInvitationsQuery } from "../../api/invitations";
import Colors from "../../constants/Colors";
import { View } from "../../components/Themed";
import { useEffect } from "react";

export default function Layout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const theme = useTheme();
  const dispatch = useDispatch();
  const route = useRoute();
  const user = useSelector(selectUser);
  const {
    data: invitations,
    refetch,
    error,
  } = useGetMyInvitationsQuery("", {
    skip: !user?.email,
  });

  useEffect(() => {
    if (!user) {
      // router.replace("/login");
    } else if (user?.email) {
      const interval = setInterval(() => {
        refetch();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [user?.email]);

  useEffect(() => {
    if (error?.status === 401 && user) {
      dispatch(logout());
    }
  }, [error, user]);

  const getConfig = (title: string, icon: string) =>
    ({
      tabBarLabel: title,
      tabBarIcon: ({ focused, size }: { focused: boolean; size: number }) => (
        <Icon
          color={focused ? colors.primary : colors.text}
          source={icon}
          size={size}
        />
      ),
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.text,
    } as any);

  if (!user) {
    return <Redirect href="/login" />;
  }

  const colorStyle = { color: theme.colors.inversePrimary };

  const headerOptions = {
    headerShown: true,
    headerStyle: {
      backgroundColor: theme.colors.primary,
    },
    headerBackTitleVisible: false,
    headerLeft: () => (
      <View style={styles.notificationsContainer}>
        <IconButton
          icon="home"
          iconColor={theme.colors.inversePrimary}
          size={20}
          onPress={async () => {
            router.push("/");
          }}
        />
      </View>
    ),
    headerRight: () => (
      <View style={styles.notificationsContainer}>
        <IconButton
          icon="bell"
          iconColor={theme.colors.inversePrimary}
          size={20}
          onPress={() => router.push("/invitations")}
        />
        {!!invitations?.data?.length && (
          <Text variant="labelSmall" style={styles.notificationsCount}>
            {invitations.data.length}
          </Text>
        )}
      </View>
    ),
    headerTitle: () => (
      <Text variant="titleMedium" style={colorStyle}>
        WTF
      </Text>
    ),
  };

  if (route.params?.screen === "(season)/[id]") {
    return (
      <Stack screenOptions={headerOptions}>
        <Stack.Screen name="(season)/[id]" />
      </Stack>
    );
  }

  return (
    <Tabs screenOptions={headerOptions}>
      <Tabs.Screen name="index" options={getConfig("Seasons", "home")} />
      <Tabs.Screen name="profile" options={getConfig("Profile", "account")} />
      <Tabs.Screen
        name="(season)"
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen name="newRoom" options={{ tabBarButton: () => null }} />
      <Tabs.Screen
        name="teamSelection/[id]"
        options={{ tabBarButton: () => null }}
      />
      <Tabs.Screen name="invitations" options={{ tabBarButton: () => null }} />
      <Tabs.Screen
        name="results/stage/[id]"
        options={{ tabBarButton: () => null }}
      />
      <Tabs.Screen
        name="results"
        options={
          user?.role?.type === "admin" ? getConfig("Results", "counter") : {}
        }
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  notificationsCount: {
    backgroundColor: "red",
    width: 15,
    height: 15,
    right: 10,
    top: 10,
    textAlign: "center",
    position: "absolute",
    borderRadius: 15,
  },
  notificationsContainer: {
    backgroundColor: "transparent",
  },
});

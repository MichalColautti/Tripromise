import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts } from "../constants/theme";

const tabs = {
  Start: {
    label: "Start",
    icon: "home-outline",
    activeIcon: "home",
  },
  Trips: {
    label: "Trips",
    icon: "map-outline",
    activeIcon: "map",
  },
  Create: {
    label: "Create",
    icon: "add-circle-outline",
    activeIcon: "add-circle",
  },
  Chats: {
    label: "Chats",
    icon: "chatbubbles-outline",
    activeIcon: "chatbubbles",
  },
  Profile: {
    label: "Profile",
    icon: "person-outline",
    activeIcon: "person",
  },
};

export default function BottomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const activeRoute = state.routes[state.index];

  if (activeRoute?.params?.hideTabBar) return null;

  return (
    <View
      style={[styles.container, { paddingBottom: Math.max(insets.bottom, 10) }]}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const tab = tabs[route.name];

        if (!tab) return null;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: isFocused }}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}
          >
            {route.name === "Create" ? (
              <View style={styles.createButton}>
                <Ionicons name="add" size={28} color="#FFFFFF" />
              </View>
            ) : (
              <Ionicons
                name={isFocused ? tab.activeIcon : tab.icon}
                size={24}
                color={isFocused ? colors.primary : colors.textMuted}
              />
            )}

            <Text style={[styles.label, isFocused && styles.activeLabel]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    paddingHorizontal: 8,
  },

  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 2,
  },

  label: {
    fontFamily: fonts.medium,
    fontSize: 10,
    color: colors.textMuted,
  },

  activeLabel: {
    fontFamily: fonts.semiBold,
    color: colors.primary,
  },
  createButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});

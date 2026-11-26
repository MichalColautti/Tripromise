import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, fonts } from "../constants/theme";

const tripChats = [
  {
    id: "amalfi",
    name: "Amalfi Coast Crew",
    details: "6 travelers · Italy",
    preview: "Maya: Boat tour for Saturday?",
    time: "10:42",
    unread: 2,
  },
  {
    id: "lisbon",
    name: "Lisbon Weekend",
    details: "4 travelers · Portugal",
    preview: "You: Added sunset photos from our walk",
    time: "Yesterday",
    unread: 1,
  },
  {
    id: "dolomites",
    name: "Dolomites Hiking",
    details: "5 travelers · Italy",
    preview: "Luca: Trail weather looks perfect!",
    time: "Mon",
    unread: 0,
  },
  {
    id: "copenhagen",
    name: "Copenhagen Winter Trip",
    details: "3 travelers · Denmark",
    preview: "Sofia: Dinner booked for 7:30",
    time: "Nov 23",
    unread: 0,
  },
];

const recentConversations = [
  {
    id: "sofia",
    initials: "SR",
    name: "Sofia Rossi",
    preview: "That café looks perfect!",
    time: "2m",
    unread: true,
  },
  {
    id: "lucas",
    initials: "LM",
    name: "Lucas Meyer",
    preview: "I’ll share the route tonight",
    time: "1h",
    unread: false,
  },
];

const otherFriends = [
  { id: "maya", initials: "MP", name: "Maya Patel", location: "Bristol, UK" },
  { id: "theo", initials: "TM", name: "Theo Martin", location: "London, UK" },
];

const tabs = ["Trips", "Friends"];

function TripChatCard({ chat }) {
  return (
    <View style={styles.chatCard}>
      <View style={styles.groupIcon}>
        <Ionicons name="people-outline" size={23} color={colors.link} />
      </View>

      <View style={styles.chatContent}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={styles.chatName}>
            {chat.name}
          </Text>
          <Text style={styles.chatTime}>{chat.time}</Text>
        </View>
        <Text style={styles.chatDetails}>{chat.details}</Text>
        <View style={styles.previewRow}>
          <Text numberOfLines={1} style={styles.chatPreview}>
            {chat.preview}
          </Text>
          {chat.unread > 0 ? (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{chat.unread}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

function FriendAvatar({ initials }) {
  return (
    <View style={styles.friendAvatar}>
      <Text style={styles.friendInitials}>{initials}</Text>
    </View>
  );
}

function RecentConversationCard({ conversation }) {
  return (
    <View style={styles.conversationCard}>
      <FriendAvatar initials={conversation.initials} />
      <View style={styles.conversationContent}>
        <View style={styles.conversationTitleRow}>
          <Text numberOfLines={1} style={styles.friendName}>
            {conversation.name}
          </Text>
          <Text style={styles.friendTime}>{conversation.time}</Text>
        </View>
        <View style={styles.conversationPreviewRow}>
          <Text numberOfLines={1} style={styles.friendPreview}>
            {conversation.preview}
          </Text>
          {conversation.unread ? <View style={styles.unreadDot} /> : null}
        </View>
      </View>
    </View>
  );
}

function OtherFriendCard({ friend }) {
  return (
    <View style={styles.otherFriendCard}>
      <FriendAvatar initials={friend.initials} />
      <View style={styles.otherFriendContent}>
        <Text style={styles.friendName}>{friend.name}</Text>
        <Text style={styles.friendLocation}>{friend.location}</Text>
      </View>
      <View style={styles.messageButton}>
        <Ionicons name="chatbox-outline" size={20} color={colors.link} />
      </View>
    </View>
  );
}

export default function ChatsScreen() {
  const [activeTab, setActiveTab] = useState("Trips");

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.brandHeader}>
        <Text style={styles.brand}>Tripromise</Text>
      </View>

      <View style={styles.screenHeading}>
        <Text style={styles.heading}>Chats</Text>
      </View>

      <View style={styles.tabs} accessibilityRole="tablist">
        {tabs.map((tab) => {
          const selected = activeTab === tab;
          return (
            <Pressable
              key={tab}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, selected && styles.selectedTab]}
            >
              <Text style={[styles.tabLabel, selected && styles.selectedTabLabel]}>
                {tab}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "Trips" ? (
          <>
            <Text style={styles.sectionLabel}>Trip groups</Text>
            <View style={styles.chatList}>
              {tripChats.map((chat) => (
                <TripChatCard key={chat.id} chat={chat} />
              ))}
            </View>
            <View style={styles.infoBanner}>
              <Text style={styles.infoText}>
                Group chats appear automatically when travelers join a trip.
              </Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.requestsBanner}>
              <View style={styles.requestsIcon}>
                <Ionicons name="person-add-outline" size={20} color={colors.link} />
              </View>
              <View style={styles.requestsContent}>
                <Text style={styles.requestsTitle}>Friend requests</Text>
                <Text style={styles.requestsSubtitle}>2 waiting for you</Text>
              </View>
              <View style={styles.requestCount}>
                <Text style={styles.requestCountText}>2</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.link} />
            </View>

            <View style={styles.friendsSection}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.friendsSectionTitle}>Recent conversations</Text>
                <Text style={styles.seeAll}>See all</Text>
              </View>
              <View style={styles.friendsList}>
                {recentConversations.map((conversation) => (
                  <RecentConversationCard
                    key={conversation.id}
                    conversation={conversation}
                  />
                ))}
              </View>
            </View>

            <View style={styles.friendsSection}>
              <Text style={[styles.friendsSectionTitle, styles.otherFriendsTitle]}>
                Other friends
              </Text>
              <View style={styles.friendsList}>
                {otherFriends.map((friend) => (
                  <OtherFriendCard key={friend.id} friend={friend} />
                ))}
              </View>
            </View>

            <View style={styles.addFriendsButton}>
              <Ionicons name="person-add-outline" size={20} color={colors.surface} />
              <Text style={styles.addFriendsLabel}>Add friends</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  brandHeader: {
    alignItems: "center",
    justifyContent: "center",
    height: 42,
  },
  brand: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 24,
    letterSpacing: -0.4,
  },
  screenHeading: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 24,
  },
  heading: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.6,
  },
  tabs: {
    height: 44,
    marginHorizontal: 24,
    padding: 3,
    borderRadius: 15,
    flexDirection: "row",
    backgroundColor: "#E8F1EE",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  selectedTab: {
    backgroundColor: colors.surface,
    shadowColor: "#173D33",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  tabLabel: {
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 13,
  },
  selectedTabLabel: {
    color: colors.text,
    fontFamily: fonts.semiBold,
  },
  list: {
    flex: 1,
    marginTop: 13,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  sectionLabel: {
    marginBottom: 10,
    color: colors.textMuted,
    fontFamily: fonts.medium,
    fontSize: 13,
  },
  chatList: {
    gap: 10,
  },
  chatCard: {
    minHeight: 116,
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 17,
    backgroundColor: colors.surface,
    shadowColor: "#173D33",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.045,
    shadowRadius: 8,
    elevation: 2,
  },
  groupIcon: {
    width: 48,
    height: 48,
    marginTop: 3,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: "#D9EEE8",
  },
  chatContent: {
    flex: 1,
    minWidth: 0,
    marginLeft: 14,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chatName: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
  },
  chatTime: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 16,
  },
  chatDetails: {
    marginTop: 3,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 17,
  },
  previewRow: {
    minHeight: 21,
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  chatPreview: {
    flex: 1,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  unreadBadge: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: colors.link,
  },
  unreadCount: {
    color: colors.surface,
    fontFamily: fonts.semiBold,
    fontSize: 10,
    lineHeight: 13,
  },
  infoBanner: {
    minHeight: 38,
    marginTop: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: "center",
    borderRadius: 13,
    backgroundColor: "#E7F2EE",
  },
  infoText: {
    color: colors.link,
    fontFamily: fonts.medium,
    fontSize: 10,
    lineHeight: 16,
  },
  requestsBanner: {
    minHeight: 62,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "#E8F1EE",
  },
  requestsIcon: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#D9EEE8",
  },
  requestsContent: {
    flex: 1,
    marginLeft: 10,
  },
  requestsTitle: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
  },
  requestsSubtitle: {
    marginTop: 1,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 16,
  },
  requestCount: {
    width: 24,
    height: 24,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.link,
  },
  requestCountText: {
    color: colors.surface,
    fontFamily: fonts.semiBold,
    fontSize: 11,
    lineHeight: 15,
  },
  friendsSection: {
    marginTop: 18,
  },
  sectionTitleRow: {
    minHeight: 20,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  friendsSectionTitle: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 16,
    lineHeight: 20,
  },
  otherFriendsTitle: {
    marginBottom: 8,
  },
  seeAll: {
    color: colors.link,
    fontFamily: fonts.semiBold,
    fontSize: 12,
  },
  friendsList: {
    gap: 8,
  },
  conversationCard: {
    minHeight: 60,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: colors.surface,
    shadowColor: "#173D33",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  friendAvatar: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#D9EEE8",
  },
  friendInitials: {
    color: colors.link,
    fontFamily: fonts.semiBold,
    fontSize: 11,
  },
  conversationContent: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
  },
  conversationTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  friendName: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 14,
    lineHeight: 19,
  },
  friendTime: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: 10,
    lineHeight: 15,
  },
  conversationPreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  friendPreview: {
    flex: 1,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 17,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  otherFriendCard: {
    minHeight: 58,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: colors.surface,
    shadowColor: "#173D33",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  otherFriendContent: {
    flex: 1,
    marginLeft: 12,
  },
  friendLocation: {
    marginTop: 1,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 15,
  },
  messageButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: "#E8F1EE",
  },
  addFriendsButton: {
    minHeight: 53,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  addFriendsLabel: {
    color: colors.surface,
    fontFamily: fonts.semiBold,
    fontSize: 14,
  },
});

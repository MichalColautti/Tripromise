import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, fonts } from "../constants/theme";
import useAuth from "../hooks/useAuth";
import {
  respondToFriendRequest as updateFriendRequest,
  searchUsers,
  sendFriendRequest as createFriendRequest,
  syncUserProfile,
  subscribeFriends,
  subscribeIncomingFriendRequests,
} from "../services/friendService";

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

function FriendAvatar({ initials, large = false, request = false }) {
  return (
    <View
      style={[
        styles.friendAvatar,
        large && styles.suggestedAvatar,
        request && styles.requestAvatar,
      ]}
    >
      <Text
        style={[
          styles.friendInitials,
          large && styles.suggestedInitials,
          request && styles.requestInitials,
        ]}
      >
        {initials}
      </Text>
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

function SuggestedTravelerCard({
  traveler,
  isSending,
  onAddFriend,
  onViewRequest,
}) {
  const isPending = traveler.requestStatus === "pending";
  const isAccepted = traveler.requestStatus === "accepted";
  const hasIncomingRequest = traveler.requestStatus === "incoming";
  const isDisabled = isSending || isPending || isAccepted;

  return (
    <View style={styles.suggestedCard}>
      <FriendAvatar initials={traveler.initials} large />
      <View style={styles.suggestedContent}>
        <Text numberOfLines={1} style={styles.suggestedName}>
          {traveler.name}
        </Text>
        <Text numberOfLines={1} style={styles.suggestedLocation}>
          {traveler.location}
        </Text>
        <Text numberOfLines={1} style={styles.suggestedDetail}>
          {isPending && traveler.id !== "oliver"
            ? "Request sent just now"
            : traveler.detail}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        disabled={isDisabled}
        onPress={() =>
          hasIncomingRequest ? onViewRequest() : onAddFriend(traveler.id)
        }
        style={[
          styles.addFriendAction,
          (isPending || isAccepted) && styles.pendingAction,
          isSending && styles.disabledAction,
        ]}
      >
        <Text
          style={[
            styles.addFriendActionLabel,
            (isPending || isAccepted) && styles.pendingLabel,
          ]}
        >
          {isSending
            ? "Sending"
            : isPending
              ? "Pending"
              : isAccepted
                ? "Friends"
                : hasIncomingRequest
                  ? "View request"
                  : "Add friend"}
        </Text>
      </Pressable>
    </View>
  );
}

function FriendRequestCard({ request, onAccept, onDecline, isBusy }) {
  return (
    <View style={styles.friendRequestCard}>
      <View style={styles.requestPersonRow}>
        <FriendAvatar initials={request.initials} request />
        <View style={styles.requestPersonInfo}>
          <Text style={styles.requestName}>{request.name}</Text>
          <Text style={styles.requestLocation}>{request.location}</Text>
        </View>
      </View>

      <Text style={styles.requestDetails}>{request.detail}</Text>

      <View style={styles.requestActions}>
        <Pressable
          accessibilityRole="button"
          disabled={isBusy}
          onPress={() => onAccept(request.id)}
          style={[styles.acceptButton, isBusy && styles.disabledAction]}
        >
          <Text style={styles.acceptButtonLabel}>Accept</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          disabled={isBusy}
          onPress={() => onDecline(request.id)}
          style={[styles.declineButton, isBusy && styles.disabledAction]}
        >
          <Text style={styles.declineButtonLabel}>Decline</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function ChatsScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Trips");
  const [currentView, setCurrentView] = useState("chats");
  const [searchQuery, setSearchQuery] = useState("");
  const [travelerResults, setTravelerResults] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [sendingIds, setSendingIds] = useState([]);
  const [respondingIds, setRespondingIds] = useState([]);
  const [isLoadingTravelers, setIsLoadingTravelers] = useState(false);
  const [friendRequestsLoaded, setFriendRequestsLoaded] = useState(false);
  const [relationshipError, setRelationshipError] = useState("");
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    if (!user?.id) return undefined;

    let isActive = true;
    let unsubscribeRequests = () => {};
    let unsubscribeFriends = () => {};

    const handleRelationshipError = () => {
      setRelationshipError("We couldn’t load friend data. Please try again.");
      setFriendRequestsLoaded(true);
    };

    const startSubscriptions = async () => {
      try {
        await syncUserProfile(user);
        if (!isActive) return;

        setFriendRequestsLoaded(false);
        setRelationshipError("");
        unsubscribeRequests = subscribeIncomingFriendRequests(
          user.id,
          (requests) => {
            setFriendRequests(requests);
            setFriendRequestsLoaded(true);
          },
          handleRelationshipError,
        );
        unsubscribeFriends = subscribeFriends(
          user.id,
          setFriends,
          handleRelationshipError,
        );
      } catch {
        handleRelationshipError();
      }
    };

    startSubscriptions();

    return () => {
      isActive = false;
      unsubscribeRequests();
      unsubscribeFriends();
    };
  }, [user]);

  useEffect(() => {
    if (currentView !== "addFriends" || !user?.id) return undefined;

    let isActive = true;
    const timeout = setTimeout(async () => {
      setSearchError("");
      setIsLoadingTravelers(true);
      try {
        const results = await searchUsers(user.id, searchQuery);
        if (isActive) setTravelerResults(results);
      } catch {
        if (isActive) {
          setTravelerResults([]);
          setSearchError("Couldn’t load travelers. Please try again.");
        }
      } finally {
        if (isActive) setIsLoadingTravelers(false);
      }
    }, searchQuery.trim() ? 300 : 0);

    return () => {
      isActive = false;
      clearTimeout(timeout);
    };
  }, [currentView, searchQuery, user?.id]);

  const sendFriendRequest = async (travelerId) => {
    if (!user?.id) return;

    setSendingIds((currentIds) => [...currentIds, travelerId]);
    setSearchError("");
    try {
      const requestStatus = await createFriendRequest(user.id, travelerId);
      setTravelerResults((currentResults) =>
        currentResults.map((traveler) =>
          traveler.id === travelerId ? { ...traveler, requestStatus } : traveler,
        ),
      );
    } catch {
      setSearchError("Couldn’t send the friend request. Please try again.");
    } finally {
      setSendingIds((currentIds) => currentIds.filter((id) => id !== travelerId));
    }
  };

  const respondToFriendRequest = async (requestId, accepted) => {
    setRespondingIds((currentIds) => [...currentIds, requestId]);
    setRelationshipError("");
    try {
      await updateFriendRequest(requestId, accepted ? "accepted" : "declined");
    } catch {
      setRelationshipError("Couldn’t update this request. Please try again.");
    } finally {
      setRespondingIds((currentIds) => currentIds.filter((id) => id !== requestId));
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.brandHeader}>
        <Text style={styles.brand}>Tripromise</Text>
      </View>

      {currentView === "addFriends" ? (
        <>
          <View style={styles.addFriendsHeader}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to friends"
              onPress={() => setCurrentView("chats")}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={22} color={colors.text} />
            </Pressable>
            <Text style={styles.addFriendsHeading}>Add friends</Text>
          </View>

          <Text style={styles.addFriendsSubtitle}>
            Find Tripromise travelers by name.
          </Text>

          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={22} color={colors.textMuted} />
            <TextInput
              accessibilityLabel="Search by name"
              autoCorrect={false}
              onChangeText={setSearchQuery}
              placeholder="Search by name"
              placeholderTextColor={colors.textMuted}
              returnKeyType="search"
              style={styles.searchInput}
              value={searchQuery}
            />
          </View>

          <ScrollView
            style={styles.suggestedList}
            contentContainerStyle={styles.suggestedListContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.suggestedSectionTitle}>Travelers on Tripromise</Text>
            <Text style={styles.suggestedSectionSubtitle}>
              Registered users
            </Text>
            {searchError ? (
              <Text style={styles.searchError}>{searchError}</Text>
            ) : null}
            <View style={styles.suggestedCards}>
              {isLoadingTravelers ? (
                <Text style={styles.noSuggestions}>Loading travelers…</Text>
              ) : searchError ? null : travelerResults.length > 0 ? (
                travelerResults.map((traveler) => (
                  <SuggestedTravelerCard
                    key={traveler.id}
                    traveler={traveler}
                    isSending={sendingIds.includes(traveler.id)}
                    onAddFriend={sendFriendRequest}
                    onViewRequest={() => setCurrentView("friendRequests")}
                  />
                ))
              ) : (
                <Text style={styles.noSuggestions}>
                  No travelers found. Try another name.
                </Text>
              )}
            </View>
          </ScrollView>
        </>
      ) : currentView === "friendRequests" ? (
        <>
          <View style={styles.addFriendsHeader}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Back to friends"
              onPress={() => setCurrentView("chats")}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={22} color={colors.text} />
            </Pressable>
            <Text style={styles.addFriendsHeading}>Friend requests</Text>
          </View>

          <Text style={styles.addFriendsSubtitle}>
            {!friendRequestsLoaded
              ? "Loading requests…"
              : friendRequests.length === 0
                ? "You’re all caught up."
                : `${friendRequests.length} ${friendRequests.length === 1 ? "traveler would" : "travelers would"} like to connect with you.`}
          </Text>

          <ScrollView
            style={styles.requestList}
            contentContainerStyle={styles.requestListContent}
            showsVerticalScrollIndicator={false}
          >
            {relationshipError ? (
              <Text style={styles.relationshipError}>{relationshipError}</Text>
            ) : !friendRequestsLoaded ? (
              <Text style={styles.noSuggestions}>Loading requests…</Text>
            ) : friendRequests.length > 0 ? (
              <>
                <View style={styles.requestCards}>
                  {friendRequests.map((request) => (
                    <FriendRequestCard
                      key={request.id}
                      request={request}
                      onAccept={(id) => respondToFriendRequest(id, true)}
                      onDecline={(id) => respondToFriendRequest(id, false)}
                      isBusy={respondingIds.includes(request.id)}
                    />
                  ))}
                </View>
                <Text style={styles.requestFooter}>
                  Accept requests to share plans and messages with your new travel friends.
                </Text>
              </>
            ) : (
              <View style={styles.emptyRequests}>
                <View style={styles.emptyRequestsIcon}>
                  <Ionicons
                    name="people-outline"
                    size={24}
                    color={colors.link}
                  />
                </View>
                <Text style={styles.emptyRequestsTitle}>No new requests</Text>
              </View>
            )}
          </ScrollView>
        </>
      ) : (
        <>
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
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Friend requests, ${friendRequests.length} waiting`}
                  onPress={() => setCurrentView("friendRequests")}
                  style={styles.requestsBanner}
                >
                  <View style={styles.requestsIcon}>
                    <Ionicons name="person-add-outline" size={20} color={colors.link} />
                  </View>
                  <View style={styles.requestsContent}>
                    <Text style={styles.requestsTitle}>Friend requests</Text>
                    <Text style={styles.requestsSubtitle}>
                      {friendRequestsLoaded
                        ? `${friendRequests.length} waiting for you`
                        : "Loading requests"}
                    </Text>
                  </View>
                  <View style={styles.requestCount}>
                    <Text style={styles.requestCountText}>{friendRequests.length}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.link} />
                </Pressable>

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
                    {friends.length > 0 ? (
                      friends.map((friend) => (
                        <OtherFriendCard key={friend.id} friend={friend} />
                      ))
                    ) : (
                      <Text style={styles.emptyFriends}>
                        No friends yet. Find a traveler to connect with.
                      </Text>
                    )}
                  </View>
                </View>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setSearchQuery("");
                    setCurrentView("addFriends");
                  }}
                  style={styles.addFriendsButton}
                >
                  <Ionicons
                    name="person-add-outline"
                    size={20}
                    color={colors.surface}
                  />
                  <Text style={styles.addFriendsLabel}>Add friends</Text>
                </Pressable>
              </>
            )}
          </ScrollView>
        </>
      )}
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
  addFriendsHeader: {
    height: 42,
    marginTop: 15,
    marginHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: colors.surface,
    shadowColor: "#173D33",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  addFriendsHeading: {
    color: colors.text,
    fontFamily: fonts.bold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.4,
  },
  addFriendsSubtitle: {
    marginTop: 8,
    marginHorizontal: 24,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
  },
  searchBox: {
    height: 56,
    marginTop: 16,
    marginHorizontal: 24,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.surface,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 0,
    color: colors.text,
    fontFamily: fonts.regular,
    fontSize: 14,
  },
  suggestedList: {
    flex: 1,
    marginTop: 24,
  },
  suggestedListContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  suggestedSectionTitle: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 16,
    lineHeight: 20,
  },
  suggestedSectionSubtitle: {
    marginTop: 2,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 16,
  },
  suggestedCards: {
    marginTop: 12,
    gap: 10,
  },
  suggestedCard: {
    minHeight: 86,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: colors.surface,
    shadowColor: "#173D33",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.045,
    shadowRadius: 8,
    elevation: 2,
  },
  suggestedAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  suggestedInitials: {
    fontSize: 12,
  },
  suggestedContent: {
    flex: 1,
    minWidth: 0,
    marginLeft: 12,
    marginRight: 10,
  },
  suggestedName: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 14,
    lineHeight: 19,
  },
  suggestedLocation: {
    marginTop: 1,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 17,
  },
  suggestedDetail: {
    marginTop: 1,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 15,
  },
  addFriendAction: {
    minWidth: 82,
    height: 36,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "#E8F1EE",
  },
  addFriendActionLabel: {
    color: colors.link,
    fontFamily: fonts.semiBold,
    fontSize: 10,
  },
  pendingAction: {
    backgroundColor: "#F0F4F2",
  },
  pendingLabel: {
    color: colors.textMuted,
  },
  noSuggestions: {
    paddingVertical: 20,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
  searchError: {
    marginTop: 10,
    color: colors.error,
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 17,
  },
  relationshipError: {
    paddingVertical: 20,
    color: colors.error,
    fontFamily: fonts.medium,
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
  },
  emptyFriends: {
    paddingVertical: 10,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  disabledAction: {
    opacity: 0.6,
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
  requestList: {
    flex: 1,
    marginTop: 34,
  },
  requestListContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  requestCards: {
    gap: 14,
  },
  friendRequestCard: {
    minHeight: 160,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: colors.surface,
    shadowColor: "#173D33",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.045,
    shadowRadius: 8,
    elevation: 2,
  },
  requestPersonRow: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  requestAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  requestInitials: {
    fontSize: 13,
  },
  requestPersonInfo: {
    flex: 1,
  },
  requestName: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 15,
    lineHeight: 20,
  },
  requestLocation: {
    marginTop: 1,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 17,
  },
  requestDetails: {
    marginTop: 10,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 17,
  },
  requestActions: {
    marginTop: 12,
    flexDirection: "row",
    gap: 12,
  },
  acceptButton: {
    flex: 1,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  acceptButtonLabel: {
    color: colors.surface,
    fontFamily: fonts.semiBold,
    fontSize: 13,
  },
  declineButton: {
    flex: 1,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  declineButtonLabel: {
    color: colors.text,
    fontFamily: fonts.medium,
    fontSize: 13,
  },
  requestFooter: {
    marginTop: 24,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 17,
  },
  emptyRequests: {
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: colors.surface,
  },
  emptyRequestsIcon: {
    width: 52,
    height: 52,
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 26,
    backgroundColor: "#D9EEE8",
  },
  emptyRequestsTitle: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 15,
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

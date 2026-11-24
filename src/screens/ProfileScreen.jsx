import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Card from "../components/Card";
import { colors, fonts } from "../constants/theme";
import useAuth from "../hooks/useAuth";

const profile = {
  location: "Warsaw, Poland",
  rating: 4.9,
  reviewsCount: 24,
  countriesCount: 8,
  tripsCount: 12,
  bio: "I love travelling, discovering new places and meeting people from different cultures. Always looking for my next adventure!",
  photo:
    "https://static.wikia.nocookie.net/viacom4633/images/e/ea/Squidward_in_2018.png/revision/latest/thumbnail/width/360/height/360?cb=20260810143028",
};

const reviews = [
  {
    id: "1",
    name: "Anna Nowak",
    date: "October 2026",
    rating: 5,
    trip: "Trip to Italy",
    comment:
      "Great travel companion! Everything was well organized and we had an amazing time together.",
  },
  {
    id: "2",
    name: "Peter Smith",
    date: "September 2026",
    rating: 5,
    trip: "Trip to Spain",
    comment:
      "Very friendly and helpful person. I would definitely travel together again!",
  },
];

function RatingStars({ rating }) {
  return (
    <View style={styles.stars}>
      {Array.from({ length: 5 }, (_, index) => (
        <Ionicons
          key={index}
          name={index < rating ? "star" : "star-outline"}
          size={14}
          color="#E5A000"
        />
      ))}
    </View>
  );
}

export default function ProfileScreen({ navigation }) {
  const { user } = useAuth();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pageTitle}>My Profile</Text>

      <View style={styles.profileHeader}>
        <Image source={{ uri: profile.photo }} style={styles.avatar} />

        <View style={styles.userInfo}>
          <Text style={styles.name}>{user?.name || "User"}</Text>

          <View style={styles.location}>
            <Ionicons
              name="location-outline"
              size={16}
              color={colors.textMuted}
            />
            <Text style={styles.locationText}>{profile.location}</Text>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Ionicons name="create-outline" size={16} color={colors.primary} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Card style={styles.ratingCard}>
        <View style={styles.ratingLeft}>
          <Ionicons name="star" size={25} color="#E5A000" />
          <View>
            <Text style={styles.ratingValue}>
              {profile.rating.toFixed(1)}
              <Text style={styles.ratingMax}> / 5.0</Text>
            </Text>
            <Text style={styles.ratingLabel}>Rating</Text>
          </View>
        </View>

        <View style={styles.ratingRight}>
          <Text style={styles.reviewsCount}>{profile.reviewsCount}</Text>
          <Text style={styles.ratingLabel}>Reviews</Text>
        </View>
      </Card>

      <View style={styles.stats}>
        <Card style={styles.statCard}>
          <View style={styles.statTop}>
            <Ionicons name="globe-outline" size={25} color={colors.primary} />
            <Text style={styles.statValue}>{profile.countriesCount}</Text>
          </View>
          <Text style={styles.statLabel}>Countries</Text>
        </Card>

        <Card style={styles.statCard}>
          <View style={styles.statTop}>
            <Ionicons
              name="airplane-outline"
              size={25}
              color={colors.primary}
            />
            <Text style={styles.statValue}>{profile.tripsCount}</Text>
          </View>
          <Text style={styles.statLabel}>Trips</Text>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Me</Text>
        <Card>
          <Text style={styles.bio}>{profile.bio}</Text>
        </Card>
      </View>

      <View style={styles.section}>
        <View style={styles.reviewsHeader}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          <Text style={styles.reviewsTotal}>
            {profile.reviewsCount} reviews
          </Text>
        </View>

        {reviews.map((review) => (
          <Card key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewTop}>
              <View style={styles.reviewAvatar}>
                <Text style={styles.reviewAvatarText}>
                  {review.name.charAt(0)}
                </Text>
              </View>

              <View style={styles.reviewAuthor}>
                <Text style={styles.reviewName}>{review.name}</Text>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
            </View>

            <View style={styles.reviewRating}>
              <RatingStars rating={review.rating} />
              <Text style={styles.reviewTrip}>{review.trip}</Text>
            </View>

            <Text style={styles.reviewComment}>{review.comment}</Text>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F5F4",
  },
  content: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 26,
    fontFamily: fonts.bold,
    color: "#222222",
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 16,
  },
  avatar: {
    width: 105,
    height: 105,
    borderRadius: 53,
    backgroundColor: "#E0E0E0",
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: "#222222",
    marginBottom: 7,
  },
  location: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: fonts.regular,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    marginTop: 12,
  },
  editButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: fonts.semiBold,
  },
  ratingCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    marginBottom: 16,
  },
  ratingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ratingValue: {
    fontSize: 21,
    fontFamily: fonts.bold,
    color: "#222222",
  },
  ratingMax: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  ratingLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.regular,
    marginTop: 3,
  },
  ratingRight: {
    alignItems: "center",
    paddingLeft: 25,
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  reviewsCount: {
    fontSize: 21,
    fontFamily: fonts.bold,
    color: "#222222",
  },
  stats: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
  },
  statTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statValue: {
    fontSize: 23,
    fontFamily: fonts.bold,
    color: "#222222",
  },
  statLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textMuted,
    marginTop: 10,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 19,
    fontFamily: fonts.bold,
    color: "#222222",
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    lineHeight: 22,
    color: "#555555",
    fontFamily: fonts.regular,
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewsTotal: {
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: fonts.regular,
  },
  reviewCard: {
    marginBottom: 12,
  },
  reviewTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  reviewAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E4EBE7",
    alignItems: "center",
    justifyContent: "center",
  },
  reviewAvatarText: {
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.primary,
  },
  reviewAuthor: {
    flex: 1,
  },
  reviewName: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: "#222222",
  },
  reviewDate: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 3,
  },
  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
    marginBottom: 10,
  },
  stars: {
    flexDirection: "row",
    gap: 2,
  },
  reviewTrip: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.medium,
  },
  reviewComment: {
    fontSize: 13,
    lineHeight: 20,
    color: "#555555",
    fontFamily: fonts.regular,
  },
});

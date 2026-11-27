import {
  collection,
  doc,
  endAt,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  startAt,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "./firebase";

const USER_PROFILES = "userProfiles";
const FRIEND_REQUESTS = "friendRequests";

function normalizeSearchText(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function profileFromSnapshot(snapshot) {
  const data = snapshot.data();
  const name = data.name || "Tripromise traveler";

  return {
    id: snapshot.id,
    initials: getInitials(name),
    name,
    location: data.location || "Tripromise member",
    detail: data.location ? `Based in ${data.location}` : "On Tripromise",
  };
}

function requestDocumentId(fromUid, toUid) {
  return `${fromUid}_${toUid}`;
}

export async function syncUserProfile(user) {
  if (!user?.id) return;

  const name =
    user.name?.trim().slice(0, 80) || user.email?.split("@")[0] || "Traveler";
  const profileRef = doc(db, USER_PROFILES, user.id);
  const profileSnapshot = await getDoc(profileRef);
  const profileData = {
    uid: user.id,
    name,
    nameSearch: normalizeSearchText(name),
    updatedAt: serverTimestamp(),
  };

  if (!profileSnapshot.exists()) {
    profileData.createdAt = serverTimestamp();
  }

  await setDoc(profileRef, profileData, { merge: true });
}

async function getRelationshipStatus(currentUserId, targetUserId) {
  const outgoingRef = doc(
    db,
    FRIEND_REQUESTS,
    requestDocumentId(currentUserId, targetUserId),
  );
  const incomingRef = doc(
    db,
    FRIEND_REQUESTS,
    requestDocumentId(targetUserId, currentUserId),
  );
  const [outgoingSnapshot, incomingSnapshot] = await Promise.all([
    getDoc(outgoingRef),
    getDoc(incomingRef),
  ]);
  const outgoingStatus = outgoingSnapshot.exists()
    ? outgoingSnapshot.data().status
    : null;
  const incomingStatus = incomingSnapshot.exists()
    ? incomingSnapshot.data().status
    : null;

  if (outgoingStatus === "accepted" || incomingStatus === "accepted") {
    return "accepted";
  }
  if (outgoingStatus === "pending") return "pending";
  if (incomingStatus === "pending") return "incoming";
  return null;
}

export async function searchUsers(currentUserId, searchTerm = "") {
  const normalizedTerm = normalizeSearchText(searchTerm);
  const constraints = [orderBy("nameSearch")];

  if (normalizedTerm) {
    constraints.push(startAt(normalizedTerm), endAt(`${normalizedTerm}\uf8ff`));
  }

  constraints.push(limit(10));

  const peopleQuery = query(
    collection(db, USER_PROFILES),
    ...constraints,
  );
  const snapshot = await getDocs(peopleQuery);
  const profiles = snapshot.docs
    .filter((profileSnapshot) => profileSnapshot.id !== currentUserId)
    .map(profileFromSnapshot);

  return Promise.all(
    profiles.map(async (profile) => ({
      ...profile,
      requestStatus: await getRelationshipStatus(currentUserId, profile.id),
    })),
  );
}

export async function sendFriendRequest(fromUid, toUid) {
  if (!fromUid || !toUid || fromUid === toUid) {
    throw new Error("A friend request needs two different users.");
  }

  const outgoingRef = doc(
    db,
    FRIEND_REQUESTS,
    requestDocumentId(fromUid, toUid),
  );
  const incomingRef = doc(
    db,
    FRIEND_REQUESTS,
    requestDocumentId(toUid, fromUid),
  );

  return runTransaction(db, async (transaction) => {
    const [outgoingSnapshot, incomingSnapshot] = await Promise.all([
      transaction.get(outgoingRef),
      transaction.get(incomingRef),
    ]);
    const outgoingStatus = outgoingSnapshot.exists()
      ? outgoingSnapshot.data().status
      : null;
    const incomingStatus = incomingSnapshot.exists()
      ? incomingSnapshot.data().status
      : null;

    if (outgoingStatus === "accepted" || incomingStatus === "accepted") {
      return "accepted";
    }
    if (outgoingStatus === "pending") return "pending";
    if (incomingStatus === "pending") return "incoming";

    const requestData = {
      fromUid,
      toUid,
      status: "pending",
      updatedAt: serverTimestamp(),
    };

    if (outgoingSnapshot.exists()) {
      transaction.update(outgoingRef, requestData);
    } else {
      transaction.set(outgoingRef, {
        ...requestData,
        createdAt: serverTimestamp(),
      });
    }

    return "pending";
  });
}

export function subscribeIncomingFriendRequests(userId, onChange, onError) {
  const incomingQuery = query(
    collection(db, FRIEND_REQUESTS),
    where("toUid", "==", userId),
    where("status", "==", "pending"),
    orderBy("updatedAt", "desc"),
  );

  return onSnapshot(
    incomingQuery,
    (snapshot) => {
      Promise.all(
        snapshot.docs.map(async (requestSnapshot) => {
          const request = requestSnapshot.data();
          const senderSnapshot = await getDoc(
            doc(db, USER_PROFILES, request.fromUid),
          );

          if (!senderSnapshot.exists()) return null;

          return {
            ...profileFromSnapshot(senderSnapshot),
            id: requestSnapshot.id,
            detail: "Wants to connect with you",
          };
        }),
      )
        .then((requests) => onChange(requests.filter(Boolean)))
        .catch(onError);
    },
    onError,
  );
}

export function subscribeFriends(userId, onChange, onError) {
  const outgoingQuery = query(
    collection(db, FRIEND_REQUESTS),
    where("fromUid", "==", userId),
    where("status", "==", "accepted"),
  );
  const incomingQuery = query(
    collection(db, FRIEND_REQUESTS),
    where("toUid", "==", userId),
    where("status", "==", "accepted"),
  );
  let outgoingIds = [];
  let incomingIds = [];
  let outgoingLoaded = false;
  let incomingLoaded = false;
  let requestVersion = 0;

  const emitFriends = async () => {
    if (!outgoingLoaded || !incomingLoaded) return;
    const version = ++requestVersion;
    const friendIds = [...new Set([...outgoingIds, ...incomingIds])];
    const profiles = await Promise.all(
      friendIds.map(async (friendId) => {
        const profileSnapshot = await getDoc(doc(db, USER_PROFILES, friendId));
        return profileSnapshot.exists()
          ? profileFromSnapshot(profileSnapshot)
          : null;
      }),
    );

    if (version === requestVersion) {
      onChange(profiles.filter(Boolean));
    }
  };

  const unsubscribeOutgoing = onSnapshot(
    outgoingQuery,
    (snapshot) => {
      outgoingIds = snapshot.docs.map((requestSnapshot) =>
        requestSnapshot.data().toUid,
      );
      outgoingLoaded = true;
      emitFriends().catch(onError);
    },
    onError,
  );
  const unsubscribeIncoming = onSnapshot(
    incomingQuery,
    (snapshot) => {
      incomingIds = snapshot.docs.map((requestSnapshot) =>
        requestSnapshot.data().fromUid,
      );
      incomingLoaded = true;
      emitFriends().catch(onError);
    },
    onError,
  );

  return () => {
    unsubscribeOutgoing();
    unsubscribeIncoming();
  };
}

export async function respondToFriendRequest(requestId, status) {
  if (status !== "accepted" && status !== "declined") {
    throw new Error("Unsupported friend request response.");
  }

  await updateDoc(doc(db, FRIEND_REQUESTS, requestId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

import { firestoreDb } from '@/firebase'

import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  deleteField,
  doc,
  endAt,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  startAfter,
  startAt,
  updateDoc,
  where
} from 'firebase/firestore'

const USERS_PATH = 'users'
const CHANNELS_PATH = 'chatChannels'
const MESSAGES_PATH = 'messages'
const MESSAGE_PATH = channelId => {
  return `${CHANNELS_PATH}/${channelId}/${MESSAGES_PATH}`
}

const TIMESTAMP_FIELD = 'timestamp'
const LAST_UPDATED_FIELD = 'lastUpdated'
const TYPING_USERS_FIELD = 'typingUsers'
const MESSAGE_REACTIONS_FIELD = 'reactions'
const CHANNEL_USERS_FIELD = 'users'

export const firestoreListener = onSnapshot
export const deleteDbField = deleteField()

const getDocuments = query => {
  return getDocs(query)
}

const getDocument = ref => {
  return getDoc(ref)
}

const addDocument = (ref, data) => {
  return addDoc(ref, data)
}

const setDocument = (path, docId, data) => {
  return setDoc(doc(firestoreDb, path, docId), data)
}

const updateDocument = (ref, data) => {
  return updateDoc(ref, data)
}

const deleteDocument = (ref, docId) => {
  return deleteDoc(doc(firestoreDb, ref, docId))
}

// USERS
const usersRef = collection(firestoreDb, USERS_PATH)

const userRef = userId => {
  return doc(firestoreDb, USERS_PATH, userId)
}

export const getAllUsers = () => {
  return getDocuments(query(usersRef))
}

export const getUser = userId => {
  return getDocument(userRef(userId))
}

export const addUser = data => {
  return addDocument(usersRef, data)
}

export const addIdentifiedUser = (userId, data) => {
  return setDocument(USERS_PATH, userId, data)
}

export const updateUser = (userId, data) => {
  return updateDocument(userRef(userId), data)
}

export const deleteUser = userId => {
  return deleteDocument(USERS_PATH, userId)
}

// CHANNELS
const channelsRef = collection(firestoreDb, CHANNELS_PATH)

const channelRef = channelId => {
  return doc(firestoreDb, CHANNELS_PATH, channelId)
}

export const channelsQuery = (currentUserId, channelsPerPage, lastChannel) => {
  if (lastChannel) {
    return query(
      channelsRef,
      where(USERS_PATH, 'array-contains', currentUserId),
      orderBy(LAST_UPDATED_FIELD, 'desc'),
      limit(channelsPerPage),
      startAfter(lastChannel)
    )
  } else {
    return query(
      channelsRef,
      where(USERS_PATH, 'array-contains', currentUserId),
      orderBy(LAST_UPDATED_FIELD, 'desc'),
      limit(channelsPerPage)
    )
  }
}

export const allChannelsQuery = (currentUserId) => {
  return query(
    channelsRef,
    where(USERS_PATH, 'array-contains', currentUserId),
    orderBy(LAST_UPDATED_FIELD, 'desc')
  )
}

export const getAllChannels = () => {
  return getDocuments(query(channelsRef))
}

export const getChannels = query => {
  return getDocuments(query)
}

export const getChannel = channelId => {
  return getDocument(channelRef(channelId))
}

export const addChannel = data => {
  return addDocument(channelsRef, data)
}

export const updateChannel = (channelId, data) => {
  return updateDocument(channelRef(channelId), data)
}

export const deleteChannel = channelId => {
  return deleteDocument(CHANNELS_PATH, channelId)
}

export const getUserChannels = (currentUserId, userId) => {
  return getDocuments(
    query(channelsRef, where(USERS_PATH, '==', [currentUserId, userId]))
  )
}

export const addChannelUsers = (channelId, userIds) => {
  console.log(userIds)
  return updateChannel(channelId, {
    [CHANNEL_USERS_FIELD]: arrayUnion(...userIds)
  })
}

export const removeChannelUser = (channelId, userId) => {
  return updateChannel(channelId, {
    [CHANNEL_USERS_FIELD]: arrayRemove(userId)
  })
}

export const updateChannelTypingUsers = (channelId, currentUserId, action) => {
  const arrayUpdate =
    action === 'add' ? arrayUnion(currentUserId) : arrayRemove(currentUserId)

  return updateChannel(channelId, { [TYPING_USERS_FIELD]: arrayUpdate })
}

// MESSAGES
const messagesRef = channelId => {
  return collection(firestoreDb, MESSAGE_PATH(channelId))
}

const messageRef = (channelId, messageId) => {
  return doc(firestoreDb, MESSAGE_PATH(channelId), messageId)
}

export const getMessages = (channelId, messagesPerPage, lastLoadedMessage) => {
  if (lastLoadedMessage) {
    return getDocuments(
      query(
        messagesRef(channelId),
        orderBy(TIMESTAMP_FIELD, 'desc'),
        limit(messagesPerPage),
        startAfter(lastLoadedMessage)
      )
    )
  } else if (messagesPerPage) {
    return getDocuments(
      query(
        messagesRef(channelId),
        orderBy(TIMESTAMP_FIELD, 'desc'),
        limit(messagesPerPage)
      )
    )
  } else {
    return getDocuments(messagesRef(channelId))
  }
}

export const getMessage = (channelId, messageId) => {
  return getDocument(messageRef(channelId, messageId))
}

export const addMessage = (channelId, data) => {
  return addDocument(messagesRef(channelId), data)
}

export const updateMessage = (channelId, messageId, data) => {
  return updateDocument(messageRef(channelId, messageId), data)
}

export const deleteMessage = (channelId, messageId) => {
  return deleteDocument(MESSAGE_PATH(channelId), messageId)
}

export const paginatedMessagesQuery = (
  channelId,
  lastLoadedMessage,
  previousLastLoadedMessage
) => {
  if (lastLoadedMessage && previousLastLoadedMessage) {
    return query(
      messagesRef(channelId),
      orderBy(TIMESTAMP_FIELD),
      startAt(lastLoadedMessage),
      endAt(previousLastLoadedMessage)
    )
  } else if (lastLoadedMessage) {
    return query(
      messagesRef(channelId),
      orderBy(TIMESTAMP_FIELD),
      startAt(lastLoadedMessage)
    )
  } else if (previousLastLoadedMessage) {
    return query(
      messagesRef(channelId),
      orderBy(TIMESTAMP_FIELD),
      endAt(previousLastLoadedMessage)
    )
  } else {
    return query(messagesRef(channelId), orderBy(TIMESTAMP_FIELD))
  }
}

export const lastMessageQuery = channelId => {
  return query(messagesRef(channelId), orderBy(TIMESTAMP_FIELD, 'desc'), limit(1))
}

export const newMessagesQuery = (channelId, currentUserId) => {
  return query(messagesRef(channelId), where('sender_id', '!=', currentUserId))
}

export const updateMessageReactions = (
  channelId,
  messageId,
  currentUserId,
  reactionUnicode,
  action
) => {
  const arrayUpdate =
    action === 'add' ? arrayUnion(currentUserId) : arrayRemove(currentUserId)

  return updateMessage(channelId, messageId, {
    [`${MESSAGE_REACTIONS_FIELD}.${reactionUnicode}`]: arrayUpdate
  })
}

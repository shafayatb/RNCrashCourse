import {
  APPWRITE_ENDPOINT,
  PLATFORM,
  APPWRITE_STORAGE_ID,
  APPWRITE_PROJECT_ID,
  APPWRITE_DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID,
  APPWRITE_VIDEO_COLLECTION_ID,
} from "@env";

export const appwriteConfig = {
  endpoint: APPWRITE_ENDPOINT,
  platform: PLATFORM,
  projectId: APPWRITE_PROJECT_ID,
  storageId: APPWRITE_STORAGE_ID,
  databaseId: APPWRITE_DATABASE_ID,
  userCollectionId: APPWRITE_USER_COLLECTION_ID,
  videoCollectionId: APPWRITE_VIDEO_COLLECTION_ID,
};

export const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = appwriteConfig;

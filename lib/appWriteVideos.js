import { Databases, ID, Query, Storage } from "react-native-appwrite";
import { databaseId, storageId, videoCollectionId } from "./appwrite";
import client from "./appWriteClient";

const databases = new Databases(client);
const storage = new Storage(client);

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
    ]);

    return posts.documents;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt", Query.limit(7)),
    ]);

    return posts.documents;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const searchPosts = async (query) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.search("title", query),
    ]);

    return posts.documents;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const getBookmarkedPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.equal("bookmarked", [userId]),
      Query.orderDesc("$createdAt"),
    ]);

    return posts.documents;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const getUserPosts = async (userId) => {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.equal("creator", userId),
      Query.orderDesc("$createdAt"),
    ]);

    return posts.documents;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const getFilePreview = async (fileId, type) => {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const uploadFile = async (file, type) => {
  if (!file) return;

  const { mimeType, ...rest } = file;

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile.$id, type);

    return {
      fileUrl,
      fileID: uploadedFile.$id,
    };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const createVideo = async (form) => {
  try {
    const [thumbnailInfo, videoInfo] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);
    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailInfo.fileUrl,
        video: videoInfo.fileUrl,
        prompt: form.prompt,
        creator: form.userId,
        thumbnailID: thumbnailInfo.fileID,
        videoFileID: videoInfo.fileID,
      }
    );

    return newPost;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const deletePosts = async (thumbnailID, videoFileID, videoId) => {
  try {
    await Promise.all([
      storage.deleteFile(storageId, thumbnailID),
      storage.deleteFile(storageId, videoFileID),
    ]);

    const result = await databases.deleteDocument(
      databaseId, // databaseId
      videoCollectionId, // collectionId
      videoId // documentId
    );

    console.log(result);

    //return result;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const bookmarkPosts = async (bookmarked, videoPostId) => {
  try {
    const result = await databases.updateDocument(
      databaseId,
      videoCollectionId,
      videoPostId,
      {
        bookmarked,
      }
    );

    return result;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const unbookmarkPosts = async (videoPost, user) => {
  try {
    const bookmarked = videoPost.bookmarked;

    const result = await databases.updateDocument(
      databaseId,
      videoCollectionId,
      videoPost.$id,
      {
        bookmarked,
      }
    );

    console.log(result);

    return result;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

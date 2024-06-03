import { Databases, ID, Query, Storage } from 'react-native-appwrite';
import { databaseId, storageId, videoCollectionId } from './appwrite';
import client from './appWriteClient';

const databases = new Databases(client);
const storage = new Storage(client);

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId
        )

        return posts.documents;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc("$createdAt", Query.limit(7))]
        )

        return posts.documents;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search("title", query)]
        )

        return posts.documents;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const getUserPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal("creator", userId)]
        )

        return posts.documents;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const getFilePreview = async (fileId, type) => {
    let fileUrl;

    try {
        if (type === 'video') {
            fileUrl = storage.getFileView(storageId, fileId)
        } else if (type === 'image') {
            fileUrl = storage.getFilePreview(
                storageId,
                fileId,
                2000,
                2000,
                'top',
                100
            )
        } else {
            throw new Error('Invalid file type');
        }

        if (!fileUrl) throw Error

        return fileUrl
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const uploadFile = async (file, type) => {
    if (!file) return;

    const { mimeType, ...rest } = file;

    const asset = { type: mimeType, ...rest }

    try {
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        )

        const fileUrl = await getFilePreview(uploadedFile.$id, type)

        return fileUrl;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export const createVideo = async (form) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video')
        ])
        console.log(thumbnailUrl)
        console.log(videoUrl)
        const newPost = await databases.createDocument(
            databaseId,
            videoCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.userId
            }
        )

        return newPost
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}
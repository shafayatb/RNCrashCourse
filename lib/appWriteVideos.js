import { Databases, Query } from 'react-native-appwrite';
import { databaseId, videoCollectionId} from './appwrite';
import client from './appWriteClient';

const databases = new Databases(client);

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
            Query.orderDesc['createdAt', Query.limit(7)]
        )

        return posts.documents;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}
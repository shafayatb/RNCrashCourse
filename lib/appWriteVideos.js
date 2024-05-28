import { Account, ID, Avatars, Databases, Query } from 'react-native-appwrite';
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
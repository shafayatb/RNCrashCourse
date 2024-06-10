import { Client } from "react-native-appwrite";
import { endpoint, projectId, platform } from "./appwrite";

const client = new Client();

client
  .setEndpoint(endpoint) // Your Appwrite Endpoint
  .setProject(projectId) // Your project ID
  .setPlatform(platform); // Your application ID or bundle ID.

export default client;

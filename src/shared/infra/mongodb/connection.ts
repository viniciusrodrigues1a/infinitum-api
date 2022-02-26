import { MongoClient, Collection } from "mongodb";

const user = process.env.MONGO_INITDB_ROOT_USERNAME;
const pass = process.env.MONGO_INITDB_ROOT_PASSWORD;

let host = "localhost";
if (process.env.DOCKER_RUNNING === "1") {
  host = "mongohost"; // docker hostname
}

const uri = `mongodb://${user}:${pass}@${host}:27017`;

type CollectionNames = "notificationSettings" | "notifications";

export const mongoHelper = {
  client: null as unknown as MongoClient,
  async connect(): Promise<void> {
    this.client = await MongoClient.connect(uri);
  },
  async destroy(): Promise<void> {
    if (this.client) {
      return this.client.close();
    }
  },
  getCollection(name: CollectionNames): Collection {
    return this.client.db("infinitum").collection(name);
  },
};

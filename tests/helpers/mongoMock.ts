import { MongoClient } from "mongodb";

export const mongoMock = {
  async close() {},
  db() {
    return {
      collection() {
        return {
          insertOne() {},
          findOne() {},
          updateOne() {},
        };
      },
    };
  },
} as unknown as MongoClient;

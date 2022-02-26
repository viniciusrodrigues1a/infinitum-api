import { MongoClient } from "mongodb";

export const mongoMock = {
  async close() {},
  db() {
    return {
      collection() {
        return {
          insertOne() {},
          findOne() {},
        };
      },
    };
  },
} as unknown as MongoClient;

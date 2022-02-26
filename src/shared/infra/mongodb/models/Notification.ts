import { ObjectId } from "mongodb";

export type Notification = {
  user_id: string;
  message: string;
  type: "INVITATION" | "KICKED" | "ROLE_UPDATED";
  metadata: Record<any, any>;
  id?: ObjectId;
};
